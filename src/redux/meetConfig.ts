import { createSlice } from "@reduxjs/toolkit";
import { DEFAULT_MEETING_URL } from "../lib-jitsi-meet/constants";

type Settings = {
    startAudioOnly: boolean,
    startWithAudioMuted: boolean,
    startWithVideoMuted: boolean,
    startWithReactionsMuted: boolean
}
type StateType = { locationURL: string, config: any, settings: Partial<Settings> }

const initialState: StateType = {
    locationURL: DEFAULT_MEETING_URL,
    config: undefined,
    settings: {
        startAudioOnly: false,
        startWithAudioMuted: false,
        startWithVideoMuted: false,
    }
};

export const meetConfig = createSlice({
    name: 'meetConfig',
    initialState,
    reducers: {
        setConfig(state, action) {
            state.config = action.payload
        },
        setMeetingDomain(state, action) {
            state.locationURL = action.payload || DEFAULT_MEETING_URL
        },
        updateSettings(state, action: { type: string, payload: Partial<Settings> }) {
            const settings = action.payload
            for (const key in settings) {
                if (key in state.settings) {
                    state.settings[key] = settings[key]
                }
            }
        },
        resetSettings(state, action: { type: string, payload: undefined }) {
            state.settings = initialState.settings
        }
    }
});

export const { setConfig, setMeetingDomain, updateSettings, resetSettings } = meetConfig.actions;

export default meetConfig.reducer;