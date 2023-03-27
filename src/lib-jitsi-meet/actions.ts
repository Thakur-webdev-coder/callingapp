import { createAsyncThunk } from "@reduxjs/toolkit"
import { conferenceLeft, setRoom, willjoinConference, willLeaveConference } from "../redux/conference"
import { setConfig } from "../redux/meetConfig"
import {
    addConferenceFeatureEvents,
    addConferenceListeners, addLocalTracksToConference, constructConfig, createLocalTracksF, disposeTracks, getBackendSafeRoomName, getConferenceOptions,
    getCurrentConference, getLocalParticipant, getLocalTrack, getLocalTracks, getRemoteParticipants, loadConfig, sendCommandOnce, sendLocalParticipant, setMuted, shouldMirror
} from "./functions"
import JitsiMeetJS from "lib-jitsi-meet"
import { CAMERA_FACING_MODE, CustomConferenceEvents, JitsiConnectionEvents, JitsiTrackEvents, JITSI_CONNECTION_CONFERENCE_KEY, JITSI_URL_KEY, MEDIA_TYPE } from "./constants"
import { connectionEstablished, connectionWillConnect, destroyConnection } from "../redux/connection"
import { trackRemoved, trackUpdated, TRACK_ADDED } from "../redux/tracks"
import { PARTICIPANT_JOINED } from "../redux/participants"
import { useSelector } from "react-redux"

export const initConfig = createAsyncThunk(
    'config/init',
    async (url: string, { dispatch }) => {
        try {
            var config = await loadConfig(`${url}config.js`)
            dispatch(setConfig(config))
            JitsiMeetJS.init(config);
            JitsiMeetJS.setNetworkInfo({
                isOnline: true
            });
        }
        catch (error) {
            console.log('---config-init-error---', error)
            dispatch(setConfig(undefined))
        }
    }
)

export const startMeeting = createAsyncThunk(
    'start/meeting',
    async (room: string, { dispatch, getState }) => {
        if (room) {
            dispatch(initJitsi(room))
        }
        else {
            console.error('Cannot initiate conference without a room name!');
        }
    }
)

export const initJitsi = createAsyncThunk(
    'jitsi/init',
    async (room: string | undefined, { dispatch, getState }) => {
        console.log("hererere" , room);
        
        const  state = getState()
        // const str = useSelector(
        //     (store) => store
        //   );
        console.log("hererere22" , state);

        var { config, locationURL, settings: { startAudioOnly, startWithAudioMuted, startWithVideoMuted } } = state['meetConfig']
        if (!config) {
            console.log("hererere1" , room);

            config = await loadConfig(`${locationURL}config.js`)
        }
        console.log("hererere2" , config);

        dispatch(setConfig(config))
        console.log("isromm-->3" , room);

        try {
            JitsiMeetJS.init(config);
        JitsiMeetJS.setNetworkInfo({
            isOnline: true
        });
            } catch (e) {
            console.log('Errorrrr' , e)
            }
       
        console.log("isromm-->" , room);
        
        if (room) {
            console.log("hererere3" , room);

            dispatch(setRoom(getBackendSafeRoomName(room)))
            if (startAudioOnly) {
                dispatch(setAudioMuted(false))
            }
            else {
                if (!startWithVideoMuted) {
                    dispatch(setVideoMuted(false))
                }
                if (!startWithAudioMuted) {
                    dispatch(setAudioMuted(false))
                }
            }

            console.log(" jitsi initlized");
            
            dispatch(createConnection())
        }
    }
)

