import _ from 'lodash'
import { Dispatch } from 'redux';
// import { DispatchType, strings } from '../features/resources';
import { conferenceJoined, conferenceLeft, conferenceTimestampChanged } from '../redux/conference';
import { trackRemoved } from '../redux/tracks';
import { createLocalTracksA, participantJoined, trackAdded } from './actions';
import { AVATAR_COLORS, AVATAR_URL_COMMAND, CAMERA_FACING_MODE, EMAIL_COMMAND, JitsiConferenceEvents, JitsiParticipantConnectionStatus, JitsiRecordingConstants, JitsiTrackErrors, MEDIA_TYPE, PARTICIPANT_ROLE } from './constants';
import JitsiMeetJS from 'lib-jitsi-meet'
import { dominantSpeakerChanged, participantLeft, participantUpdated, raiseHandUpdated } from '../redux/participants';
// import { navigate } from '../features/components/JitsiMeet/ConferenceNavigationRef';

/**
 * Constructs options to be passed to the constructor of {@code JitsiConnection}
 * based on the redux state.
 *
 * @returns {Object} The options to be passed to the constructor of
 * {@code JitsiConnection}.
 */
export function constructConfig(state: any): any {
    // Deep clone the options to make sure we don't modify the object in the
    // redux store.
    const { meetConfig: { config, locationURL: url }, conference: { room } } = state
    const options = _.cloneDeep(config);

    let { bosh, websocket } = options;
    const locationURL = new URL(url)
    // TESTING: Only enable WebSocket for some percentage of users.
    if (websocket) {
        if ((Math.random() * 100) >= (options?.testing?.mobileXmppWsThreshold ?? 0)) {
            websocket = undefined;
        }
    }

    // Normalize the BOSH URL.
    if (bosh && !websocket) {
        if (bosh.startsWith('//')) {
            // By default our config.js doesn't include the protocol.
            bosh = `${locationURL.protocol}${bosh}`;
        } else if (bosh.startsWith('/')) {
            const { protocol, host, pathname } = locationURL

            // eslint-disable-next-line max-len
            bosh = `${protocol}//${host}${pathname.split('/').pop() || '/'}${bosh.substr(1)}`;
        }
    }

    // WebSocket is preferred over BOSH.
    const serviceUrl = websocket || bosh;

    // Append room to the URL's search.
    if (serviceUrl && room) {
        const roomName = getBackendSafeRoomName(room);

        options.serviceUrl = `${serviceUrl}?room=${roomName}`;

        if (options.websocketKeepAliveUrl) {
            options.websocketKeepAliveUrl += `?room=${roomName}`;
        }
    }

    return options;
}

/**
 * Converts a room name to a backend-safe format. Properly lowercased and url encoded.
 *
 * @param {string?} room - The room name to convert.
 * @returns {string?}
 */
export function getBackendSafeRoomName(room?: string): string | undefined {
    if (!room) {
        return room;
    }

    /* eslint-disable no-param-reassign */
    try {
        // We do not know if we get an already encoded string at this point
        // as different platforms do it differently, but we need a decoded one
        // for sure. However since decoding a non-encoded string is a noop, we're safe
        // doing it here.
        room = decodeURIComponent(room);
    } catch (e) {
        // This can happen though if we get an unencoded string and it contains
        // some characters that look like an encoded entity, but it's not.
        // But in this case we're fine goin on...
    }

    // Normalize the character set.
    // room = normalizeNFKC(room);
    room = room.normalize('NFKC')

    // Only decoded and normalized strings can be lowercased properly.
    room = room.toLowerCase();

    // But we still need to (re)encode it.
    room = encodeURIComponent(room);
    /* eslint-enable no-param-reassign */

    // Unfortunately we still need to lowercase it, because encoding a string will
    // add some uppercase characters, but some backend services
    // expect it to be full lowercase. However lowercasing an encoded string
    // doesn't change the string value.
    return room.toLowerCase();
}

/**
 * Returns an object aggregating the conference options.
 *
 * @returns {Object} - Options object.
 */
export function getConferenceOptions(state: any): any {
    const { meetConfig: { config, locationURL: url } } = state
    const locationURL = new URL(url)
    const { email, name: nick } = getLocalParticipant(state)
    const options = { ...config };

    const tenant = ''

    if (tenant) {
        options.siteID = tenant;
    }

    if (options.enableDisplayNameInStats && nick) {
        options.statisticsDisplayName = nick;
    }

    if (options.enableEmailInStats && email) {
        options.statisticsId = email;
    }

    if (locationURL) {
        options.confID = `${locationURL.host}${getBackendSafePath(locationURL.pathname)}`;
    }

    options.applicationName = 'Nxatel';
    // options.transcriptionLanguage = determineTranscriptionLanguage(options);

    // Disable analytics, if requested.
    if (options.disableThirdPartyRequests) {
        delete config.analytics?.scriptURLs;
        delete config.analytics?.amplitudeAPPKey;
        delete config.analytics?.googleAnalyticsTrackingId;
        delete options.callStatsID;
        delete options.callStatsSecret;
    } else {
        // options.getWiFiStatsMethod = getWiFiStatsMethod;
    }

    return options;
}

/**
 * Converts a path to a backend-safe format, by splitting the path '/' processing each part.
 * Properly lowercased and url encoded.
 *
 * @param {string?} path - The path to convert.
 * @returns {string?}
 */
