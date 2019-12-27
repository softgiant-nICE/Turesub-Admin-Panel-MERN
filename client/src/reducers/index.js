import { combineReducers } from "redux";
import authReducer from "./authReducers";
import categoryReducer from "./categoryReducers";
import itemReducer from "./itemReducers";
import errorReducer from "./errorReducers";
export default combineReducers({
    auth: authReducer,
    category: categoryReducer,
    item: itemReducer,
    errors: errorReducer
});