export const createConnection = createAsyncThunk(
    'jitsi/create_connection',
    async function (args, { dispatch, getState }) {
        const state = getState();
        const options = constructConfig(state);
        const { locationURL } = state['meetConfig'];
        const connection = new JitsiMeetJS.JitsiConnection(options.appId, null, options);
        connection[JITSI_URL_KEY] = new URL(locationURL);
        connection.addEventListener(
            JitsiConnectionEvents.CONNECTION_DISCONNECTED,
            _onConnectionDisconnected);
        connection.addEventListener(
            JitsiConnectionEvents.CONNECTION_ESTABLISHED,
            _onConnectionEstablished);
        connection.addEventListener(
            JitsiConnectionEvents.CONNECTION_FAILED,
            _onConnectionFailed);
        dispatch(connectionWillConnect(connection));
        connection.connect();

        /**
         * Dispatches {@code CONNECTION_DISCONNECTED} action when connection is
         * disconnected.
         *
         * @private
         * @returns {void}
         */
        function _onConnectionDisconnected(): void {
            unsubscribe();
            dispatch(setRoom(undefined))
            dispatch(destroyConnection());
        }

        /**
         * Resolves external promise when connection is established.
         *
         * @private
         * @returns {void}
         */
        function _onConnectionEstablished(): void {
            connection.removeEventListener(
                JitsiConnectionEvents.CONNECTION_ESTABLISHED,
                _onConnectionEstablished);
            dispatch(connectionEstablished({ connection, time: Date.now() }));
        }

        /**
         * Rejects external promise when connection fails.
         *
         * @param {JitsiConnectionErrors} err - Connection error.
         * @param {string} [msg] - Error message supplied by lib-jitsi-meet.
         * @param {Object} [credentials] - The invalid credentials that were
         * used to authenticate and the authentication failed.
         * @param {string} [credentials.jid] - The XMPP user's ID.
         * @param {string} [credentials.password] - The XMPP user's password.
         * @param {Object} details - Additional information about the error.
         * @private
         * @returns {void}
         */
        function _onConnectionFailed( // eslint-disable-line max-params
            err: string,
            msg: string,
            credentials: Object,
            details: Object): void {
            unsubscribe();
            dispatch(setRoom(undefined))
            dispatch(destroyConnection());
            // dispatch(
            //     connectionFailed(
            //         connection, {
            //         credentials,
            //         details,
            //         name: err,
            //         message: msg
            //     }
            //     ));
        }

        /**
         * Unsubscribe the connection instance from
         * {@code CONNECTION_DISCONNECTED} and {@code CONNECTION_FAILED} events.
         *
         * @returns {void}
         */
        function unsubscribe(): void {
            connection.removeEventListener(
                JitsiConnectionEvents.CONNECTION_DISCONNECTED,
                _onConnectionDisconnected);
            connection.removeEventListener(
                JitsiConnectionEvents.CONNECTION_FAILED,
                _onConnectionFailed);
        }
    }
)

/**
 * Initializes a new conference.
 *
 * @param {string} overrideRoom - Override the room to join, instead of taking it
 * from Redux.
 * @returns {Function}
 */
export const connectConf = createAsyncThunk(
    'jitsi/connect_conference',
    async function (overrideRoom: string, { dispatch, getState }) {
        
        const state: any = getState();
        console.log("connectConference" , state);

        const { locationURL } = state['meetConfig']
        const { connection: connection_, connecting } = state['connection'];
        const { tracks } = state
        const connection = connecting || connection_
        if (!connection) {
            console.error('Cannot create a conference without a connection!');
            return
        }
        const { password, room } = state['conference'];
        if (!room) {
            console.error('Cannot join a conference without a room name!');
            return
        }
        // XXX: revisit this.
        // Hide the custom domain in the room name.
        const tmp = overrideRoom || room;
        let _room = getBackendSafeRoomName(tmp);
        const conference = connection.initJitsiConference(_room, getConferenceOptions(state));
        connection[JITSI_CONNECTION_CONFERENCE_KEY] = conference;
        conference[JITSI_URL_KEY] = new URL(locationURL);
        const localTracks = getLocalTracks(tracks)
        if (localTracks.length) {
            addLocalTracksToConference(conference, localTracks.map(t => t.jitsiTrack));
        }
        dispatch(willjoinConference(conference));
        sendLocalParticipant(state, conference);
        addConferenceListeners(conference, dispatch, state);
        addConferenceFeatureEvents(conference, { dispatch, getState })
        conference.join(password);
    }
)

export const hangupMeeting = createAsyncThunk(
    'meeting/hangup',
    (args, { getState, dispatch }) => {
        console.log("hangup Meeting" , "hangup Meeting");
        
        dispatch(disconnectConf())
    }
)

