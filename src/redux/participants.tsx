import { createAction, createSlice } from "@reduxjs/toolkit";
import { LOCAL_PARTICIPANT_DEFAULT_ID, PARTICIPANT_ROLE } from "../lib-jitsi-meet/constants";

/**
 * The participant properties which cannot be updated through
 * {@link PARTICIPANT_UPDATED}. They either identify the participant or can only
 * be modified through property-dedicated actions.
 *
 * @type {string[]}
 */
const PARTICIPANT_PROPS_TO_OMIT_WHEN_UPDATE: string[] = [

    // The following properties identify the participant:
    'conference',
    'id',
    'local',

    // The following properties can only be modified through property-dedicated
    // actions:
    'dominantSpeaker',
    'pinned'
];

interface StateType {
    local: any
    remote: { [id: string]: any }
    pinnedParticipant: string
    dominantSpeaker: string,
    sortedRemoteParticipants: string[]
    raisedHandsQueue: any[]
    haveParticipantWithScreenSharingFeature: boolean
}

const initialState: StateType = {
    local: undefined,
    remote: {},
    pinnedParticipant: '',
    dominantSpeaker: '',
    sortedRemoteParticipants: [],
    raisedHandsQueue: [],
    haveParticipantWithScreenSharingFeature: false
};

export const PARTICIPANT_JOINED = createAction<any>('participant_joined')

export const participants = createSlice({
    name: "participants",
    initialState,
    reducers: {
        participantLeft(state, action) {
            // XXX A remote participant is uniquely identified by their id in a
            // specific JitsiConference instance. The local participant is uniquely
            // identified by the very fact that there is only one local participant
            // (and the fact that the local participant "joins" at the beginning of
            // the app and "leaves" at the end of the app).
            const { conference, id } = action.payload;
            const { remote, local, dominantSpeaker, pinnedParticipant } = state;
            var oldParticipant = remote[id];

            if (oldParticipant && oldParticipant.conference === conference) {
                delete state.remote[id]
            } else if (local?.id === id) {
                oldParticipant = state.local;
                // delete state.local;
            }

            console.log("sortedParticipantt" , state.sortedRemoteParticipants);
            

            state.sortedRemoteParticipants = state.sortedRemoteParticipants.filter(pid => pid !== id)
            state.raisedHandsQueue = state.raisedHandsQueue.filter(pid => pid.id !== id);

            if (dominantSpeaker === id) {
                state.dominantSpeaker = '';
            }
            if (pinnedParticipant === id) {
                state.pinnedParticipant = '';
            }
        },
        participantUpdated(state, action: { type: string, payload: any }) {
            const { payload: participant } = action;
            let { id } = participant;
            const { local } = participant;

            if (!id && local) {
                id = LOCAL_PARTICIPANT_DEFAULT_ID;
            }

            let newParticipant;

            if (state.remote[id]) {
                newParticipant = _participant(state.remote[id], action);
                state.remote[id] = newParticipant
            } else if (id === state.local?.id) {
                newParticipant = state.local = _participant(state.local, action);
            }

            if (newParticipant) {
                // haveParticipantWithScreenSharingFeature calculation:
                const { features = {} } = participant;
                // Currently we use only PARTICIPANT_UPDATED to set a feature to enabled and we never disable it.
                if (String(features['screen-sharing']) === 'true') {
                    state.haveParticipantWithScreenSharingFeature = true;
                }
            }
        },
        dominantSpeakerChanged(state, action: { type: string, payload: { id: string, previousSpeakers: any[], conference: any } }) {
            if (state.dominantSpeaker) {
                updateParticipantProperty(state, state.dominantSpeaker, 'dominantSpeaker', false);
            }
            state.dominantSpeaker = action.payload.id
            updateParticipantProperty(state, state.dominantSpeaker, 'dominantSpeaker', true);
        },
        localParticipantIdChanged(state, action) {
            const { local } = state
            if (local) {
                state.local.id = action.payload;
            }
        },
        raiseHandUpdated(state, action: { type: string, payload: { id: string, raisedHandTimestamp: number } }) {
            const participant = action.payload
            var queue = [...state.raisedHandsQueue]
            if (participant.raisedHandTimestamp) {
                queue.push({
                    id: participant.id,
                    raisedHandTimestamp: participant.raisedHandTimestamp
                });
                // sort the queue before adding to store.
                queue = queue.sort(({ raisedHandTimestamp: a }, { raisedHandTimestamp: b }) => a - b);
            } else {
                // no need to sort on remove value.
                queue = queue.filter(({ id }) => id !== participant.id);
            }
            state.raisedHandsQueue = queue
        }
    },
    extraReducers(builder) {
        builder.addCase(PARTICIPANT_JOINED, (state, action) => {
            const participant = _participantJoined(action.payload);
            const { id, isFakeParticipant, pinned } = participant;
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
                if (state.local) {
                    state.local = _participant(state.local, action)
                }
                else {
                    state.local = participant
                }
            }
            else {
                console.log(id, "remote__participant" , participant);
                
                state.remote[id] = participant
                console.log(id, "remote__participant---" , state.sortedRemoteParticipants);

                state.sortedRemoteParticipants = [...state.sortedRemoteParticipants, id]
                console.log("herreree" , state.sortedRemoteParticipants);
                
                if (isFakeParticipant) {
                    // state.fakeParticipants.set(id, participant);
                }
            }
        })
    }
});

export const { participantLeft, dominantSpeakerChanged, localParticipantIdChanged, participantUpdated, raiseHandUpdated } = participants.actions;

export default participants.reducer;

/**
 * Reduces a specific redux action of type {@link PARTICIPANT_JOINED} in the
 * feature base/participants.
 *
 * @param {any} participant - The redux action of type {@code PARTICIPANT_JOINED}
 * to reduce.
 * @private
 * @returns {any} The new participant derived from the payload of the
 * specified {@code action} to be added into the redux state of the feature
 * base/participants after the reduction of the specified
 * {@code action}.
 */
function _participantJoined(participant: any): any {
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
function updateParticipantProperty(state: StateType, id: string, property: string, value: any): boolean {
    const { remote, local } = state;
    if (remote.hasOwnProperty(id)) {
        state.remote[id] = { ...remote[id], [property]: value }
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
// function getDisplayName(name: string): string {
//     return name || 'Fellow Jitster';
// }

/**
 * Reducer function for a single participant.
 *
 * @param {Participant|undefined} oldParticipant - Participant to be modified.
 * @param {Object} action - Action object.
 * @param {string} action.type - Type of action.
 * @param {Participant} action.payload - Information about participant to be
 * added/modified.
 * @param {JitsiConference} action.conference - Conference instance.
 * @private
 * @returns {Participant}
 */
function _participant(oldParticipant: Object = {}, action: { type?: string; payload: any; }): Participant {
    const { payload: participant } = action; // eslint-disable-line no-shadow

    const newState = { ...oldParticipant };

    for (const key in participant) {
        if (participant.hasOwnProperty(key)
            && PARTICIPANT_PROPS_TO_OMIT_WHEN_UPDATE.indexOf(key)
            === -1) {
            newState[key] = participant[key];
        }
    }

    return newState;
}