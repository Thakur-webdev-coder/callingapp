import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    timeEstablished: 0,
    connection: undefined,
    connecting: undefined
};

export const connection = createSlice({
    name: 'connection',
    initialState,
    reducers: {
        connectionWillConnect(state, action) {
            state.connecting = action.payload
        },
        destroyConnection(state, action) {
            state = initialState
        },
        connectionEstablished(state, action) {
            state.connection = action.payload?.connection
            state.connecting = undefined
            state.timeEstablished = action.payload?.time
        }
    },
});

export const { connectionWillConnect, destroyConnection, connectionEstablished } = connection.actions;

export default connection.reducer;