export const disconnectConf = createAsyncThunk(
    'jitsi/disconnect_conference',
    (args, { getState, dispatch }) => {
        const state = getState();
        // The conference we have already joined or are joining.
        const conference = getCurrentConference(state)
        // Promise which completes when the conference has been left and the
        // connection has been disconnected.
        let promise: Promise<any>;

        // Leave the conference.
        if (conference) {
            // In a fashion similar to JitsiConference's CONFERENCE_LEFT event
            // (and the respective Redux action) which is fired after the
            // conference has been left, notify the application about the
            // intention to leave the conference.
            dispatch(willLeaveConference(conference));
            promise
                = conference.leave()
                    .catch((error: any) => {
                        console.warn(
                            'JitsiConference.leave() rejected with:',
                            error);

                        // The library lib-jitsi-meet failed to make the
                        // JitsiConference leave. Which may be because
                        // JitsiConference thinks it has already left.
                        // Regardless of the failure reason, continue in
                        // jitsi-meet as if the leave has succeeded.
                        dispatch(conferenceLeft());
                    });
        } else {
            promise = Promise.resolve();
        }
        // Disconnect the connection.
        const { connection } = state['connection'];
        if (connection) {
            promise = promise.then(() => connection.disconnect());
        } else {
            console.info('No connection found while disconnecting.');
        }
        dispatch(setRoom(undefined))
        return promise;
    }
)

/**
 * Create an action for when a new track has been signaled to be added to the
 * conference.
 *
 * @param {(JitsiLocalTrack|JitsiRemoteTrack)} track - JitsiTrack instance.
 * @returns {{ type: TRACK_ADDED, track: Track }}
 */
export const trackAdded = createAsyncThunk(
    'track/added',
    (track: any, { getState, dispatch }) => {
        track.on(
            JitsiTrackEvents.TRACK_MUTE_CHANGED,
            () => {
                console.log('---mute-track---', track.isMuted())
                dispatch(trackUpdated({ jitsiTrack: track, muted: track.isMuted() }))
            });
        track.on(
            JitsiTrackEvents.TRACK_VIDEOTYPE_CHANGED,
            () => {
                // dispatch(trackVideoTypeChanged(track, type))
            });
        // participantId
        const local = track.isLocal();
        const mediaType = track.getType();
        let participantId: string = '';

        if (local) {
            // const participant = getLocalParticipant(getState);
            const participant = { id: 'local' };

            if (participant) {
                participantId = participant.id;
            }

            track.on(JitsiTrackEvents.LOCAL_TRACK_STOPPED,
                () => {
                    // dispatch({
                    //     type: TRACK_STOPPED,
                    //     track: {
                    //         jitsiTrack: track
                    //     }
                    // })
                });
            const conference = getCurrentConference(getState())
            conference && addLocalTracksToConference(conference, [track]);
        } else {
            participantId = track.getParticipantId();
        }

        return dispatch(
            TRACK_ADDED({
                jitsiTrack: track,
                local,
                mediaType,
                mirror: shouldMirror(track),
                muted: track.isMuted(),
                participantId,
                videoStarted: false,
                videoType: track.videoType
            })
        );
    }
)

/**
 * Action to signal that a participant has joined.
 *
 * @param {Participant} participant - Information about participant.
 * @returns {{
*     type: PARTICIPANT_JOINED,
*     payload: Participant
* }}
*/
export const participantJoined = createAsyncThunk(
    'participant/joined_async',
    (participant: any, { getState, dispatch }) => {
        // Only the local participant is not identified with an id-conference pair.
        if (participant.local) {
            dispatch(PARTICIPANT_JOINED(participant))
            return
        }

        // In other words, a remote participant is identified with an id-conference
        // pair.
        const { conference } = participant;

        if (!conference) {
            console.error('A remote participant must be associated with a JitsiConference!');
            return
        }

        // A remote participant is only expected to join in a joined or joining
        // conference. The following check is really necessary because a
        // JitsiConference may have moved into leaving but may still manage to
        // sneak a PARTICIPANT_JOINED in if its leave is delayed for any purpose
        // (which is not outragous given that leaving involves network
        // requests.)
        const stateFeaturesBaseConference
            = getState()['conference'];

        if (conference === stateFeaturesBaseConference.conference
            || conference === stateFeaturesBaseConference.joining) {
            dispatch(PARTICIPANT_JOINED(participant));
        }
    }
)

/**
 * Disposes passed tracks and signals them to be removed.
 *
 * @param {(JitsiLocalTrack|JitsiRemoteTrack)[]} tracks - List of tracks.
 * @protected
 * @returns {Function}
 */
export function disposeAndRemoveTracks(tracks: any[]): Function {
    return (dispatch) =>
        disposeTracks(tracks)
            .then(() =>
                Promise.all(tracks.map((t: any) => dispatch(trackRemoved(t)))));
}

