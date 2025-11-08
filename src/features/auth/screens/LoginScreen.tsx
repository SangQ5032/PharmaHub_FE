/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable handle-callback-err */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type {
  RootStackParamList,
  AuthStackParamList,
} from '@shared/types/navigation';
import { useLogin } from '@features/auth/hooks/useLogin';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isPending } = useLogin();

  type NavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<AuthStackParamList>,
    NativeStackNavigationProp<RootStackParamList>
  >;
  const navigation = useNavigation<NavigationProp>();

  const handleLogin = () => {
    if (!email || !password) {
      ToastAndroid.show('Vui lòng nhập đầy đủ', ToastAndroid.SHORT);
      return;
    }

    login(
      { email, password },
      {
        onSuccess: () => {
          // Navigate to MainApp (RootStack level) sau khi đăng nhập thành công
          navigation.getParent()?.reset({
            index: 0,
            routes: [{ name: 'MainApp' as keyof RootStackParamList }],
          });
        },

        onError: (err: any) => {
          ToastAndroid.show('Đăng nhập thất bại', ToastAndroid.SHORT);
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {isPending ? (
        <ActivityIndicator />
      ) : (
        <Button title="Đăng nhập" onPress={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
  },
});
