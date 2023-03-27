import { createAction, createSlice } from "@reduxjs/toolkit";
import { LOCAL_PARTICIPANT_DEFAULT_ID, PARTICIPANT_ROLE } from "../lib-jitsi-meet/constants";

interface StateType {
    local: any
    remote: { [id: string]: any }
    pinnedParticipant: string
    dominantSpeaker: string,
    sortedRemoteParticipants: { [id: string]: string }
}

const initialState: StateType = {
    local: undefined,
    remote: {},
    pinnedParticipant: '',
    dominantSpeaker: '',
    sortedRemoteParticipants: {}
};

export const PARTICIPANT_JOINED = createAction<any>('participant_joined')

export const participants = createSlice({
    name: "participants",
    initialState,
    reducers: {

    },
    extraReducers(builder) {
        builder.addCase(PARTICIPANT_JOINED, (state, action) => {
            const participant = _participantJoined({ participant: action.payload });
            const { id, isFakeParticipant, name, pinned } = participant;
            const { pinnedParticipant, dominantSpeaker } = state;
            if (pinned) {
                if (pinnedParticipant) {
                    updateParticipantProperty(state, pinnedParticipant, 'pinned', false);
                }
                state.pinnedParticipant = id;
            }

            if (participant.dominantSpeaker) {
                if (dominantSpeaker) {
                    updateParticipantProperty(state, dominantSpeaker, 'dominantSpeaker', false);
                }
                state.dominantSpeaker = id;
            }

            // const isModerator = isParticipantModerator(participant);
            // const { local, remote } = state;

            // if (state.everyoneIsModerator && !isModerator) {
            //     state.everyoneIsModerator = false;
            // } else if (!local && remote.size === 0 && isModerator) {
            //     state.everyoneIsModerator = true;
            // }
            if (participant.local) {
                console.log('---participants-local---')
                state.local = participant
            }
            else {
                console.log('---participants-else---', participant.dominantSpeaker)
                state.remote[id] = participant
                console.log('---participants-remote---')
                // state.remote = new Map(state.remote)
                console.log('---participants-remote-assign---', participant.pinned)
                // Insert the new participant.
                const displayName = getDisplayName(name);
                console.log('---participants-remote-displayName---', displayName)
                const sortedRemoteParticipants = Object.entries(state.sortedRemoteParticipants);
                sortedRemoteParticipants.push([id, displayName]);
                console.log('---participants-remote-ss---', sortedRemoteParticipants)
                sortedRemoteParticipants.sort((a, b) => a[1].localeCompare(b[1])).forEach(([id, displayName]) => {
                    state.sortedRemoteParticipants[id] = displayName
                });
                if (isFakeParticipant) {
                    // state.fakeParticipants.set(id, participant);
                }
            }
        })
        builder.addCase(localParticipantIdChanged.fulfilled, (state, action) => {
            const { local } = state
            if (local) {
                state.local.id = action.payload?.newValue;
            }
        })
    }
});

export const { } = participants.actions;

export default participants.reducer;

/**
 * Reduces a specific redux action of type {@link PARTICIPANT_JOINED} in the
 * feature base/participants.
 *
 * @param {Action} action - The redux action of type {@code PARTICIPANT_JOINED}
 * to reduce.
 * @private
 * @returns {Object} The new participant derived from the payload of the
 * specified {@code action} to be added into the redux state of the feature
 * base/participants after the reduction of the specified
 * {@code action}.
 */
function _participantJoined({ participant }) {
    const {
        avatarURL,
        botType,
        connectionStatus,
        dominantSpeaker,
        email,
        isFakeParticipant,
        isReplacing,
        isJigasi,
        loadableAvatarUrl,
        local,
        name,
        pinned,
        presence,
        role
    } = participant;
    let { conference, id } = participant;

    if (local) {
        // conference
        //
        // XXX The local participant is not identified in association with a
        // JitsiConference because it is identified by the very fact that it is
        // the local participant.
        conference = undefined;

        // id
        id || (id = LOCAL_PARTICIPANT_DEFAULT_ID);
    }

    return {
        avatarURL,
        botType,
        conference,
        connectionStatus,
        dominantSpeaker: dominantSpeaker || false,
        email,
        id,
        isFakeParticipant,
        isReplacing,
        isJigasi,
        loadableAvatarUrl,
        local: local || false,
        name,
        pinned: pinned || false,
        presence,
        role: role || PARTICIPANT_ROLE.NONE
    };
}

/**
 * Updates a specific property for a participant.
 *
 * @param {StateType} state - The redux state.
 * @param {string} id - The ID of the participant.
 * @param {string} property - The property to update.
 * @param {*} value - The new value.
 * @returns {boolean} - True if a participant was updated and false otherwise.
 */
function updateParticipantProperty(state: StateType, id: string, property: string, value: any) {
    const { remote, local } = state;
    if (remote.hasOwnProperty(id)) {
        remote[id] = { ...remote[id], [property]: value }
    } else if (local?.id === id || local?.id === 'local') {
        // The local participant's ID can chance from something to "local" when
        // not in a conference.
        state.local = { ...local, [property]: value }
    }
}

/**
 * Returns the participant's display name, default string if display name is not set on the participant.
 *
 * @param {string} name - The display name of the participant.
 * @returns {string}
 */
function getDisplayName(name: string): string {
    return name || 'Fellow Jitster';
}
