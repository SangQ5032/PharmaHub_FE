import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '@features/auth/screens/LoginScreen';
import { ROUTES } from '@shared/constants/routes';
import { QueryProvider } from '@app/providers';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <QueryProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryProvider>
  );
}
