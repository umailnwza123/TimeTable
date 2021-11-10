import React, { useEffect, useState } from 'react'
import { View, Image, Dimensions, StyleSheet, Text } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize'
import * as Animatable from 'react-native-animatable';
import * as TimeTableAction from '../src/Action/TimeTable.Action'
import { useSelector, useDispatch } from "react-redux";


const { width, height } = Dimensions.get('window')
const uid = 'pier2';
const socketServer = `wss://ioservice.xyz/ws/messenger?uid=`
const API_URL = 'https://yakkoplatform.com/pier/api/timetable'

const IntroScreen = ({ navigation }) => {
    const disPatch = useDispatch()
    const VideoReducer = useSelector(({ FetchTimeTableReducer }) => FetchTimeTableReducer)

    const [logoState, setLogoState] = useState(false)
    const [visitPanwa, setVisit] = useState(false)
    const [socketConnect, setSocket] = useState(false)
    const [errorShow, setShow] = useState({
        active: false,
        msg: ''
    })


    useEffect(() => {
        const timeToNavigate = setTimeout(() => {
            navigation.navigate('TimeTable')
        }, 3000)
        return () => clearTimeout(timeToNavigate)
    }, [logoState, visitPanwa])

    return (
        <View style={{
            flex: 1, justifyContent: 'center',
            alignItems: 'center', backgroundColor: 'white'
        }}  >
            < Animatable.View
                animation={'bounceInLeft'}
                onAnimationEnd={() => {
                    setLogoState(true)
                }}
                style={style.frame_canvas} >
                <Text style={style.font_style_thai} >
                    ตารางเวลาเรือ
                </Text>
                <Text style={style.font_style} >
                    TimeTable
                </Text>
            </Animatable.View>
            {
                logoState ?
                    <Animatable.Image
                        onAnimationEnd={() => {
                            setVisit(true)
                        }}
                        animation={'bounceIn'}
                        source={require('../assets/images/logo.png')}
                        resizeMode={'contain'}
                        style={{
                            width: '15%',
                            marginLeft: (width * 0.35) / 2,
                            height: '15%'
                        }}
                    /> :
                    null
            }
            <View style={style.footer_version_canvas} >
                <Text style={style.font_version} >
                    Version 1.0.1
                </Text>
            </View>


        </View>
    )
}
export default IntroScreen;
const style = StyleSheet.create({
    frame_canvas: {
        width: '35%',
        height: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1.5,
        borderColor: '#002248'
    },
    font_style: {
        fontSize: RFPercentage(4.5),
        fontFamily: 'Kanit-SemiBold',
        color: '#de8300'
    },
    font_style_thai: {
        fontSize: RFPercentage(3.5),
        fontFamily: 'Kanit-SemiBold',
        color: '#002248'
    },
    footer_version_canvas: {
        width: '50%',
        height: '10%',
        position: 'absolute',
        bottom: '2%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    font_version: {
        fontFamily: 'Kanit-Regular',
        fontSize: RFPercentage(2),
        color: '#5C5C5C'
    }
})