import { Middleware } from "@reduxjs/toolkit"
import { disposeAndRemoveTracks } from "../lib-jitsi-meet/actions"
import { getLocalTracks } from "../lib-jitsi-meet/functions"
import { conferenceLeft } from "../redux/conference"

const tracks: Middleware = (store) => (next) => (action) => {
    const { dispatch, getState } = store
    const { tracks } = getState()
    switch (action.type) {
        case conferenceLeft.type:
            console.log('---tracks-middleware-action---', action)
            dispatch(disposeAndRemoveTracks(getLocalTracks(tracks).map(t => t.jitsiTrack)))
            break
    }
    return next(action)
}
export default tracks