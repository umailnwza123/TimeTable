import { NavigationContainer } from "@react-navigation/native";
import React, {useEffect, useState, useRef} from "react";
import { useIsFocused } from "@react-navigation/native";
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import * as TimeTableAction from '../src/Action/TimeTable.Action'
import { useSelector, useDispatch } from "react-redux";
import Video from 'react-native-video';
import YouTube from 'react-native-youtube';

const VideoAd = ({navigation, VideoName}) => {
    const VideoRef = useRef()
    const isFocused = useIsFocused()
    const disPatch = useDispatch()
    const VideoReducer = useSelector(({FetchTimeTableReducer})=> FetchTimeTableReducer)
    const [playVideo, setplayVideo] = useState(require('../assets/video/Yakko.mp4'))
    const [videolink, setvideolink] = useState('https://www.youtube.com/watch?v=Bp8vGn4u5g8&ab_channel=Yakko')
    const [currentTimeVideo, setCurrentTimeVideo] = useState()


    return (
        <View style={{ flex: 1, }}>
            {
                playVideo ?
                <Video 
                source={playVideo}   // Can be a URL or a local file.
                ref={VideoRef}     
                muted   
                onEnd={()=>{
                    console.log('End Video')
                    navigation.goBack()
                }}
                
                fullscreen={true}
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