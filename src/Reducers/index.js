import { combineReducers } from "redux";
import ListTabReducer from "./ListTabReducer";
import SearchReducer from "./SearchReducer";
import StyleReducer from "./StyleReducer";

const rootReducer = combineReducers({
    style: StyleReducer,
    listTabData: ListTabReducer,
    searchData: SearchReducer
});
export default rootReducer;