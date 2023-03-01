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


import { persistStore, persistReducer } from 'redux-persist';
import { configureStore } from '@reduxjs/toolkit';

import AsyncStorage from '@react-native-async-storage/async-storage';
import sliceReducer from './reducer';

const persist_reducer = {
    storage: AsyncStorage,
    key: 'root',
    //whitelist: ['userDetails']
}
const persistedReducer = persistReducer(persist_reducer, sliceReducer)
 let Store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
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