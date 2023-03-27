import JitsiMeetJS from 'lib-jitsi-meet'

// export const DEFAULT_MEETING_URL = `https://${process.env.REACT_APP_MEET_DOMAIN}/`
export const DEFAULT_MEETING_URL = `https://meet.jit.si/`
// export const DEFAULT_MEETING_URL = `https://meet.jit.si/919588`


/**
 * The name of the {@code JitsiConnection} property which identifies the location URL where the connection will be made.
 */
export const JITSI_URL_KEY = Symbol('url');
/**
 * The name of the {@code JitsiConnection} property which identifies the {@code JitsiConference} currently associated
 * with it.
 *
 * FIXME: This is a hack. It was introduced to solve the following case: if a user presses hangup quickly, they may
 * "leave the conference" before the actual conference was ever created. While we might have a connection in place,
 * there is no conference which can be left, thus no CONFERENCE_LEFT action will ever be fired.
 *
 * This is problematic because the external API module used to send events to the native SDK won't know what to send.
 * So, in order to detect this situation we are attaching the conference object to the connection which runs it.
 */
export const JITSI_CONNECTION_CONFERENCE_KEY = Symbol('conference');

/**
 * The command type for updating a participant's avatar URL.
 *
 * @type {string}
 */
export const AVATAR_URL_COMMAND: string = 'avatar-url';

/**
 * The command type for updating a participant's email address.
 *
 * @type {string}
 */
export const EMAIL_COMMAND: string = 'email';

/**
 * The set of media types.
 *
 * @enum {string}
 */
export const MEDIA_TYPE = {
    AUDIO: 'audio',
    PRESENTER: 'presenter',
    VIDEO: 'video'
};
type m_t = typeof MEDIA_TYPE
export type MEDIA_TYPE = m_t['AUDIO'] | m_t['VIDEO'] | m_t['PRESENTER'];

/**
 * The set of facing modes for camera.
 *
 * @enum {string}
 */
export const CAMERA_FACING_MODE = {
    ENVIRONMENT: 'environment',
    USER: 'user'
};

/**
 * The set of possible XMPP MUC roles for conference participants.
 *
 * @enum {string}
 */
export const PARTICIPANT_ROLE = {
    MODERATOR: 'moderator',
    NONE: 'none',
    PARTICIPANT: 'participant'
};

/**
 * The local participant might not have real ID until she joins a conference,
 * so use 'local' as her default ID.
 *
 * @type {string}
 */
export const LOCAL_PARTICIPANT_DEFAULT_ID: string = 'local';

/**
 * The list of supported meeting features to enable/disable through jwt.
 */
export const MEET_FEATURES = [
    'branding',
    'calendar',
    'callstats',
    'livestreaming',
    'lobby',
    'moderation',
    'outbound-call',
    'recording',
    'room',
    'screen-sharing',
    'sip-outbound-call',
    'transcription'
];

export const AVATAR_COLORS = [
    '#6A50D3',
    '#FF9B42',
    '#DF486F',
    '#73348C',
    '#B23683',
    '#F96E57',
    '#4380E2',
    '#2AA076',
    '#00A8B3'
];

export const JitsiConferenceErrors = JitsiMeetJS.errors.conference;
export const JitsiConferenceEvents = JitsiMeetJS.events.conference;
export const JitsiConnectionErrors = JitsiMeetJS.errors.connection;
export const JitsiConnectionEvents = JitsiMeetJS.events.connection;
export const JitsiConnectionQualityEvents
    = JitsiMeetJS.events.connectionQuality;
export const JitsiDetectionEvents = JitsiMeetJS.events.detection;
export const JitsiE2ePingEvents = JitsiMeetJS.events.e2eping;
export const JitsiMediaDevicesEvents = JitsiMeetJS.events.mediaDevices;
export const JitsiParticipantConnectionStatus
    = JitsiMeetJS.constants.participantConnectionStatus;
export const JitsiRecordingConstants = JitsiMeetJS.constants.recording;
export const JitsiSIPVideoGWStatus = JitsiMeetJS.constants.sipVideoGW;
export const JitsiTrackErrors = JitsiMeetJS.errors.track;
export const JitsiTrackEvents = JitsiMeetJS.events.track;
export const CustomConferenceEvents = {
    END_FOR_ALL: 'end-for-all',
    SYNC_CONF_DATA: 'sync-conf-data',
    REFRESH_ALL: 'refresh-to-all',
    ROLE_CHANGED: 'role-changed',
    SCREEN_SHARE: 'screen-share'
}