import { ThunkMiddleware } from "@reduxjs/toolkit"
import { LOCAL_PARTICIPANT_DEFAULT_ID } from "../lib-jitsi-meet/constants"
import { conferenceLeft, willjoinConference } from "../redux/conference"
import { localParticipantIdChanged } from "../redux/participants"

const participants: ThunkMiddleware = (store) => (next) => (action) => {
    const { dispatch } = store
    switch (action.type) {
        case willjoinConference.type:
            dispatch(localParticipantIdChanged(action.payload.myUserId()))
            break

        case conferenceLeft.type:
            dispatch(localParticipantIdChanged(LOCAL_PARTICIPANT_DEFAULT_ID))
            break

    }
    return next(action)
}
export default participants