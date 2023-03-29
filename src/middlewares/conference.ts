import { ThunkMiddleware } from "@reduxjs/toolkit"
import { connectConf } from "../lib-jitsi-meet/actions"
import { CustomConferenceEvents, PARTICIPANT_ROLE } from "../lib-jitsi-meet/constants"
import { getCurrentConference, getLocalParticipant, sendCommandOnce } from "../lib-jitsi-meet/functions"
import { connectionEstablished } from "../redux/connection"
import { PARTICIPANT_JOINED } from "../redux/participants"

const connection: ThunkMiddleware = (store) => (next) => (action) => {
    const { dispatch, getState } = store
    const localParticipant = getLocalParticipant(getState())
    const conference = getCurrentConference(getState())
    const { confData = {} } = getState()['conference']
    const { additional_moderators = [], screenSharingPermission = [] } = confData
    const { payload: participant = {}, type } = action;
    const { id } = participant;
    switch (type) {
        case connectionEstablished.type:
            console.log('---conference-middleware-action---', action)
            dispatch(connectConf(''))
            break

        case PARTICIPANT_JOINED: {
            if (conference && (localParticipant.role === PARTICIPANT_ROLE.MODERATOR)) {
                sendCommandOnce(conference, CustomConferenceEvents.SYNC_CONF_DATA, JSON.stringify({ additional_moderators, screenSharingPermission, id }))
            }
            break
        }
    }
    return next(action)
}
export default connection