export function getBackendSafePath(path?: string): string | null | undefined {
    if (!path) {
        return path;
    }
    return path
        .split('/')
        .map(getBackendSafeRoomName)
        .join('/');
}

/**
 * Loads config.js from a specific remote server.
 *
 * @param {string} url - The URL to load.
 * @returns {Promise<Object>}
 */
export async function loadConfig(url: string): Promise<Object> {
    try {
        const controller = new AbortController();
        const signal = controller.signal;

        const timer = setTimeout(() => {
            controller.abort();
        }, 2 * 60 * 1000);

        const response = await fetch(url, { signal });
        // If the timeout hits the above will raise AbortError.

        clearTimeout(timer);

        switch (response.status) {
            case 200: {
                const configTxt = await response.text();
                const configJson = eval(`()=>{${configTxt}\nreturn JSON.stringify(config)}`)()
                const config = JSON.parse(configJson);
                if (typeof config !== 'object') {
                    throw new Error('config is not an object');
                }
                console.info(`Config loaded from ${url}`);
                return config;
            }
            default:
                throw new Error(`loadScript error: ${response.statusText}`);
        }

    } catch (err) {
        throw new Error(`loadScript error: ${err.message}`);
    }
}

/**
 * Returns the current {@code JitsiConference} which is joining or joined and is
 * not leaving. Please note the contrast with merely reading the
 * {@code conference} state of the conference which is not joining
 * but may be leaving already.
 *
 * @param {object} state - The redux store, state, or
 * {@code getState} function.
 * @returns {JitsiConference|undefined}
 */
export function getCurrentConference(state: object): JitsiConference | undefined {
    const { conference, joining, leaving, membersOnly, passwordRequired }
        = state['conference'];

    // There is a precedence
    if (conference) {
        return conference === leaving ? undefined : conference;
    }

    return joining || passwordRequired || membersOnly;
}

/**
 * Sends a representation of the local participant such as her avatar (URL),
 * email address, and display name to (the remote participants of) a specific
 * conference.
 *
 * @param {Function|Object} state - The redux store, state, or
 * {@code getState} function.
 * @param {JitsiConference} conference - The {@code JitsiConference} to which
 * the representation of the local participant is to be sent.
 * @returns {void}
 */
export function sendLocalParticipant(
    state: Object,
    conference: {
        sendCommand: Function,
        setDisplayName: Function,
        setLocalParticipantProperty: Function
    }): void {
    const {
        avatarURL,
        email,
        features,
        name
    } = getLocalParticipant(state);

    avatarURL && conference.sendCommand(AVATAR_URL_COMMAND, {
        value: avatarURL
    });
    email && conference.sendCommand(EMAIL_COMMAND, {
        value: email
    });

    if (features && features['screen-sharing'] === 'true') {
        conference.setLocalParticipantProperty('features_screen-sharing', true);
    }

    conference.setDisplayName(name);
}

/**
 * Adds conference (event) listeners.
 *
 * @param {JitsiConference} conference - The JitsiConference instance.
 * @param {Dispatch} dispatch - The Redux dispatch function.
 * @param {Object} state - The Redux state.
 *
 * @returns {void}
 */
