import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Dimensions,
    TextInput,
    Text,
    ScrollView,
    AppState,
    ImageBackground,
    Button,
    Alert,
    BackHandler,
    Image,
    ActivityIndicator,
    StyleSheet
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import * as TimeTableAction from '../src/Action/TimeTable.Action'
import Icon from 'react-native-vector-icons/FontAwesome'
import PopupMsg from "../components/PopupMsg";
import axios from "axios";
const { width, height } = Dimensions.get('window')
import moment from 'moment';
import MarqueeText from 'react-native-marquee';
import TextTicker from 'react-native-text-ticker'
import AutoScrolling from "react-native-auto-scrolling";
var momentTimezone = require('moment-timezone');
let timeZoneThailand = momentTimezone.tz('Asia/Bangkok')//.format('HH:mm a')
const uid = 'pier2';
const socketServer = `wss://ioservice.xyz/ws/messenger?uid=`
const API_URL = 'https://yakkoplatform.com/pier/api/timetable'



const TimeTable = ({ navigation }) => {
    const dispatch = useDispatch()
    const VideoReducer = useSelector(({ FetchTimeTableReducer }) => FetchTimeTableReducer)
    const isFocused = useIsFocused();
    const [showErrorPopup, setShow] = useState({
        active: false,
        msg: ''
    })
    const [netStatus, setNetwork] = useState(true)
    const [backgroundFinal, setbackgroundFinal] = useState('#F7ADAD')
    const [backgroundColorState, setBackgroundColor] = useState({
        final: '#F7ADAD', //'#F7ADAD': item.note==='Checkin' ?'#90EC92'
        checkin: '#90EC92',
        takeoff: '#CAD1E7'
    })
    const [AppSleep, setAppSleep] = useState(false)
    const [timeZone, setTimeZone] = useState({
        hour: timeZoneThailand.format('HH'),
        minutes: timeZoneThailand.format('mm'),
        type: timeZoneThailand.format('a')
    })
    const [timeTableState, setTimeTableState] = useState([])

    //Use websocket list event onmessage
    //Initial Fetch API 
    useEffect(() => {
        fetchTimeAPI()
        //initiateSocketConnection()
    }, [])


    //Fetch API Method
    const fetchTimeAPI = () => {
        axios({
            method: 'GET',
            url: API_URL,
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((response) => {
                if (response.data.length <= 0) {
                    setShow({
                        ...showErrorPopup,
                        active: true,
                        msg: 'No package tour'
                    })
                } else {
                    setTimeTableState(CalculateOrProcressTime(response.data))

                }
            })
            .catch((error) => {
                setNetwork(false)
                setShow({
                    ...showErrorPopup,
                    active: true,
                    msg: 'Network Error Please connect again...'
                })
            })
    }



    useEffect(() => {
        AppState.addEventListener('change', state => {
            if (state === 'active' && netStatus) {
                fetchTimeAPI()
                //initiateSocketConnection()
                setAppSleep(false)

            } else if (state === 'background') {
                console.log('Backgrounf')
                setAppSleep(true)
            }
        });
    }, [])


    //Fetch Folllow by time 


    //Reconnection
    useEffect(() => {
        if (netStatus === false) {
            const timeConnetion = setInterval(() => {
                fetchTimeAPI()
                console.log('Reconnection....')
                if (!showErrorPopup.active) {
                    setNetwork(true)
                }
            }, 20000)
            return () => clearInterval(timeConnetion)
        }

    }, [netStatus])



    //initial socket connection function
    const initiateSocketConnection = () => {
        // Add URL to the server which will contain the server side setup
        const ws = new WebSocket(`${socketServer}${uid}`);
        try {
            ws.onopen = () => {
                console.log('socket connected');
                setNetwork(true)
                setShow({
                    ...showErrorPopup,
                    active: false,
                    msg: ''
                })
            };
            ws.onmessage = e => {
                const message = JSON.parse(e.data);
                if (message.data.task === 'refresh') {
                    fetchTimeAPI()
                }
            };

            ws.onclose = e => {
                console.log('Close CHERAEY')
                //setNetwork(false)
            };
            ws.onerror = e => {
                console.log('Workinf Heere')
                setShow({
                    ...showErrorPopup,
                    active: true,
                    msg: 'Network Error Please connect again...'
                })
                setNetwork(false)
                //ws.close()
            };
        }
        catch (e) {
            console.error(e)
        }

    };

    function hhmmss(secs) {
        var minutes = Math.floor(secs / 60);
        secs = secs % 60;
        var hours = Math.floor(minutes / 60)
        minutes = minutes % 60;
        return `${pad(hours)}:${pad(minutes)}`;
    }
    function pad(num) {
        //console.log(num < -9) //-10 -9
        return ("0" + num).slice(num < -9 ? -3 : -2);
    }

    const ReFreshTime = () => {
        setTimeTableState([])
        fetchTimeAPI()
    }

    const CalculateOrProcressTime = (TimeTablePackage) => {
        let timeCurrent = momentTimezone.tz('Asia/Bangkok').format('HH:mm')
        try {
            TimeTablePackage.map((item, index) => {
                try {
                    let DepTime = item.departure //13.00
                    let ArrivalTime = item.arrival
                    let timeCurrentSeccond = (timeCurrent.split(':')[0] * 3600) + (timeCurrent.split(':')[1] * 60) // Change current time to milliseccond
                    let DepTimeSeccond = (DepTime.split(':')[0] * 3600) + (DepTime.split(':')[1] * 60) //Change Departure time to milliseccond
                    let ArrivalSeccond = (ArrivalTime.split(':')[0] * 3600) + (ArrivalTime.split(':')[1] * 60)
                    //  console.log('Depart Time'+hhmmss((DepTimeSeccond) - (timeCurrentSeccond))) //hhmmss function would be change milliseccond to HH:mm format
                    //console.log('Arrival Time'+hhmmss((ArrivalSeccond) - (timeCurrentSeccond)))

                    if (parseInt(hhmmss((DepTimeSeccond) - (timeCurrentSeccond)).split(':')[0]) < 0 || //Over difine time
                        parseInt(hhmmss((DepTimeSeccond) - (timeCurrentSeccond)).split(':')[1]) < 0) {
                        item.note = 'Out'
                    }
                    else if (parseInt(hhmmss((DepTimeSeccond) - (timeCurrentSeccond)).split(':')[0]) === 0 && // Procress time less than 30 minutes => Final Calling
                        parseInt(hhmmss((DepTimeSeccond) - (timeCurrentSeccond)).split(':')[1]) <= 30) {
                        item.note = 'Final'
                    }
                    else if (parseInt(hhmmss((DepTimeSeccond) - (timeCurrentSeccond)).split(':')[0]) === 0 && // Procress time less than or equal 60 => Chanking
                        parseInt(hhmmss((DepTimeSeccond) - (timeCurrentSeccond)).split(':')[1]) <= 60) {
                        item.note = 'Checkin'
                    }else{
                        // item.note = ' Arri'
                    }
                }
                catch (error) {
                    seterrormsg(error)
                    console.log('Error 2')
                }
            })
        }
        catch (error) {
            seterrormsg(error)
            console.log('Error 1')
        }
        return TimeTablePackage
    }

    //current time
    useEffect(() => {
        try {
            const currentTime = setInterval(() => {
                let time = momentTimezone.tz('Asia/Bangkok')
                setTimeZone({
                    ...timeZone,
                    hour: time.format('HH'),
                    minutes: time.format('mm'),
                    type: time.format('a')
                })
            }, 1000)
            return () => clearInterval(currentTime)
        }
        catch (error) {
            console.error('Error 3')
            seterrormsg(error)
        }
    }, [])

    //Calling Calculate time function
    useEffect(() => {
        if (timeTableState.length > 0 && netStatus === true) {
            const TimeProcress = setInterval(() => {
                console.log('Time calculator is Working')
                //dispatch(TimeTableAction.SetCalProcessing(true))
                setShow({
                    ...showErrorPopup,
                    active: false,
                    msg: ''
                })
                CalculateOrProcressTime(timeTableState)
            }, 65000) //60000
            return () => clearInterval(TimeProcress)
        }
    }, [timeTableState])

    //background color change
    useEffect(() => {
        try {
            if (backgroundFinal === '#F7ADAD' || backgroundFinal === 'white') {
                const timeoutID = setInterval(() => {
                    setbackgroundFinal(backgroundFinal === '#F7ADAD' ? 'white' : '#F7ADAD');
                }, 500);
                return () => clearInterval(timeoutID);
            }
        }
        catch (e) {
            console.error(e)
        }

    });

    //Fecth Followed by time 
    useEffect(() => {
        const TimeToFetch = setInterval(() => {
            ReFreshTime()
        }, 300000) // 2 Minutes
        return () => clearInterval(TimeToFetch)
    }, [timeTableState])


    //Show Ad Video
    useEffect(() => {
        if (isFocused) {
            const TimeToShow = setTimeout(() => {
                navigation.navigate('VideoAd')
            }, 600000) //600000
            return () => clearTimeout(TimeToShow)
        }


    }, [isFocused])



    // BackHandler.addEventListener('hardwareBackPress', BackButton);
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true);
    }, []);

    return (
        <View style={{ flex: 1 }} >
            <ImageBackground
                resizeMode={'cover'}
                style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%', height: '100%'
                }}
                source={require('../assets/images/bg.jpg')} />
            <View style={style.canvas} >
                <View
                    style={[style.header_canvas]} >
                    <View style={[style.Logo_canvas,]}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >

                            <Image source={require('../assets/images/logo-02.png')} 
                                resizeMode={'contain'}
                                style={{alignSelf: 'center', width: width*0.08, height: width*0.08}}
                            />

                        </View>
                    </View>
                    <View style={[style.TimeTable_Label_canvas, style.set_center]}>
                        <Text style={style.font_header_style}>
                            ตารางเวลาเรือ
                        </Text>
                        <Text
                            onPress={() => {
                                navigation.navigate('VideoAd')
                            }}
                            style={style.font_header_behide_style} >
                            TIME TABLE
                        </Text>
                    </View>
                    <View style={[style.Current_date_time_canvas]}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[style.font_time, { color: 'black' }]}>Date :  </Text>
                            <Text style={style.font_time}>{`${moment().format('DD')}/${moment().month(moment().format('MMMM')).format("M")}/${moment().format('YYYY')}`}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[style.font_time, { color: 'black' }]}>Time :  </Text>
                            <Text style={style.font_time} > {`${timeZone.hour}:${timeZone.minutes} ${timeZone.type.toUpperCase()}`} </Text>
                        </View>
                    </View>
                    <View style={[style.Refresh_canvas, style.set_center,
                    { alignItems: 'flex-start' }]} >
                        <Icon
                            onPress={() => ReFreshTime()}
                            color={'#002248'}
                            size={RFPercentage(2)}
                            name={'refresh'} />
                    </View>
                </View>




                <View style={style.header_content_canvas} >
                    <View style={[style.set_center, style.color_border_box, { flex: 0.27 }]}>
                        <Text style={[style.font_header_content_style, style.font_color_header]}>
                            บริษัทเรือ
                        </Text>
                        <Text style={[style.font_header_content_style, style.font_color_header_below]}>
                            (Company)
                        </Text>
                    </View>
                    <View style={[style.set_center, style.color_border_box, { flex: 0.19 }]}>
                        <Text style={[style.font_header_content_style, style.font_color_header]}>
                            ชื่อเรือ
                        </Text>
                        <Text style={[style.font_header_content_style, style.font_color_header_below]}>
                            (ฺBoat name)
                        </Text>
                    </View>
                    <View style={[style.set_center, style.color_border_box, { flex: 0.18 }]}>
                        <Text style={[style.font_header_content_style, style.font_color_header]}>
                            จุดหมายปลายทาง
                        </Text>
                        <Text style={[style.font_header_content_style, style.font_color_header_below]}>
                            (Destination)
                        </Text>
                    </View>
                    <View style={[style.set_center, style.color_border_box, { flex: 0.1 }]}>
                        <Text style={[style.font_header_content_style, style.font_color_header]}>
                            ขาออก
                        </Text>
                        <Text style={[style.font_header_content_style, style.font_color_header_below]}>
                            (Departure)
                        </Text>
                    </View>
                    <View style={[style.set_center, style.color_border_box, { flex: 0.1 }]}>
                        <Text style={[style.font_header_content_style, style.font_color_header]}>
                            ขาเข้า
                        </Text>
                        <Text style={[style.font_header_content_style, style.font_color_header_below]}>
                            (Arrival)
                        </Text>
                    </View>
                    <View style={[style.set_center, style.color_border_box, { flex: 0.06 }]}>
                        <Text style={[style.font_header_content_style, style.font_color_header]}>
                            ประตู
                        </Text>
                        <Text style={[style.font_header_content_style, style.font_color_header_below]}>
                            (Gate)
                        </Text>
                    </View>
                    <View style={[style.set_center, { flex: 0.1 }]}>
                        <Text style={[style.font_header_content_style, style.font_color_header]}>
                            หมายเหตุ
                        </Text>
                        <Text style={[style.font_header_content_style, style.font_color_header_below]}>
                            (Note)
                        </Text>
                    </View>
                </View>


                {
                    timeTableState.length > 0 ?
                        timeTableState.map((item, index) => {
                            return (
                                <View key={index}
                                    style={[style.row_canvas,
                                    {
                                        backgroundColor: index % 2 == 0 ?
                                            item.note === 'Final' ? backgroundFinal : item.note === 'Checkin' ?
                                                backgroundColorState.checkin : item.note === 'Out' ? backgroundColorState.takeoff : '#ffffff'
                                            : item.note === 'Final' ?
                                                backgroundFinal : item.note === 'Checkin' ? backgroundColorState.checkin : item.note === 'Out' ? backgroundColorState.takeoff : '#ffffff'
                                    }]}>
                                    <View style={[style.color_border_content_box,
                                    { flex: 0.27, flexDirection: 'row' }]}>
                                        <View style={style.logo_image_canvas} >
                                            <Image
                                                resizeMethod={'resize'}
                                                resizeMode={'contain'}
                                                style={style.logo_image}
                                                source={{ uri: item.company_logo }}
                                            />
                                        </View>
                                        <View style={[style.set_center, {
                                            width: '70%', height: '100%',
                                        }]}>
                                            <Text style={style.font_content_style}>
                                                {item.company}
                                            </Text>
                                        </View>

                                    </View>
                                    <View style={[style.set_center, style.color_border_content_box, { flex: 0.19 }]}>
                                        <Text style={style.font_content_style}>
                                            {item.name_ship}
                                        </Text>
                                    </View>
                                    <View style={[style.set_center, style.color_border_content_box, { flex: 0.18 }]}>
                                        <Text style={style.font_content_style}>
                                            {item.destination}
                                        </Text>
                                    </View>
                                    <View style={[style.set_center, style.color_border_content_box, { flex: 0.1 }]}>
                                        <Text style={style.font_content_style}>
                                            {item.departure}
                                        </Text>
                                    </View>
                                    <View style={[style.set_center, style.color_border_content_box, { flex: 0.1 }]}>
                                        <Text style={style.font_content_style}>
                                            {item.arrival}
                                        </Text>
                                    </View>
                                    <View style={[style.set_center, style.color_border_content_box, { flex: 0.06 }]}>
                                        <Text style={style.font_content_style}>
                                            {item.gate}
                                        </Text>
                                    </View>
                                    <View style={[style.set_center, style.color_border_content_box, { flex: 0.1 }]}>
                                        <Text style={style.font_content_style}>
                                            {item.note === 'Final' ? 'Final Call' : item.note}
                                        </Text>
                                    </View>
                                </View>
                            )
                        })
                        :
                        <View style={{ flex: 1 }}>
                            <ActivityIndicator color={'red'} size={'small'} />
                        </View>
                }

            </View>


            {/* Footer text sign */}
            <View style={[style.footer_text_canvas]}>
                <AutoScrolling
                    endPadding={50}
                >
                    <Text
                        style={style.font_stlye_marquee} >
                        {
                            netStatus ?
                                "Welcome to Visit Panwa, You can check your trip here. Have a nice Day :)"
                                :
                                showErrorPopup.msg
                        }

                    </Text>
                </AutoScrolling>
            </View>
        </View>
    )
}
export default TimeTable
const style = StyleSheet.create({
    canvas: {
        flex: 0.97,
        paddingLeft: '5%',
        paddingRight: '5%'
    },
    header_canvas: {
        width: '100%',
        height: Dimensions.get('window').height * 0.12,
        flexDirection: 'row',
    },
    header_content_canvas: {
        width: '100%',
        height: height * 0.085,
        flexDirection: 'row',
        backgroundColor: '#002248',
        borderTopRightRadius: width * 0.012,
        borderTopLeftRadius: width * 0.012,
        overflow: 'hidden'
    },
    row_canvas: {
        width: '100%',
        height: height * 0.061,
        backgroundColor: 'white',
        borderBottomWidth: 0.6,
        flexDirection: 'row'
    },
    color_border_box: {
        borderRightWidth: 1,
        borderRightColor: 'white'
    },

    color_border_content_box: {
        borderRightWidth: 1,
        borderRightColor: '#002248'
    },
    Logo_canvas: {
        flex: 0.2,
    },
    TimeTable_Label_canvas: {
        flex: 0.6,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    Current_date_time_canvas: {
        flex: 0.13,
        justifyContent: 'flex-end',
        paddingBottom: '1%',
    },
    Refresh_canvas: {
        flex: 0.07,
        paddingTop: '1%'
    },
    font_color_header: {
        color: 'white',
    },
    font_color_header_below: {
        color: '#c3933a',
    },
    footer_text_canvas: {
        width: '100%',
        height: '5%',
        position: 'absolute',
        backgroundColor: 'white',
        bottom: 0,
        flex: 1,
        justifyContent: 'center'

    },
    font_header_content_style: {
        fontSize: RFPercentage(1.35),
        fontFamily: 'Kanit-Regular'
    },
    font_time: {
        color: 'white',
        fontSize: RFPercentage(1.35),
        fontFamily: 'Kanit-SemiBold'
    },
    font_content_style: {
        fontSize: RFPercentage(1.4),
        color: 'black',
        fontFamily: 'Kanit-Regular'
    },
    font_header_style: {
        fontSize: RFPercentage(2.75),
        fontFamily: 'Kanit-SemiBold',
        color: '#002248'
    },
    font_header_behide_style: {
        fontSize: RFPercentage(2.75),
        marginLeft: '1%',
        fontFamily: 'Kanit-SemiBold',
        color: '#de8300'
    },
    font_stlye_marquee: {
        fontSize: RFPercentage(1.5),
        fontFamily: 'Kanit-SemiBold',
        color: 'black'
    },
    set_center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo_image_canvas: {
        width: '30%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    logo_image_circle_canvas: { //circle
        width: width * 0.03,
        height: width * 0.025,
        justifyContent: 'center'
    },
    logo_image: {
        width: width * 0.045,
        height: width * 0.028,
        alignSelf: 'center'
    }
})