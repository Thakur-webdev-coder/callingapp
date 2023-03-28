import { localParticipantIdChanged } from "../lib-jitsi-meet/actions"
import { LOCAL_PARTICIPANT_DEFAULT_ID } from "../lib-jitsi-meet/constants"
import { willjoinConference, willLeaveConference } from "../redux/conference"

const participants = (store) => (next) => (action) => {
    const { dispatch, getState } = store
    switch (action.type) {
        case willjoinConference.type:
            // dispatch(localParticipantIdChanged(action.payload.myUserId()))
            break

        case willLeaveConference.type:
            // dispatch(localParticipantIdChanged(LOCAL_PARTICIPANT_DEFAULT_ID))
            break

    }
    return next(action)
}
export default participants