export function addConferenceListeners(conference: any, dispatch: Dispatch, state: any): void {
    // A simple console for conference errors received through
    // the listener. These errors are not handled now, but logged.
    conference.on(JitsiConferenceEvents.CONFERENCE_ERROR,
        (error: any) => console.error('Conference error.', error));

    // Dispatches into features/base/conference follow:

    conference.on(
        JitsiConferenceEvents.CONFERENCE_FAILED,
        (...args) => {
            console.log('---CONFERENCE_FAILED---', ...args)
            // dispatch(conferenceFailed(conference, ...args))
        });
    conference.on(
        JitsiConferenceEvents.CONFERENCE_JOINED,
        (...args) => {
            console.log('---CONFERENCE_JOINED---', ...args)
            dispatch(conferenceJoined(conference))
            // navigate(strings.NavigationKeys.conference)
        });
    conference.on(
        JitsiConferenceEvents.CONFERENCE_LEFT,
        () => {
            dispatch(conferenceLeft());
            dispatch(conferenceTimestampChanged(0));
        });
    // conference.on(JitsiConferenceEvents.SUBJECT_CHANGED,
    //     (...args) => dispatch(conferenceSubjectChanged(...args)));

    conference.on(JitsiConferenceEvents.CONFERENCE_CREATED_TIMESTAMP,
        (...args: any) => {
            console.log('---conferenceTimeStamp---', ...args)
            dispatch(conferenceTimestampChanged(...args))
        });

    // conference.on(
    //     JitsiConferenceEvents.KICKED,
    //     (...args) => dispatch(kickedOut(conference, ...args)));

    // conference.on(
    //     JitsiConferenceEvents.PARTICIPANT_KICKED,
    //     (kicker, kicked) => dispatch(participantKicked(kicker, kicked)));

    // conference.on(
    //     JitsiConferenceEvents.LOCK_STATE_CHANGED,
    //     (...args) => dispatch(lockStateChanged(conference, ...args)));

    // // Dispatches into features/base/media follow:

    // conference.on(
    //     JitsiConferenceEvents.STARTED_MUTED,
    //     () => {
    //         const audioMuted = Boolean(conference.isStartAudioMuted());
    //         const videoMuted = Boolean(conference.isStartVideoMuted());
    //         const localTracks = getLocalTracks(state['features/base/tracks']);

    //         sendAnalytics(createStartMutedConfigurationEvent('remote', audioMuted, videoMuted));
    //         console.log(`Start muted: ${audioMuted ? 'audio, ' : ''}${videoMuted ? 'video' : ''}`);

    //         // XXX Jicofo tells lib-jitsi-meet to start with audio and/or video
    //         // muted i.e. Jicofo expresses an intent. Lib-jitsi-meet has turned
    //         // Jicofo's intent into reality by actually muting the respective
    //         // tracks. The reality is expressed in base/tracks already so what
    //         // is left is to express Jicofo's intent in base/media.
    //         // TODO Maybe the app needs to learn about Jicofo's intent and
    //         // transfer that intent to lib-jitsi-meet instead of lib-jitsi-meet
    //         // acting on Jicofo's intent without the app's knowledge.
    //         dispatch(setAudioMuted(audioMuted));
    //         dispatch(setVideoMuted(videoMuted));

    //         // Remove the tracks from peerconnection as well.
    //         for (const track of localTracks) {
    //             const trackType = track.jitsiTrack.getType();

    //             // Do not remove the audio track on RN. Starting with iOS 15 it will fail to unmute otherwise.
    //             if ((audioMuted && trackType === MEDIA_TYPE.AUDIO && navigator.product !== 'ReactNative')
    //                 || (videoMuted && trackType === MEDIA_TYPE.VIDEO)) {
    //                 dispatch(replaceLocalTrack(track.jitsiTrack, null, conference));
    //             }
    //         }
    //     });

    // conference.on(
    //     JitsiConferenceEvents.AUDIO_UNMUTE_PERMISSIONS_CHANGED,
    //     disableAudioMuteChange => {
    //         dispatch(setAudioUnmutePermissions(disableAudioMuteChange));
    //     });

    // conference.on(
    //     JitsiConferenceEvents.VIDEO_UNMUTE_PERMISSIONS_CHANGED,
    //     disableVideoMuteChange => {
    //         dispatch(setVideoUnmutePermissions(disableVideoMuteChange));
    //     });

    // Dispatches into tracks follow:

    conference.on(
        JitsiConferenceEvents.TRACK_ADDED,
        (t: { isLocal: () => any; }) => {
            console.log('---track-added-t---', t?.isLocal())
            t && !t.isLocal() && dispatch(trackAdded(t))
        });
    conference.on(
        JitsiConferenceEvents.TRACK_REMOVED,
        (t: { isLocal: () => any; }) => {
            console.log('---track-removed-t---', t?.isLocal())
            t && !t.isLocal() && dispatch(trackRemoved(t))
        });

    // conference.on(
    //     JitsiConferenceEvents.TRACK_MUTE_CHANGED,
    //     (track, participantThatMutedUs) => {
    //         if (participantThatMutedUs) {
    //             dispatch(participantMutedUs(participantThatMutedUs, track));
    //         }
    //     });

    // conference.on(JitsiConferenceEvents.TRACK_UNMUTE_REJECTED, track => dispatch(destroyLocalTracks(track)));

    // Dispatches into participants follow:
    conference.on(
        JitsiConferenceEvents.DISPLAY_NAME_CHANGED,
        (id: any, displayName: any) => dispatch(participantUpdated({
            conference,
            id,
            name: displayName
        })));

    conference.on(
        JitsiConferenceEvents.DOMINANT_SPEAKER_CHANGED,
        (dominant: any, previous: any) => dispatch(dominantSpeakerChanged({ id: dominant, previousSpeakers: previous, conference })));

    // conference.on(
    //     JitsiConferenceEvents.ENDPOINT_MESSAGE_RECEIVED,
    //     (...args) => dispatch(endpointMessageReceived(...args)));

    // conference.on(
    //     JitsiConferenceEvents.NON_PARTICIPANT_MESSAGE_RECEIVED,
    //     (...args) => dispatch(nonParticipantMessageReceived(...args)));

    // conference.on(
    //     JitsiConferenceEvents.PARTICIPANT_CONN_STATUS_CHANGED,
    //     (...args) => dispatch(participantConnectionStatusChanged(...args)));

    conference.on(
        JitsiConferenceEvents.USER_JOINED,
        (id: string, user: any) => commonUserJoinedHandling(dispatch, conference, user))
    conference.on(
        JitsiConferenceEvents.USER_LEFT,
        (id: string, user: any) => commonUserLeftHandling(dispatch, conference, user));
    conference.on(
        JitsiConferenceEvents.USER_ROLE_CHANGED,
        (id: any, role: any) => dispatch(participantUpdated({ id, role })));
    // conference.on(
    //     JitsiConferenceEvents.USER_STATUS_CHANGED,
    //     (...args) => dispatch(participantPresenceChanged(...args)));

    // conference.on(
    //     JitsiConferenceEvents.BOT_TYPE_CHANGED,
    //     (id, botType) => dispatch(participantUpdated({
    //         conference,
    //         id,
    //         botType
    //     })));

    conference.addCommandListener(
        AVATAR_URL_COMMAND,
        (data: { value: any; }, id: any) => dispatch(participantUpdated({
            conference,
            id,
            avatarURL: data.value
        })));
    conference.addCommandListener(
        EMAIL_COMMAND,
        (data: { value: any; }, id: any) => dispatch(participantUpdated({
            conference,
            id,
            email: data.value
        })));
}

