
import { FETCH_TIME_TABLE, 
    SET_VIDEO, 
    CAL_PROCRESSING, 
    CURRENT_TIME_VIDEO,
    DISCONNECT_SOCKET } from "../Constain";

export const setFetchTimeTable = (payload) => ({
    type: FETCH_TIME_TABLE,
    payload
})

export const setIndexVideo = (payload) => ({
    type: SET_VIDEO,
    payload
})
export const setCalProcressing = (payload) => ({
    type: CAL_PROCRESSING,
    payload
})
export const setCurrentTime = (payload) => ({
    type: CURRENT_TIME_VIDEO,
    payload
})

export const setDisconnect = (payload) => ({
    type: DISCONNECT_SOCKET,
    payload
})








export const FetchTimeFun =  (payload) => {
    return  dispatch => {
         dispatch(setFetchTimeTable(payload))
    }
}
export const SetVideoIndex = (payload)=>{
    return dispatch => {
        dispatch(setIndexVideo(payload))
    }
}

export const SetCalProcessing = (payload)=>{
    return dispatch=>{
        dispatch(setCalProcressing(payload))
    }
}

export const SetCurrentTimeVideo = (payload)=>{
    console.log(payload)
    return dispatch=>{
        dispatch(setCurrentTime(payload))
    }
}

export const disconnectSocket = (payload)=>{
    return dispatch=>{
        dispatch(setDisconnect(payload))
    }
}
