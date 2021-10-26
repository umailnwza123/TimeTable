import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Dimensions,
    TextInput,
    Text,
    ScrollView,
    ImageBackground,
    Button,
    Image,
    ActivityIndicator,
    StyleSheet
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useSelector, useDispatch } from "react-redux";
import * as TimeTableAction from '../src/Action/TimeTable.Action'
import Icon from 'react-native-vector-icons/Ionicons'
import axios from "axios";
const { width, height } = Dimensions.get('window')
import moment from 'moment';
var momentTimezone = require('moment-timezone');
let timeZoneThailand = momentTimezone.tz('Asia/Bangkok')//.format('HH:mm a')


const TimeTable = () => {
    const timeSetup = moment.utc(new Date().getTime())
    const heightRef = useRef()
    const TimeTable_reducer = useSelector(({ FetchTimeTableReducer }) => FetchTimeTableReducer)
    const dispatch = useDispatch()
    const [heightView, setHeightView] = useState()
    const [initialTime, setinitialTime] = useState()
    const [contentHeight, setContentHeight] = useState()
    const [backgroundFinal, setbackgroundFinal] = useState('#F7ADAD')
    const [backgroundColorState, setBackgroundColor] = useState({
        final: '#F7ADAD', //'#F7ADAD': item.note==='Checkin' ?'#90EC92'
        checkin: '#90EC92',
        takeoff: '#F97575'
    })
    const [timeZone, setTimeZone] = useState({
        hour: timeZoneThailand.format('HH'),
        minutes: timeZoneThailand.format('mm'),
        type: timeZoneThailand.format('a')
    })

    const [showBlink, setShowBlimk] = useState(true);
    const [timeTableState, setTimeTableState] = useState([])
    const [timeTableProcress, settimeTableProcress] = useState([])
    const [testData, setTestdata] = useState({
        Test: [
            { id: 1, name: 'test 1' }
        ]
    })


    function hhmmss(secs) {
        var minutes = Math.floor(secs / 60);
        secs = secs % 60;
        var hours = Math.floor(minutes / 60)
        minutes = minutes % 60;
        return `${pad(hours)}:${pad(minutes)}`;
        // return pad(hours)+":"+pad(minutes)+":"+pad(secs); for old browsers
    }
    function pad(num) {
        return ("0" + num).slice(-2);
    }

    function FinalProcress(TimeTablePackage) {
        let timeCurrent = momentTimezone.tz('Asia/Bangkok').format('HH:mm')
        TimeTablePackage.map(async (item, index) => {
            let DepTime = item.Departure
            let timeCurrentSeccond = (timeCurrent.split(':')[0] * 3600) + (timeCurrent.split(':')[1] * 60)
            let DepTimeSeccond = (DepTime.split('.')[0] * 3600) + (DepTime.split('.')[1] * 60)
            // console.log(hhmmss((DepTimeSeccond)-(timeCurrentSeccond)))

            if (parseInt(hhmmss((DepTimeSeccond) - (timeCurrentSeccond)).split(':')[0]) === 0 &&
                parseInt(hhmmss((DepTimeSeccond) - (timeCurrentSeccond)).split(':')[1]) <= 30) {
                item.Note = 'Final'
            }
            else {
                null
            }
        })

        return TimeTablePackage

    }

    async function SortFinal(TimeTables) {
        let Arrayfinal = []
        let ArrayNormally = []
        for (var i = 0; i < TimeTables.length; i++) {
            if (TimeTables[i].Note === 'Final') {
                Arrayfinal.push(TimeTables[i])
            }
            else {
                ArrayNormally.push(TimeTables[i])
            }
        }
        ArrayNormally.map((item) => {
            Arrayfinal.push(item)
        })
        return ArrayNormally
    }


    const CalculateOrProcressTime = (TimeTablePackage) => {
        let timeCurrent = momentTimezone.tz('Asia/Bangkok').format('HH:mm')
        let Arrayfinal = []
        let ArrayNormally = []

        TimeTablePackage.map((item, index) => {
            try {
                let DepTime = item.departure
                let timeCurrentSeccond = (timeCurrent.split(':')[0] * 3600) + (timeCurrent.split(':')[1] * 60) // Change current time to milliseccond
                let DepTimeSeccond = (DepTime.split(':')[0] * 3600) + (DepTime.split(':')[1] * 60) //Change Departure time to milliseccond

                console.log(hhmmss((DepTimeSeccond) - (timeCurrentSeccond))) //hhmmss function would be change milliseccond to HH:mm format
                if (parseInt(hhmmss((DepTimeSeccond) - (timeCurrentSeccond)).split(':')[0]) < 0 || //Over difine time
                    parseInt(hhmmss((DepTimeSeccond) - (timeCurrentSeccond)).split(':')[1]) < 0) {
                    item.note = 'Take off'
                }

                if (parseInt(hhmmss((DepTimeSeccond) - (timeCurrentSeccond)).split(':')[0]) === 0 && // Procress time less than 30 minutes => Final Calling
                    parseInt(hhmmss((DepTimeSeccond) - (timeCurrentSeccond)).split(':')[1]) <= 30) {
                    item.note = 'Final'
                }
                else if (parseInt(hhmmss((DepTimeSeccond) - (timeCurrentSeccond)).split(':')[0]) === 0 && // Procress time less than or equal 60 => Chanking
                    parseInt(hhmmss((DepTimeSeccond) - (timeCurrentSeccond)).split(':')[1]) <= 60) {
                    item.note = 'Checkin'

                }
                else if (parseInt(hhmmss((DepTimeSeccond) - (timeCurrentSeccond)).split(':')[0]) > 0 ||  // Procress time > than defined activity time   
                    parseInt(hhmmss((DepTimeSeccond) - (timeCurrentSeccond)).split(':')[1]) >= 60) {
                    item.note = 'Arrival'

                }
                else {
                    null
                }
            }
            catch(error){
                console.error(error)
            }
            
        })
        // for(var i=0; i < TimeTablePackage.length; i++ ){
        //     if(TimeTablePackage[i].Note === 'Final'){
        //         Arrayfinal.push(TimeTablePackage[i])
        //     }
        //     else{
        //         ArrayNormally.push(TimeTablePackage[i])
        //     }
        // }

        // ArrayNormally.map((item)=>{
        //      Arrayfinal.push(item)
        // })
        //setTimeTableState(Arrayfinal)
        //dispatch(TimeTableAction.FetchTimeFun(TimeTablePackage))
        // console.log(Arrayfinal.length+' '+ArrayNormally.length)
        //dispatch(TimeTableAction.FetchTimeFun(Arrayfinal))
        return TimeTablePackage
    }


    useEffect(() => {
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
    }, [])


    // useEffect(() => {
    //     // Change the state every second or the time given by User.
    //     const interval = setInterval(() => {
    //         setShowBlimk((showBlink) => !showBlink);
    //     }, 1000);
    //     return () => clearInterval(interval);
    // }, []);

    useEffect(() => {
        axios({
            method: 'GET',
            url: 'http://192.168.1.129/yakko-platform/pier/api/timetable',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }

        })
            .then((response) => {
                setTimeTableState(CalculateOrProcressTime(response.data))
            })
            .catch((error) => {
                console.log(error)
            })
        //Fetch Api Herer


        // dispatch(FetchAction to TimeTable_reducer -> TimeTable)

    }, [])

    //Fetch Follw time 
    useEffect(() => {
        const FetchTime = setInterval(() => {
            console.log('Fetch Workig')
            axios({
                method: 'GET',
                url: 'http://192.168.1.129/yakko-platform/pier/api/timetable',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }

            })
                .then((response) => {
                    setTimeTableState(CalculateOrProcressTime(response.data))
                })
                .catch((error) => {
                    console.log(error)
                })
        }, 50000)
        return () => clearInterval(FetchTime)
    })


    useEffect(() => {
        console.log(timeTableState.length)
        if (timeTableState.length > 0) {
            const TimeProcress = setInterval(() => {
                CalculateOrProcressTime(timeTableState)
            }, 60000)
            return () => clearInterval(TimeProcress)
        }
    }, [timeTableState])

    // useEffect(()=>{
    //     if(TimeTable_reducer.TimeTable.length > 0){
    //         setTimeTableState(TimeTable_reducer.TimeTable)
    //     }
    // })

    //initiall 
    // useEffect(() => {
    //     console.log('HELL')
    //     setTimeTableState(TimeTable_reducer.TimeTable)

    //     //console.log(TimeTable_reducer.TimeTable)
    // }, [])

    // useEffect(()=>{
    //     if(timeTableState.length > 0 ){
    //        setInterval(()=>{
    //             CalculateOrProcressTime(timeTableState)
    //        },10000)

    //     }
    // },[timeTableState])

    // useEffect(()=>{
    //     setInterval(()=>{

    //     })
    // },[])
    useEffect(() => {
        if (backgroundFinal === '#F7ADAD' || backgroundFinal === 'white') {
            const timeoutID = setTimeout(() => {
                setbackgroundFinal(backgroundFinal === '#F7ADAD' ? 'white' : '#F7ADAD');
            }, 500);
            return () => clearTimeout(timeoutID);
        }
    });



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
                    style={style.header_canvas} >
                    <View style={[style.Logo_canvas]}>
                        {/* Logo Here */}
                    </View>
                    <View style={[style.TimeTable_Label_canvas, style.set_center]}>
                        <Text style={style.font_header_style}>
                            ตารางเวลาเรือ
                        </Text>
                        <Text style={style.font_header_behide_style} >
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
                            {/* <Text style={style.font_time} > {`${timeZone.hour}:${timeZone.minutes} ${timeZone.type}`} </Text> */}
                            {/* {
                                showBlink ? null : <Icon name={'time'} />
                            } */}
                        </View>

                    </View>
                </View>

                {/* Content */}

                {/* Header Content */}
                <View style={style.header_content_canvas} >
                    <View style={[style.set_center, style.color_border_box, { flex: 0.15 }]}>
                        <Text style={[style.font_header_content_style, style.font_color_header]}>
                            บริษัทเรือ
                        </Text>
                        <Text style={[style.font_header_content_style, style.font_color_header_below]}>
                            (Company)
                        </Text>
                    </View>
                    <View style={[style.set_center, style.color_border_box, { flex: 0.15 }]}>
                        <Text style={[style.font_header_content_style, style.font_color_header]}>
                            ชื่อเรือ
                        </Text>
                        <Text style={[style.font_header_content_style, style.font_color_header_below]}>
                            (ฺBoat name)
                        </Text>
                    </View>
                    <View style={[style.set_center, style.color_border_box, { flex: 0.22 }]}>
                        <Text style={[style.font_header_content_style, style.font_color_header]}>
                            จุดหมายปลายทาง
                        </Text>
                        <Text style={[style.font_header_content_style, style.font_color_header_below]}>
                            (Destination)
                        </Text>
                    </View>
                    <View style={[style.set_center, style.color_border_box, { flex: 0.12 }]}>
                        <Text style={[style.font_header_content_style, style.font_color_header]}>
                            ขาออก
                        </Text>
                        <Text style={[style.font_header_content_style, style.font_color_header_below]}>
                            (Departure)
                        </Text>
                    </View>
                    <View style={[style.set_center, style.color_border_box, { flex: 0.12 }]}>
                        <Text style={[style.font_header_content_style, style.font_color_header]}>
                            ขาเข้า
                        </Text>
                        <Text style={[style.font_header_content_style, style.font_color_header_below]}>
                            (Arrival)
                        </Text>
                    </View>
                    <View style={[style.set_center, style.color_border_box, { flex: 0.1 }]}>
                        <Text style={[style.font_header_content_style, style.font_color_header]}>
                            ประตู
                        </Text>
                        <Text style={[style.font_header_content_style, style.font_color_header_below]}>
                            (Gate)
                        </Text>
                    </View>
                    <View style={[style.set_center, { flex: 0.14 }]}>
                        <Text style={[style.font_header_content_style, style.font_color_header]}>
                            หมายเหตุ
                        </Text>
                        <Text style={[style.font_header_content_style, style.font_color_header_below]}>
                            (Note)
                        </Text>
                    </View>
                </View>

                {/* Body row Content */}
                {
                    timeTableState.length > 0 ?
                        timeTableState.map((item, index) => {
                            return (
                                <View key={index}
                                    style={[style.row_canvas,
                                    {
                                        backgroundColor: index % 2 == 0 ?
                                            item.note === 'Final' ? backgroundFinal : item.note === 'Checkin' ?
                                                backgroundColorState.checkin : item.note === 'Take off' ? backgroundColorState.takeoff : '#ffffff'
                                            : item.note === 'Final' ?
                                                backgroundFinal : item.note === 'Checkin' ? backgroundColorState.checkin : item.note === 'Take off' ? backgroundColorState.takeoff : '#ffffff'
                                    }]}>
                                    <View style={[style.set_center, style.color_border_content_box, { flex: 0.15 }]}>
                                        <Text style={style.font_content_style}>
                                            {item.company}
                                        </Text>
                                    </View>
                                    <View style={[style.set_center, style.color_border_content_box, { flex: 0.15 }]}>
                                        <Text style={style.font_content_style}>
                                            {item.name_ship}
                                        </Text>
                                    </View>
                                    <View style={[style.set_center, style.color_border_content_box, { flex: 0.22 }]}>
                                        <Text style={style.font_content_style}>
                                            {item.destination}
                                        </Text>
                                    </View>
                                    <View style={[style.set_center, style.color_border_content_box, { flex: 0.12 }]}>
                                        <Text style={style.font_content_style}>
                                            {item.departure}
                                        </Text>
                                    </View>
                                    <View style={[style.set_center, style.color_border_content_box, { flex: 0.12 }]}>
                                        <Text style={style.font_content_style}>
                                            {item.arrival}
                                        </Text>
                                    </View>
                                    <View style={[style.set_center, style.color_border_content_box, { flex: 0.1 }]}>
                                        <Text style={style.font_content_style}>
                                            {item.gate}
                                        </Text>
                                    </View>
                                    <View style={[style.set_center,  { flex: 0.14 }]}>
                                        <Text style={style.font_content_style}>
                                            {item.note === 'Final' ? 'Final Call' : item.note}
                                        </Text>
                                    </View>
                                </View>
                            )

                        })
                        :
                        <View style={[style.set_center, { flex: 1 }]}>
                            <ActivityIndicator color={'red'} size={'small'} />
                        </View>


                }


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
    row_canvas_final: {
        width: '100%',
        height: height * 0.05,
        backgroundColor: 'red',
        borderBottomWidth: 0.6,
        flexDirection: 'row'
    },
    row_canvas: {
        width: '100%',
        height: height * 0.05,
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
        flex: 0.65,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    Current_date_time_canvas: {
        flex: 0.15,
        justifyContent: 'flex-end',
        paddingBottom: '1%'
    },
    font_color_header: {
        color: 'white',
    },
    font_color_header_below: {
        color: '#c3933a',
    },
    font_header_content_style: {
        fontSize: RFPercentage(1.35),
        fontFamily: 'Kanit-Regular'
    },
    font_time: {
        fontSize: RFPercentage(1.35),
        fontFamily: 'Kanit-SemiBold'
    },
    font_content_style: {
        fontSize: RFPercentage(1.2),
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
    set_center: {
        alignItems: 'center',
        justifyContent: 'center',
    }
})