/**
 * Adds conference (feature) listeners.
 *
 * @param {JitsiConference} conference - The JitsiConference instance.
 * @param {{dispatch:DispatchType;getState:any}} store - The Redux dispatch function.
 *
 * @returns {void}
 */
export function addConferenceFeatureEvents(conference: JitsiConference, store: { dispatch: DispatchType; getState: any; }): void {
    const propertyHandlers = {
        // 'e2ee.enabled': (participant, value) => _e2eeUpdated(store, conference, participant.getId(), value),
        // 'features_e2ee': (participant, value) =>
        //     store.dispatch(participantUpdated({
        //         conference,
        //         id: participant.getId(),
        //         e2eeSupported: value
        //     })),
        // 'features_jigasi': (participant, value) =>
        //     store.dispatch(participantUpdated({
        //         conference,
        //         id: participant.getId(),
        //         isJigasi: value
        //     })),
        'features_screen-sharing': (participant: { getId: () => any; }, value: any) => {
            console.log(participant.getId(), '---features_screen_sharing---', value)
            store.dispatch(participantUpdated({
                conference,
                id: participant.getId(),
                features: { 'screen-sharing': true }
            }))
        },
        'raisedHand': (participant: { getId: () => string; }, value: any) => {
            const { id } = getLocalParticipant(store.getState())
            console.log(participant.getId(), '---', id, '---features_raisedHand---', value)
            _raiseHandUpdated(store, conference, participant.getId(), value)
        },
        // 'region': (participant, value) =>
        //     store.dispatch(participantUpdated({
        //         conference,
        //         id: participant.getId(),
        //         region: value
        //     })),
        // 'remoteControlSessionStatus': (participant, value) =>
        //     store.dispatch(participantUpdated({
        //         conference,
        //         id: participant.getId(),
        //         remoteControlSessionStatus: value
        //     }))
    };

    // update properties for the participants that are already in the conference
    conference.getParticipants().forEach((participant: { getProperty: (arg0: string) => any; }) => {
        for (const propertyName in propertyHandlers) {
            const value = participant.getProperty(propertyName);
            console.log(propertyName, '---fetaures---', value)
            if (value !== undefined) {
                propertyHandlers[propertyName](participant, value);
            }
        }
    });

    // We joined a conference
    conference.on(
        JitsiConferenceEvents.PARTICIPANT_PROPERTY_CHANGED,
        (participant: any, propertyName: PropertyKey, oldValue: any, newValue: any) => {
            console.log('---PARTICIPANT_PROPERTY_CHANGED-middleware---', propertyName, '---', newValue, '---', oldValue, '---', participant)
            if (propertyHandlers.hasOwnProperty(propertyName)) {
                propertyHandlers[propertyName](participant, newValue);
            }
        });
}

/**
 * Handles a raise hand status update.
 *
 * @param {{dispatch:DispatchType;getState:Function}} store - The Redux store.
 * @param {Object} conference - The conference for which we got an update.
 * @param {string} participantId - The ID of the participant from which we got an update.
 * @param {any} newValue - The new value of the raise hand status.
 * @returns {void}
 */
function _raiseHandUpdated({ dispatch, getState }: { dispatch: DispatchType; getState: Function; }, conference: object, participantId: string, newValue: any): void {
    let raisedHandTimestamp: number;

    switch (newValue) {
        case undefined:
        case 'false':
            raisedHandTimestamp = 0;
            break;
        case 'true':
            raisedHandTimestamp = Date.now();
            break;
        default:
            raisedHandTimestamp = parseInt(newValue, 10);
    }

    dispatch(participantUpdated({
        conference,
        id: participantId,
        raisedHandTimestamp
    }));

    dispatch(raiseHandUpdated({
        id: participantId,
        raisedHandTimestamp
    }));

    // const isModerator = isLocalParticipantModerator(state);
    // const participant = getParticipantById(state, participantId);
    // let shouldDisplayAllowAction = false;

    // if (isModerator) {
    //     shouldDisplayAllowAction = isForceMuted(participant, MEDIA_TYPE.AUDIO, state)
    //         || isForceMuted(participant, MEDIA_TYPE.VIDEO, state);
    // }

    // const action = shouldDisplayAllowAction ? {
    //     customActionNameKey: ['notify.allowAction'],
    //     customActionHandler: [() => dispatch(approveParticipant(participantId))]
    // } : {};

    // if (raisedHandTimestamp) {
    //     let notificationTitle;
    //     const participantName = getParticipantDisplayName(state, participantId);
    //     const { raisedHandsQueue } = state['features/base/participants'];

    //     if (raisedHandsQueue.length > 1) {
    //         const raisedHands = raisedHandsQueue.length - 1;

    //         notificationTitle = i18n.t('notify.raisedHands', {
    //             participantName,
    //             raisedHands
    //         });
    //     } else {
    //         notificationTitle = participantName;
    //     }
    //     dispatch(showNotification({
    //         titleKey: 'notify.somebody',
    //         title: notificationTitle,
    //         descriptionKey: 'notify.raisedHand',
    //         raiseHandNotification: true,
    //         concatText: true,
    //         uid: RAISE_HAND_NOTIFICATION_ID,
    //         ...action
    //     }, shouldDisplayAllowAction ? NOTIFICATION_TIMEOUT_TYPE.MEDIUM : NOTIFICATION_TIMEOUT_TYPE.SHORT));
    //     dispatch(playSound(RAISE_HAND_SOUND_ID));
    // }
}

