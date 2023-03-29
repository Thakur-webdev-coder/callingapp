import { createAction, createSlice } from "@reduxjs/toolkit";
import { JitsiTrackEvents } from "../lib-jitsi-meet/constants";
import { localParticipantIdChanged } from "./participants";

const initialState: any[] = [];

export const tracks = createSlice({
    name: "tracks",
    initialState,
    reducers: {
        trackRemoved: (state, action) => {
            const track = action.payload
            track.removeAllListeners(JitsiTrackEvents.TRACK_MUTE_CHANGED);
            track.removeAllListeners(JitsiTrackEvents.TRACK_VIDEOTYPE_CHANGED);
            track.removeAllListeners(JitsiTrackEvents.NO_DATA_FROM_SOURCE);
            return state.filter(t => t.jitsiTrack !== track)
        },
        trackUpdated: (state, action) => {
            const t = action.payload;
            return state.map((track) => {
                if (track.jitsiTrack === t.jitsiTrack) {
                    // Make sure that there's an actual update in order to reduce the
                    // risk of unnecessary React Component renders.
                    for (const p in t) {
                        if (track[p] !== t[p]) {
                            // There's an actual update.
                            return {
                                ...track,
                                ...t
                            };
                        }
                    }
                }
                return track
            })
        }
    },
    extraReducers(builder) {
        builder.addCase(TRACK_ADDED, (state, action) => {
            return [...state, action.payload]
        })
        builder.addCase(localParticipantIdChanged, (state, action) => {
            state.map(track => {
                if (track.local) {
                    track.participantId = action.payload
                }
                return track
            })
        })
    }
});

export const TRACK_ADDED = createAction<any>('tracks/trackAdded')

export const { trackRemoved, trackUpdated } = tracks.actions;

export default tracks.reducer;