/**
 * Request to start capturing local audio and/or video. By default, the user
 * facing camera will be selected.
 *
 * @param {Object} [options] - For info @see JitsiMeetJS.createLocalTracks.
 * @returns {Function}
 */
export function createLocalTracksA(options: any = {}): Function {
    return (dispatch, getState) => {
        const devices
            = options.devices || [MEDIA_TYPE.AUDIO, MEDIA_TYPE.VIDEO];
        const store = {
            dispatch,
            getState
        };

        // The following executes on React Native only at the time of this
        // writing. The effort to port Web's createInitialLocalTracksAndConnect
        // is significant and that's where the function createLocalTracksF got
        // born. I started with the idea a porting so that we could inherit the
        // ability to getUserMedia for audio only or video only if getUserMedia
        // for audio and video fails. Eventually though, I realized that on
        // mobile we do not have combined permission prompts implemented anyway
        // (either because there are no such prompts or it does not make sense
        // to implement them) and the right thing to do is to ask for each
        // device separately.
        for (const device of devices) {
            if (getLocalTrack(getState()['tracks'], device)) {
                console.error(`Local track for ${device} already exists`);
                return
            }
            const gumProcess: any
                = createLocalTracksF(
                    {
                        cameraDeviceId: options.cameraDeviceId,
                        devices: [device],
                        facingMode:
                            options.facingMode || CAMERA_FACING_MODE.USER,
                        micDeviceId: options.micDeviceId
                    },
                    store)
                    .then(
                        localTracks => {
                            // Because GUM is called for 1 device (which is actually
                            // a media type 'audio', 'video', 'screen', etc.) we
                            // should not get more than one JitsiTrack.
                            if (localTracks.length !== 1) {
                                console.error(
                                    `Expected exactly 1 track, but was given ${localTracks.length} tracks for device: ${device}.`);
                                return
                            }

                            if (gumProcess.canceled) {
                                return disposeTracks(localTracks)
                                // .then(() =>
                                //     dispatch(_trackCreateCanceled(device)));
                            }

                            return dispatch(trackAdded(localTracks[0]));
                        },
                        // reason =>
                        //     dispatch(
                        //         gumProcess.canceled
                        //             ? _trackCreateCanceled(device)
                        //             : _onCreateLocalTracksRejected(
                        //                 reason,
                        //                 device))
                    );

            /**
             * Cancels the {@code getUserMedia} process represented by this
             * {@code Promise}.
             *
             * @returns {Promise} This {@code Promise} i.e. {@code gumProcess}.
             */
            gumProcess.cancel = (): Promise<any> => {
                gumProcess.canceled = true;
                return gumProcess;
            };

            // dispatch({
            //     type: TRACK_WILL_CREATE,
            //     track: {
            //         gumProcess,
            //         local: true,
            //         mediaType: device
            //     }
            // });
        }
    };
}

/**
 * Action to set the muted state of the local video.
 *
 * @param {boolean} muted - True if the local video is to be muted or false if
 * the local video is to be unmuted.
 * @param {MEDIA_TYPE} mediaType - The type of media.
 * @param {boolean} ensureTrack - True if we want to ensure that a new track is
 * created if missing.
 * @returns {Function}
 */
export const setVideoMuted = createAsyncThunk(
    'video/mute_unmute',
    async (muted: boolean, store) => {
        setMuted(store, muted, MEDIA_TYPE.VIDEO)
        // const oldValue = state['features/base/media'].video.muted;

        // eslint-disable-next-line no-bitwise
        // const newValue = muted ? oldValue | authority : oldValue & ~authority;

        // return dispatch({
        //     type: SET_VIDEO_MUTED,
        //     authority,
        //     mediaType,
        //     ensureTrack,
        //     muted: newValue
        // });
    }
)

/**
 * Action to set the muted state of the local video.
 *
 * @param {boolean} muted - True if the local video is to be muted or false if
 * the local video is to be unmuted.
 * @param {MEDIA_TYPE} mediaType - The type of media.
 * @param {boolean} ensureTrack - True if we want to ensure that a new track is
 * created if missing.
 * @returns {Function}
 */
