import { combineReducers } from "redux";
import meetConfig from "./meetConfig";
import sliceReducer from "./reducer";

const rootReducer = combineReducers({
  reducer: sliceReducer,
  meetConfig: meetConfig,
});

export default rootReducer;
