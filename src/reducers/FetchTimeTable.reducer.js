import { FETCH_TIME_TABLE } from "../Constain";
import React from "react";
const TimeTableDemo = require('../../DataDemo/timeBoard.json')

const initialState = {
    TimeTable: TimeTableDemo.timetable
}

export default (state = initialState, {type, payload})=>{
    switch(type){
        
        case FETCH_TIME_TABLE:
            return {
                ...state,
                TimeTable: payload
            }
        default:
            return state
    }
}