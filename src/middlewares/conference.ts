import { connectConf } from "../lib-jitsi-meet/actions"
import { connectionEstablished } from "../redux/connection"

const connection = (store) => (next) => (action) => {
    const { dispatch } = store
    console.log("storeeee" , store);
    
    switch (action.type) {
        case connectionEstablished.type: {
            console.log('---conference-middleware-action---', action)
            dispatch(connectConf())
        }
    }
    return next(action)
}
export default connection