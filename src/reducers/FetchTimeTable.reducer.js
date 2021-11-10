import { FETCH_TIME_TABLE, SET_VIDEO, CAL_PROCRESSING, CURRENT_TIME_VIDEO,
DISCONNECT_SOCKET } from "../Constain";
import React from "react";
const TimeTableDemo = require('../../DataDemo/timeBoard.json')

const initialState = {
    TimeTable: TimeTableDemo.timetable,
    VideoIndex: 0,
    CalProcressed: false,
    CurrentTimeVideo: [],
    Disconnect: false
}

export default (state = initialState, {type, payload})=>{
    switch(type){
        case FETCH_TIME_TABLE:
            return {
                ...state,
                TimeTable: payload
            }
        case SET_VIDEO:
            return {
                ...state,
                VideoIndex: payload
            }
        case CAL_PROCRESSING:
            return {
                ...state,
                CalProcressed: payload
            }
        case CURRENT_TIME_VIDEO:
            return {
                ...state,
                CurrentTimeVideo: payload
            }
        
        case DISCONNECT_SOCKET:
            return {
                ...state,
                Disconnect: payload
            }
        default:
            return state
    }
}