import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from '../../shared/constants/routes';
import LoginScreen from '../../features/auth/screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
return (
<NavigationContainer>
<Stack.Navigator screenOptions={{headerShown: false}}>
<Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
</Stack.Navigator>
</NavigationContainer>
);
}