/**
 * Returns an array containing the local tracks with or without a (valid)
 * {@code JitsiTrack}.
 *
 * @param {Track[]} tracks - An array containing all local tracks.
 * @param {boolean} [includePending] - Indicates whether a local track is to be
 * returned if it is still pending. A local track is pending if
 * {@code getUserMedia} is still executing to create it and, consequently, its
 * {@code jitsiTrack} property is {@code undefined}. By default a pending local
 * track is not returned.
 * @returns {Track[]}
 */
export function getLocalTracks(tracks: Track[] = []): Track[] {
    return tracks.filter(t => t.local && t.jitsiTrack);
}

/**
 * Returns local track by media type.
 *
 * @param {Track[]} tracks - List of all tracks.
 * @param {MEDIA_TYPE} mediaType - Media type.
 * @param {boolean} [includePending] - Indicates whether a local track is to be
 * returned if it is still pending. A local track is pending if
 * {@code getUserMedia} is still executing to create it and, consequently, its
 * {@code jitsiTrack} property is {@code undefined}. By default a pending local
 * track is not returned.
 * @returns {(Track|undefined)}
 */
export function getLocalTrack(tracks: Track[] = [], mediaType: MEDIA_TYPE): (Track | undefined) {
    return (
        getLocalTracks(tracks)
            .find(t => t.mediaType === mediaType));
}

/**
 * Returns local video track.
 *
 * @param {Track[]} tracks - List of all tracks.
 * @returns {(Track|undefined)}
 */
export function getLocalVideoTrack(tracks: Track[]): (Track | undefined) {
    return getLocalTrack(tracks, MEDIA_TYPE.VIDEO);
}

/**
 * Attach a set of local tracks to a conference.
 *
 * @param {JitsiConference} conference - Conference instance.
 * @param {JitsiLocalTrack[]} localTracks - List of local media tracks.
 * @protected
 * @returns {Promise}
 */
export function addLocalTracksToConference(
    conference: { addTrack: Function, getLocalTracks: Function },
    localTracks: Array<{}>): Promise<any> {
    const conferenceLocalTracks = conference.getLocalTracks();
    const promises: any[] = [];
    for (const track of localTracks) {
        // XXX The library lib-jitsi-meet may be draconian, for example, when
        // adding one and the same video track multiple times.
        if (conferenceLocalTracks.indexOf(track) === -1) {
            promises.push(
                conference.addTrack(track)
                    .catch((err: any) => {
                        console.log('---addTrack-error---', err)
                    })
            );
        }
    }
    return Promise.all(promises);
}

/**
 * Returns true if the provided {@code JitsiTrack} should be rendered as a
 * mirror.
 *
 * We only want to show a video in mirrored mode when:
 * 1) The video source is local, and not remote.
 * 2) The video source is a camera, not a desktop (capture).
 * 3) The camera is capturing the user, not the environment.
 *
 * TODO Similar functionality is part of lib-jitsi-meet. This function should be
 * removed after https://github.com/jitsi/lib-jitsi-meet/pull/187 is merged.
 *
 * @param {(JitsiLocalTrack|JitsiRemoteTrack)} track - JitsiTrack instance.
 * @private
 * @returns {boolean}
 */
export function shouldMirror(track: (JitsiLocalTrack | JitsiRemoteTrack)): boolean {
    return (
        track
        && track.isLocal()
        && track.isVideoTrack()

        // XXX The type of the return value of JitsiLocalTrack's
        // getCameraFacingMode happens to be named CAMERA_FACING_MODE as
        // well, it's defined by lib-jitsi-meet. Note though that the type
        // of the value on the right side of the equality check is defined
        // by jitsi-meet. The type definitions are surely compatible today
        // but that may not be the case tomorrow.
        && track.getCameraFacingMode() === CAMERA_FACING_MODE.USER);
}

/**
 * Logic shared between web and RN which processes the {@code USER_JOINED}
 * conference event and dispatches either {@link participantJoined} or
 * {@link hiddenParticipantJoined}.
 *
 * @param {Object} store - The redux store.
 * @param {JitsiMeetConference} conference - The conference for which the
 * {@code USER_JOINED} event is being processed.
 * @param {JitsiParticipant} user - The user who has just joined.
 * @returns {void}
 */
function commonUserJoinedHandling(
    dispatch: Function,
    conference: Object,
    user: any): void {
    const id = user.getId();
    const displayName = user.getDisplayName();

    console.log("userJoined---->" , displayName);

    if (user.isHidden()) {
        // dispatch(hiddenParticipantJoined(id, displayName));
    } else {
        // const isReplacing = user.isReplacing && user.isReplacing();
        dispatch(participantJoined({
            botType: user.getBotType(),
            conference,
            id,
            name: displayName,
            presence: user.getStatus(),
            role: user.getRole(),
            // isReplacing,
            sources: user.getSources()
        }));
    }
}

