import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '@features/auth/screens/LoginScreen';
import PhoneLoginScreen from '@features/auth/screens/PhoneLoginScreen';
import { ROUTES } from '@shared/constants/routes';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={ROUTES.PHONE_LOGIN}
      >
        <Stack.Screen name={ROUTES.PHONE_LOGIN} component={PhoneLoginScreen} />
        <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
