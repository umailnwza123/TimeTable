import React from "react";
import {View, Text, StyleSheet,  Dimensions} from 'react-native'
import * as Animatable from 'react-native-animatable';
import { color } from "react-native-elements/dist/helpers";
import { RFPercentage } from "react-native-responsive-fontsize";

const {height, width} = Dimensions.get('window')

const PopupMsg = ({msg})=>{
    return(
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} >
            <Animatable.View 
            animation={'bounceIn'}
            style={{height: height*0.22 , width: width*0.3, 
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white', borderRadius: 8}} >
                <Text style={style.fontStyle} >
                   {msg}
                </Text>
            </Animatable.View>
        </View>
    )
}
export default PopupMsg;

const style = StyleSheet.create({
    fontStyle:{
        fontFamily: 'Kanit-SemiBold',
        fontSize: RFPercentage(1.8),
        color: '#6B6B6B'
        
    }
})
