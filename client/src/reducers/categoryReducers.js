import {
    SET_CURRENT_CATEGORY,
    CATEGORY_ADD,
    CATEGORY_LOADING,
    CATEGORY_UPDATE
} from "../actions/types";
const isEmpty = require("is-empty");
const initialState = {
    isAuthenticated: false,
    category: {},
    loading: false,
};
export default function(state = initialState, action) {
    switch (action.type) {
        case CATEGORY_ADD:
            return {
                isAuthenticated: !isEmpty(action.payload),
                category: action.payload
            };
        case CATEGORY_UPDATE:
            return {
                isAuthenticated: !isEmpty(action.payload),
                category: action.payload,
            };
        case SET_CURRENT_CATEGORY:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                category: action.payload
            };
        case CATEGORY_LOADING:
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    }
}
