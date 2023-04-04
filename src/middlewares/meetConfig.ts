import { ThunkMiddleware } from "@reduxjs/toolkit"
// import { goBack } from "../../features/routes/native/RootNavigationRef"
import { initConfig, initJitsi } from "../lib-jitsi-meet/actions"
import { conferenceLeft } from "../redux/conference"
import { resetSettings, setMeetingDomain } from "../redux/meetConfig"

const meetConfig: ThunkMiddleware = (store) => (next) => (action) => {
    const { dispatch, getState } = store
    const { locationURL, config } = getState()['meetConfig']
    switch (action.type) {
        case setMeetingDomain.type:
            if (locationURL !== action.payload || !config) {
                dispatch(initConfig(action.payload))
            }
            else if (config) {
                dispatch(initJitsi())
            }
            break

        case conferenceLeft.type:
            // goBack()
            dispatch(resetSettings())
            break
    }
    return next(action)
}
export default meetConfig