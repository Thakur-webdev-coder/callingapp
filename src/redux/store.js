// import { createStore, combineReducers } from 'redux';
// import reducer from '../redux/reducer'
// const rootReducer = combineReducers(
// { count: reducer }
// );
// const Store = () => {
// return createStore(rootReducer);
// }
// export default Store;

// import { createStore } from 'redux';

import { persistStore, persistReducer } from "redux-persist";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import AsyncStorage from "@react-native-async-storage/async-storage";
import sliceReducer from "./reducer";
import meetConfig from "./meetConfig";
import conference from "./conference";
import connection from "./connection";
import participants from "./participants";
import tracks from "./tracks";
import {
  conference_middleware,
  meetConfig_middleware,
  participants_middleware,
  tracks_middleware,
} from "../middlewares";

const rootReducer = combineReducers({
  sliceReducer,
  meetConfig,
  tracks,
  connection,
  conference,
  participants,
});

const persist_reducer = {
  storage: AsyncStorage,
  key: "root",
  //   whitelist: ["userDetails"],
  blacklist: ["tracks", "connection", "conference"],
};
const persistedReducer = persistReducer(persist_reducer, rootReducer);
let Store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(conference_middleware)
      .concat(meetConfig_middleware)
      .concat(tracks_middleware)
      .concat(participants_middleware),
});
export const persistor = persistStore(Store);
export default Store;

// import {  persistReducer } from 'redux-persist';
// import { configureStore } from '@reduxjs/toolkit';

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { sliceReducer } from './reducer';

// const persist_reducer = {
//     storage: AsyncStorage,
//     key: 'root',
//     //whitelist: ['userDetails']
// }
// const persistedReducer = persistReducer(persist_reducer, sliceReducer)

// export const Store = configureStore({
//     reducer: persistedReducer,
//     middleware: (getDefaultMiddleware) => {
//       return  getDefaultMiddleware({serializableCheck:false})
//     }
// });
// export const persistor = persistStore(Store);