export const setAudioMuted = createAsyncThunk(
    'audio/mute_unmute',
    async (muted: boolean, store) => {
        setMuted(store, muted, MEDIA_TYPE.AUDIO)
        // const oldValue = state['features/base/media'].video.muted;

        // eslint-disable-next-line no-bitwise
        // const newValue = muted ? oldValue | authority : oldValue & ~authority;

        // return dispatch({
        //     type: SET_AUDIO_MUTED,
        //     authority,
        //     mediaType,
        //     ensureTrack,
        //     muted: newValue
        // });
    }
)

/**
 * Mutes the local participant.
 *
 * @param {boolean} enable - Whether to mute or unmute.
 * @param {MEDIA_TYPE} mediaType - The type of the media channel to mute.
 * @param {boolean} stopScreenSharing - Whether or not to stop the screensharing.
 * @returns {Function}
 */
export function muteLocal(enable: boolean, mediaType: MEDIA_TYPE, stopScreenSharing: boolean = false) {
    return (dispatch: Dispatch<any>) => {
        const isAudio = mediaType === MEDIA_TYPE.AUDIO;
        if (enable && stopScreenSharing) {
            // dispatch(toggleScreensharing(false, false, true));
        }
        dispatch(isAudio ? setAudioMuted(enable) : setVideoMuted(enable));
    };
}

export const toggleCamera = createAsyncThunk(
    'camera/toggle',
    (args: any, { dispatch, getState }) => {
        
        const state = getState()
        const localTrack = getLocalTrack(state['tracks'], MEDIA_TYPE.VIDEO);
        let jitsiTrack;

        if (localTrack && (jitsiTrack = localTrack.jitsiTrack)) {
            // XXX MediaStreamTrack._switchCamera is a custom function
            // implemented in react-native-webrtc for video which switches
            // between the cameras via a native WebRTC library implementation
            // without making any changes to the track.
            jitsiTrack._switchCamera();

            // Don't mirror the video of the back/environment-facing camera.
            const mirror
                = jitsiTrack.getCameraFacingMode() === CAMERA_FACING_MODE.USER;

            dispatch(trackUpdated({
                jitsiTrack,
                mirror
            }))
        }
    }
)

// export const localParticipantRaiseHand = createAsyncThunk(
//     'local/raise_lower/hand',
//     async (enabled: boolean, { getState, dispatch }) => {
//         const localId = getLocalParticipant(getState())?.id;
//         const raisedHandTimestamp = enabled ? Date.now() : 0
//         getCurrentConference(getState())?.setLocalParticipantProperty('raisedHand', raisedHandTimestamp)
//         dispatch(participantUpdated({
//             // XXX Only the local participant is allowed to update without
//             // stating the JitsiConference instance (i.e. participant property
//             // `conference` for a remote participant) because the local
//             // participant is uniquely identified by the very fact that there is
//             // only one local participant.

//             id: localId,
//             local: true,
//             raisedHandTimestamp
//         }));
//         dispatch(raiseHandUpdated({
//             id: localId,
//             raisedHandTimestamp
//         }));
//     }
// )

export const grantModerator = createAsyncThunk(
    'grant_moderator',
    (id: string, { getState }) => {
        const conference = getCurrentConference(getState())
        conference.grantOwner(id);
        sendCommandOnce(conference, CustomConferenceEvents.ROLE_CHANGED, id)
    }
)

export const muteRemoteParticipant = createAsyncThunk(
    'remote_participants/mute',
    ({ id, mediaType }: { id: string, mediaType: MEDIA_TYPE }, { getState }) => {
        const conference = getCurrentConference(getState())
        conference.muteParticipant(id, mediaType)
    }
)

/**
 * Mutes all participants.
 *
 * @param {{exclude:Array<string>; mediaType:MEDIA_TYPE}} args - Array of participant IDs to not mute and the media type to mute.
 * @returns {Function}
 */
export const muteAllParticipants = createAsyncThunk(
    'all_participants/mute',
    ({ exclude, mediaType }: { exclude: string[], mediaType: MEDIA_TYPE }, { dispatch, getState }) => {
        const state = getState();
        const localId = getLocalParticipant(state).id;
        if (!exclude.includes(localId)) {
            dispatch(muteLocal(true, mediaType, mediaType !== MEDIA_TYPE.AUDIO));
        }
        const remote_participants = getRemoteParticipants(state)
        for (const id in remote_participants) {
            if (exclude.includes(id)) {
                return;
            }
            dispatch(muteRemoteParticipant({ id, mediaType }));
        }
    }
)