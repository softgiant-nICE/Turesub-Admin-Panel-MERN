import axios from "axios";
import {
    GET_ERRORS,
    ITEM_ADD,
    ITEM_UPDATE
} from "./types";

export const addItem = (ItemData, history, callback) => dispatch => {
    axios
        .post("/api/Item-add", ItemData)
        .then(res =>{
                    if (callback) callback(res)
                    dispatch({
                        type: ITEM_ADD,
                        payload: res,
                    })
                }).catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};


export const updateItem = (ItemData, callback) => dispatch => {
    axios
        .post("/api/Item-update", ItemData)
        .then(res =>{
                    if (callback) callback(res)
                    dispatch({
                        type: ITEM_UPDATE,
                        payload: res,
                    })}
        ).catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};
