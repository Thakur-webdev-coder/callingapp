import { initConfig } from "../lib-jitsi-meet/actions"
import { conferenceLeft } from "../redux/conference"
import { resetSettings, setMeetingDomain } from "../redux/meetConfig"

const meetConfig = (store) => (next) => (action) => {
    const { dispatch, getState } = store
    const { locationURL, config } = getState()['meetConfig']
    switch (action.type) {
        case setMeetingDomain.type:
            if (locationURL !== action.payload || !config) {
                dispatch(initConfig(action.payload))
            }
            break

            case conferenceLeft.type:
                dispatch(resetSettings())
    }
    return next(action)
}
export default meetConfig