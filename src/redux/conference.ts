import { createSlice } from "@reduxjs/toolkit";
import { connectConf, disconnectConf } from "../lib-jitsi-meet/actions";

const initialState = {
    room: '',
    conference: undefined,
    joining: undefined,
    leaving: undefined,
    audioOnly: false,
    conferenceTimestamp: 0
};

export const conference = createSlice({
    name: 'conference',
    initialState,
    reducers: {
        setRoom(state, action) {
            state.room = action.payload || ''
        },
        conferenceJoined(state, action) {
            setConference(state, action.payload, 'conference')
        },
        willjoinConference(state, action) {
            setConference(state, action.payload, 'joining')
        },
        willLeaveConference(state, action) {
            if (conference === state.joining || conference === state.conference)
                setConference(state, action.payload, 'leaving')
        },
        conferenceLeft(state, action: { type: string, payload: undefined }) {
            setConference(state, undefined, 'leaving')
        },
        setAudioOnly(state, action) {
            state.audioOnly = action.payload
        },
        conferenceTimestampChanged(state, action: { type: string, payload: number }) {
            state.conferenceTimestamp = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(disconnectConf.rejected, (state, action) => {
            console.log('---rejected-disconnectConf---', action)
        })
        builder.addCase(connectConf.rejected, (state, action) => {
            console.log('---rejected-connectConf---', action)
        })
    }
});

export const { setRoom, conferenceJoined, willjoinConference, willLeaveConference, conferenceLeft, conferenceTimestampChanged } = conference.actions;

export default conference.reducer;

function setConference(state: typeof initialState, conference: any, key: keyof Omit<typeof initialState, 'room'>) {
    for (const k in state) {
        if (k === key) {
            state[k] = conference
        }
        else if (k !== 'room') {
            state[k] = undefined
        }
    }
}