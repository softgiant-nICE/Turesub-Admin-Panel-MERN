import {
    SET_CURRENT_ITEM,
    ITEM_ADD,
    ITEM_LOADING,
    ITEM_UPDATE
} from "../actions/types";
const isEmpty = require("is-empty");
const initialState = {
    isAuthenticated: false,
    item: {},
    loading: false,
};
export default function(state = initialState, action) {
    switch (action.type) {
        case ITEM_ADD:
            return {
                isAuthenticated: !isEmpty(action.payload),
                item: action.payload
            };
        case ITEM_UPDATE:
            return {
                isAuthenticated: !isEmpty(action.payload),
                item: action.payload,
            };
        case SET_CURRENT_ITEM:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                item: action.payload
            };
        case ITEM_LOADING:
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    }
}