/**
 * Logic shared between web and RN which processes the {@code USER_LEFT}
 * conference event and dispatches either {@link participantLeft} or
 * {@link hiddenParticipantLeft}.
 *
 * @param {Object} store - The redux store.
 * @param {JitsiMeetConference} conference - The conference for which the
 * {@code USER_LEFT} event is being processed.
 * @param {JitsiParticipant} user - The user who has just left.
 * @returns {void}
 */
export function commonUserLeftHandling(dispatch: Function, conference: Object, user: any): void {
    const id = user.getId();
    if (user.isHidden()) {
        // dispatch(hiddenParticipantLeft(id));
    } else {
        // const isReplaced = user.isReplaced && user.isReplaced();
        dispatch(participantLeft({
            id, conference,
            // isReplaced
        }));
    }
}

/**
 * Returns local participant from Redux state.
 *
 * {@code getState} function to be used to retrieve the state
 * features/base/participants.
 * @returns {(Participant|undefined)}
 */
export function getLocalParticipant(state: any): (Participant | undefined) {
    const { local } = state['participants'];
    return local;
}

/**
 * Mutes or unmutes a local track with a specific media type.
 *
 * @param {Store} store - The redux store in which the specified action is
 * dispatched.
 * @param {Boolean} muted - The value to tell whether to mute or unmute.
 * @param {MEDIA_TYPE} mediaType - The {@link MEDIA_TYPE} of the local track
 * which is being muted or unmuted.
 * @private
 * @returns {void}
 */
export function setMuted({ getState, dispatch }: Store, muted: boolean, mediaType: MEDIA_TYPE): void {
    const state = getState()
    const localTrack = getLocalTrack(state['tracks'], mediaType);
    if (localTrack) {
        // The `jitsiTrack` property will have a value only for a localTrack for
        // which `getUserMedia` has already completed. If there's no
        // `jitsiTrack`, then the `muted` state will be applied once the
        // `jitsiTrack` is created.
        const { jitsiTrack } = localTrack;
        // screenshare cannot be muted or unmuted using the video mute button
        // anymore, unless it is muted by audioOnly.
        jitsiTrack && (jitsiTrack.videoType !== 'desktop')
            && setTrackMuted(jitsiTrack, muted);
    } else if (!muted) {
        // FIXME: This only runs on mobile now because web has its own way of
        // creating local tracks. Adjust the check once they are unified.
        dispatch(createLocalTracksA({ devices: [mediaType] }));
    }
}

/**
 * Mutes or unmutes a specific {@code JitsiLocalTrack}. If the muted state of
 * the specified {@code track} is already in accord with the specified
 * {@code muted} value, then does nothing.
 *
 * @param {JitsiLocalTrack} track - The {@code JitsiLocalTrack} to mute or
 * unmute.
 * @param {boolean} muted - If the specified {@code track} is to be muted, then
 * {@code true}; otherwise, {@code false}.
 * @returns {Promise}
 */
export function setTrackMuted(track: Track, muted: boolean): Promise<any> {
    muted = Boolean(muted); // eslint-disable-line no-param-reassign

    if (track.isMuted() === muted) {
        return Promise.resolve();
    }

    const f = muted ? 'mute' : 'unmute';

    return track[f]().catch((error: { name: any; }) => {
        // Track might be already disposed so ignore such an error.
        if (error.name !== JitsiTrackErrors.TRACK_IS_DISPOSED) {
            // FIXME Emit mute failed, so that the app can show error dialog.
            console.error(`set track ${f} failed`, error);
        }
    });
}

/**
 * Disposes passed tracks.
 *
 * @param {(JitsiLocalTrack|JitsiRemoteTrack)[]} tracks - List of tracks.
 * @private
 * @returns {Promise} - A Promise resolved once {@link JitsiTrack.dispose()} is
 * done for every track from the list.
 */
export function disposeTracks(tracks: (JitsiLocalTrack | JitsiRemoteTrack)[]): Promise<any> {
    return Promise.all(
        tracks.map(t =>
            t.dispose()
                .catch((err: { name: any; }) => {
                    // Track might be already disposed so ignore such an error.
                    // Of course, re-throw any other error(s).
                    if (err.name !== JitsiTrackErrors.TRACK_IS_DISPOSED) {
                        throw err;
                    }
                })));
}

/**
 * Create local tracks of specific types.
 *
 * @param {Object} options - The options with which the local tracks are to be
 * created.
 * @param {string|null} [options.cameraDeviceId] - Camera device id or
 * {@code undefined} to use app's settings.
 * @param {string[]} options.devices - Required track types such as 'audio'
 * and/or 'video'.
 * @param {string|null} [options.micDeviceId] - Microphone device id or
 * {@code undefined} to use app's settings.
 * @param {number|undefined} [oprions.timeout] - A timeout for JitsiMeetJS.createLocalTracks used to create the tracks.
 * @param {boolean} [options.firePermissionPromptIsShownEvent] - Whether lib-jitsi-meet
 * should check for a {@code getUserMedia} permission prompt and fire a
 * corresponding event.
 * @param {boolean} [options.fireSlowPromiseEvent] - Whether lib-jitsi-meet
 * should check for a slow {@code getUserMedia} request and fire a
 * corresponding event.
 * @param {Object} store - The redux store in the context of which the function
 * is to execute and from which state such as {@code config} is to be retrieved.
 * @returns {Promise<JitsiLocalTrack[]>}
 */
