import axios from "axios";
import {
    GET_ERRORS,
    CATEGORY_ADD,
    CATEGORY_UPDATE
} from "./types";

export const addCategory = (categoryData, history, callback) => dispatch => {
    axios
        .post("/api/category-add", categoryData)
        .then(res =>{
                    if (callback) callback(res)
                    dispatch({
                        type: CATEGORY_ADD,
                        payload: res,
                    })
                }).catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};


// export const updateCategory = (categoryData) => dispatch => {
//     axios
//         .post("/api/category-update", categoryData)
//         .then(res =>
//             dispatch({
//                 type: CATEGORY_UPDATE,
//                 payload: res,
//             })
//         ).catch(err =>
//         dispatch({
//             type: GET_ERRORS,
//             payload: err.response.data
//         })
//     );
// };

export const updateCategory = (categoryData, callback) => dispatch => {
    axios
        .post("/api/category-update", categoryData)
        .then(res =>{
                    if (callback) callback(res);
                    dispatch({
                        type: CATEGORY_UPDATE,
                        payload: res,
                    })}
        ).catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};