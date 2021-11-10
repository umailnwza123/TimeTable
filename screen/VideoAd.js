import { NavigationContainer } from "@react-navigation/native";
import React, {useEffect, useState, useRef} from "react";
import { useIsFocused } from "@react-navigation/native";
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import * as TimeTableAction from '../src/Action/TimeTable.Action'
import { useSelector, useDispatch } from "react-redux";
import Video from 'react-native-video';


const VideoAd = ({navigation, VideoName}) => {
    const VideoRef = useRef()
    const isFocused = useIsFocused()
    const disPatch = useDispatch()
    const VideoReducer = useSelector(({FetchTimeTableReducer})=> FetchTimeTableReducer)
    const [playVideo, setplayVideo] = useState(require('../assets/video/Yakko2.mp4'))
    const [currentTimeVideo, setCurrentTimeVideo] = useState()
    // useEffect(()=>{
    //     if(VideoReducer.CalProcressed === true){
    //         disPatch(TimeTableAction.SetCalProcessing(false))
    //         disPatch(TimeTableAction.SetCurrentTimeVideo(currentTimeVideo))
    //         navigation.goBack()
    //     }
    // },[VideoReducer.CalProcressed])


    return (
        <View style={{ flex: 1, }}>
            {
                playVideo ?
                <Video source={playVideo}   // Can be a URL or a local file.
                ref={VideoRef}        
                onEnd={()=>{
                    console.log('End Video')
                    // disPatch(TimeTableAction.SetCurrentTimeVideo(0))
                    // disPatch(TimeTableAction.SetCalProcessing(false))
                    navigation.goBack()
                }}
                
                fullscreen={true}
                // onProgress={(currentTime)=>{
                //     setCurrentTimeVideo(currentTime.currentTime)
                //     console.log(currentTime.playableDuration/2)
       
                // }}
                resizeMode={'stretch'}
                style={style.backgroundVideo} />
                :
                null

            }
            
        </View>
    )
}
export default VideoAd

const style = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
})