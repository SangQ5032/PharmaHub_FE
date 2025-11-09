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
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isPending } = useLogin();

  type NavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<AuthStackParamList>,
    NativeStackNavigationProp<RootStackParamList>
  >;
  const navigation = useNavigation<NavigationProp>();

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      ToastAndroid.show('Vui lòng nhập đầy đủ thông tin', ToastAndroid.SHORT);
      return;
    }

    login(
      { username: username.trim(), password },
      {
        onSuccess: async () => {
          // Đợi một chút để đảm bảo token đã được lưu vào AsyncStorage
          await new Promise(resolve => setTimeout(resolve, 200));

          // Verify token đã được lưu trước khi navigate
          const savedToken = await AsyncStorage.getItem('accessToken');

          if (savedToken) {
            console.log('✅ Token đã sẵn sàng, đang navigate...', {
              tokenLength: savedToken.length,
            });
            ToastAndroid.show('Đăng nhập thành công', ToastAndroid.SHORT);
            // Navigate to MainApp (RootStack level) sau khi đăng nhập thành công
            navigation.getParent()?.reset({
              index: 0,
              routes: [{ name: 'MainApp' as keyof RootStackParamList }],
            });
          } else {
            console.error('❌ Token chưa được lưu, không thể navigate');
            ToastAndroid.show('Lỗi: Token chưa được lưu', ToastAndroid.SHORT);
          }
        },

        onError: (err: any) => {
          const errorMessage =
            err?.response?.data?.message ||
            err?.message ||
            'Đăng nhập thất bại';
          ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
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
