/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {TouchableOpacity, Text, GestureResponderEvent} from 'react-native';


type Props = {
title: string;
onPress?: (e: GestureResponderEvent) => void;
};


export default function Button({title, onPress}: Props) {
return (
<TouchableOpacity onPress={onPress} style={{padding:12, backgroundColor:'#6200EE', borderRadius:8}}>
<Text style={{color:'#fff', textAlign:'center'}}>{title}</Text>
</TouchableOpacity>
);
}