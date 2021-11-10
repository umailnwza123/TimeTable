import React from "react";
import { View } from "react-native";
import TimeTable from "./TimeTable";
import IntroScreen from "./IntroScreen";
import VideoAd from "./VideoAd";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const MainScreen = ()=>{
    const Stack = createNativeStackNavigator()
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen  name={'Intro'}  options={{headerShown: false}} component={IntroScreen}   />
                <Stack.Screen name={'TimeTable'} options={{headerShown: false}} component={TimeTable} />
                <Stack.Screen name={'VideoAd'} options={{headerShown: false}} component={VideoAd} />
            </Stack.Navigator>
        </NavigationContainer>
    )
        
} 
export default MainScreen;