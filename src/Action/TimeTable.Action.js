
import { FETCH_TIME_TABLE } from "../Constain";

export const setFetchTimeTable = (payload) => ({
    type: FETCH_TIME_TABLE,
    payload
})

export const FetchTimeFun =  (payload) => {
    return  dispatch => {
         dispatch(setFetchTimeTable(payload))
    }
}