export function createLocalTracksF(options: any = {}, store: any): Promise<JitsiLocalTrack[]> {
    let { cameraDeviceId, micDeviceId } = options;
    const {
        desktopSharingSourceDevice,
        desktopSharingSources,
        firePermissionPromptIsShownEvent,
        fireSlowPromiseEvent,
        timeout
    } = options;

    const state = store.getState();
    const { config = {} } = state['meetConfig']
    const {
        constraints: config_constraints,
        desktopSharingFrameRate,
        firefox_fake_device, // eslint-disable-line camelcase
        resolution
    } = config;
    const constraints = options.constraints ?? config_constraints;
    return JitsiMeetJS.createLocalTracks(
        {
            cameraDeviceId,
            constraints,
            desktopSharingFrameRate,
            desktopSharingSourceDevice,
            desktopSharingSources,

            // Copy array to avoid mutations inside library.
            devices: options.devices.slice(0),
            effects: [],
            firefox_fake_device, // eslint-disable-line camelcase
            firePermissionPromptIsShownEvent,
            fireSlowPromiseEvent,
            micDeviceId,
            resolution,
            timeout
        })
        .catch((err: any) => {
            console.error('Failed to create local tracks', options.devices, err);
            return Promise.reject(err);
        });
}

/**
 * Checks if the first local track in the given tracks set is muted.
 *
 * @param {Track[]} tracks - List of all tracks.
 * @param {MEDIA_TYPE} mediaType - The media type of tracks to be checked.
 * @returns {boolean} True if local track is muted or false if the track is
 * unmuted or if there are no local tracks of the given media type in the given
 * set of tracks.
 */
export function isLocalTrackMuted(tracks: Track[], mediaType: string): boolean {
    const track = getLocalTrack(tracks, mediaType);

    return !track || track.muted;
}

/**
* Returns the UTC timestamp when the first participant joined the conference.
*
* @param {Function | Object} state - Reference that can be resolved to Redux
* state with the {@code toState} function.
* @returns {number}
*/
export function getConferenceTimestamp(state: any): number {
    const { conferenceTimestamp } = getConferenceState(state);

    return conferenceTimestamp;
}

/**
 * Returns root conference state.
 *
 * @param {any} state - Global Redux state.
 * @returns {any} Conference state.
 */
export const getConferenceState = (state: any): any => state['conference'];

/**
 * Returns track of specified media type for specified participant id.
 *
 * @param {Track[]} tracks - List of all tracks.
 * @param {MEDIA_TYPE} mediaType - Media type.
 * @param {string} participantId - Participant ID.
 * @returns {(Track|undefined)}
 */
export function getTrackByMediaTypeAndParticipant(
    tracks: Track[],
    mediaType: MEDIA_TYPE,
    participantId: string): (Track | undefined) {
    return tracks.find(
        t => Boolean(t.jitsiTrack) && t.participantId === participantId && t.mediaType === mediaType
    );
}

/**
 * Generates the background color of an initials based avatar.
 *
 * @param {string?} initials - The initials of the avatar.
 * @param {Array<strig>} customAvatarBackgrounds - Custom avatar background values.
 * @returns {string}
 */
export function getAvatarColor(initials?: string, customAvatarBackgrounds?: string[]): string {
    const hasCustomAvatarBackgronds = customAvatarBackgrounds && customAvatarBackgrounds.length;
    const colorsBase = hasCustomAvatarBackgronds ? customAvatarBackgrounds : AVATAR_COLORS;

    let colorIndex = 0;
    if (initials) {
        let nameHash = 0;
        for (const s of initials) {
            nameHash += s.codePointAt(0);
        }
        colorIndex = nameHash % colorsBase.length;
    }
    return colorsBase[colorIndex];
}

/**
 * Returns true if the video of the participant should be rendered.
 * NOTE: This is currently only used on mobile.
 *
 * @param {any} state - the Redux state.
 * @param {string} id - The ID of the participant.
 * @returns {boolean}
 */
export function shouldRenderParticipantVideo(state: any, id: string): boolean {

    const participant = getParticipantById(state, id);

    if (!participant) {
        return false;
    }

    /* First check if we have an unmuted video track. */
    const videoTrack
        = getTrackByMediaTypeAndParticipant(state['tracks'], MEDIA_TYPE.VIDEO, id);

    if (!shouldRenderVideoTrack(videoTrack)) {
        return false;
    }

    /* Then check if the participant connection is active. */
    // const connectionStatus = participant.connectionStatus || JitsiParticipantConnectionStatus.ACTIVE;

    // if (connectionStatus !== JitsiParticipantConnectionStatus.ACTIVE) {
    //     return false;
    // }

    /* Then check if audio-only mode is not active. */
    const audioOnly = state['conference'].audioOnly;

    if (!audioOnly) {
        return true;
    }

    /* Last, check if the participant is sharing their screen and they are on stage. */
    // const remoteScreenShares = state['features/video-layout'].remoteScreenShares || [];
    // const largeVideoParticipantId = state['features/large-video'].participantId;
    // const participantIsInLargeVideoWithScreen
    //     = participant.id === largeVideoParticipantId && remoteScreenShares.includes(participant.id);

    // return participantIsInLargeVideoWithScreen;
    return true
}

/**
 * Returns participant by ID from Redux state.
 *
 * @param {(Function|Object)} state - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/participants.
 * @param {string} id - The ID of the participant to retrieve.
 * @private
 * @returns {(Participant|undefined)}
 */
