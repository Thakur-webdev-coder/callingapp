import {
  DOMAIN,
  FOCUS,
  MUC,
  SERVICEURL,
  WEBSOCKETKEEPALIVEURL,
} from "../lib-jitsi-meet/constants";
export const config = {
  hosts: {
    domain: DOMAIN,
    muc: MUC, // FIXME: use XEP-0030
    focus: FOCUS,
  },
  disableSimulcast: false,
  constraints: {
    video: {
      height: {
        ideal: 720,
        max: 720,
        min: 320,
      },
      width: {
        ideal: 1280,
        max: 1280,
        min: 720,
      },
    },
  },
  enableP2P: false, // flag to control P2P connections
  p2p: {
    enabled: false,
    enableUnifiedOnChrome: true,
    disableH264: true,
    useStunTurn: true, // use XEP-0215 to fetch STUN and TURN servers for the P2P connection
  },
  useStunTurn: true, // use XEP-0215 to fetch TURN servers for the JVB connection
  useTurnUdp: false,
  bosh: "https://" + DOMAIN + "/http-bind", // FIXME: use xep-0156 for that
  websocket: SERVICEURL, // FIXME: use xep-0156 for that
  websocketKeepAliveUrl: WEBSOCKETKEEPALIVEURL,
  clientNode: WEBSOCKETKEEPALIVEURL, // The name of client node advertised in XEP-0115 'c' stanza
  desktopSharingSources: ["screen", "window"],
  desktopSharingChromeSources: ["screen", "window", "tab"],
  enableLipSync: false,
  enableSaveLogs: false,
  disableRtx: false, // Enables RTX everywhere
  enableScreenshotCapture: false,
  channelLastN: 25, // The default value of the channel attribute last-n.
  videoQuality: {
    maxBitratesVideo: {
      low: 200000,
      standard: 500000,
      high: 1500000,
    },
  },
  useNewBandwidthAllocationStrategy: true,
  startBitrate: "800",
  disableAudioLevels: false,
  stereo: false,
  forceJVB121Ratio: -1,
  enableTalkWhileMuted: true,
  mouseMoveCallbackInterval: 1000,
  enableNoAudioDetection: true,
  enableNoisyMicDetection: true,
  disableLocalVideoFlip: false,
  hiddenDomain: "recorder." + DOMAIN,
  enableUserRolesBasedOnToken: false,
  enableLayerSuspension: true,
  enableUnifiedOnChrome: true,
  enableWelcomePage: true,
  enableInsecureRoomNameWarning: false,
  e2eping: {
    pingInterval: -1,
  },
  abTesting: {},
  // flags: {
  //   sourceNameSignaling: true,
  //   sendMultipleVideoStreams: true,
  //   receiveMultipleVideoStreams: true,
  //   ssrcRewritingEnabled: false,
  // },
  resolution: 720,
  maxFullResolutionParticipants: 50,
  desktopSharingFrameRate: {
    min: 30,
    max: 30,
  },
  hideDominantSpeakerBadge: true,
  firefox_fake_device: true,
  makeJsonParserHappy: "even if last key had a trailing comma",
};
