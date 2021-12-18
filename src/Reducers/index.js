import { combineReducers } from "redux";
import StyleReducer from "./StyleReducer";

const rootReducer = combineReducers({
    style: StyleReducer,
});
export default rootReducer;