export function getParticipantById(state: any, id: string): any {
    const { local, remote } = state['participants'];
    return remote[id] || (local?.id === id ? local : undefined);
}

/**
 * Determines whether a specific videoTrack should be rendered.
 *
 * @param {Track} videoTrack - The video track which is to be rendered.
 * @param {boolean} waitForVideoStarted - True if the specified videoTrack
 * should be rendered only after its associated video has started;
 * otherwise, false.
 * @returns {boolean} True if the specified videoTrack should be renderd;
 * otherwise, false.
 */
export function shouldRenderVideoTrack(
    videoTrack: { muted: boolean, videoStarted: boolean }): boolean {
    return (
        videoTrack
        && !videoTrack.muted);
}

/**
 * Returns a count of the known participants in the passed in redux state,
 * including fake participants.
 *
 * @param {(Function|Object)} state - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/participants.
 * @returns {number}
 */
export function getParticipantCount(state: any): number {
    const { local, sortedRemoteParticipants } = state['participants'];
    return sortedRemoteParticipants.length + (local ? 1 : 0);
}

/**
 * Selector for determining if the UI layout should be in tile view. Tile view
 * is determined by more than just having the tile view setting enabled, as
 * one-on-one calls should not be in tile view, as well as etherpad editing.
 *
 * @param {Object} state - The redux state.
 * @returns {boolean} True if tile view should be displayed.
 */
export function shouldDisplayTileView(state: any): boolean {
    const participantCount = getParticipantCount(state);

    const { iAmRecorder } = state['meetConfig'];

    const { tileViewEnabled } = state['conference'];

    if (tileViewEnabled !== undefined) {
        // If the user explicitly requested a view mode, we
        // do that.
        return tileViewEnabled;
    }

    // None tile view mode is easier to calculate (no need for many negations), so we do
    // that and negate it only once.
    const shouldDisplayNormalMode = Boolean(

        // Reasons for normal mode:

        // We pinned a participant
        getPinnedParticipant(state)

        // It's a 1-on-1 meeting
        || participantCount < 3

        // There is a shared YouTube video in the meeting
        // || isVideoPlaying(state)

        // We want jibri to use stage view by default
        || iAmRecorder
    );

    return !shouldDisplayNormalMode;
}

/**
 * Returns the participant which has its pinned state set to truthy.
 *
 * @param {any} state - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * participants.
 * @returns {(Participant|undefined)}
 */
export function getPinnedParticipant(state: any): (Participant | undefined) {
    const { pinnedParticipant } = state['participants'];

    if (!pinnedParticipant) {
        return undefined;
    }

    return getParticipantById(state, pinnedParticipant);
}

/**
 * Returns the stored room name.
 *
 * @param {Object} state - The current state of the app.
 * @returns {string}
 */
export function getRoomName(state: any): string {
    return getConferenceState(state).room;
}

export function isLonelyMeeting(state: any): boolean {
    return Boolean(getCurrentConference(state) && getParticipantCount(state) === 1)
}

/**
 * Returns true if the current local participant is a moderator in the
 * conference.
 *
 * @param {any} state - the Redux state.
 * @returns {boolean}
 */
export function isLocalParticipantModerator(state: any): boolean {
    const { local } = state['participants'];
    if (!local) {
        return false;
    }
    return isParticipantModerator(state, local);
}

/**
 * Returns true if the participant is a moderator.
 *
 * @param {any} state - the Redux state.
 * @param {any} participant - Participant object.
 * @returns {boolean}
 */
export function isParticipantModerator(state: any, participant: any): boolean {
    const { confData } = state['conference'];
    const { created_by_email = '', additional_moderators = [] } = confData || {}
    const { role, email, id } = participant || {}
    return role === PARTICIPANT_ROLE.MODERATOR && ((created_by_email === email) || additional_moderators.includes(id));
}

/**
 * Returns whether the given participant has his hand raised or not.
 *
 * @param {any} participant - The participant.
 * @returns {boolean} - Whether participant has raise hand or not.
 */
export function hasRaisedHand(participant: any): boolean {
    return Boolean(participant && participant.raisedHandTimestamp);
}

/**
 * 
 * @param {Object} conference The meeting that user has joined
 * @param {string} tag 
 * @param {string} value 
**/
export function sendCommandOnce(conference: { sendCommandOnce: (arg0: string, arg1: { value?: string; }) => void; }, tag: string, value?: string) {
    console.log('---sendCommandOnce---', tag, value)
    conference?.sendCommandOnce?.(tag, { value })
}

/**
 * Selectors for getting all remote participants.
 *
 * @param {any} state - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * participants.
 * @returns {Object<string, Object>}
 */
export function getRemoteParticipants(state: any): { [s: string]: Object; } {
    return state['participants'].remote;
}

/**
 * Searches in the passed in redux state for an active recording session of the
 * passed in mode.
 *
 * @param {any} state - The redux state to search in.
 * @param {string} mode - Find an active recording session of the given mode.
 * @returns {any|undefined}
 */
export function getActiveSession(state: any, mode: string): any | undefined {
    const { sessionDatas } = state['recording'];
    const { status: statusConstants } = JitsiRecordingConstants;
    return sessionDatas.find(sessionData => sessionData.mode === mode
        && (sessionData.status === statusConstants.ON
            || sessionData.status === statusConstants.PENDING));
}