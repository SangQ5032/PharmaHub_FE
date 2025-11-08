/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable no-undef */
// src/features/auth/screens/PhoneLoginScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { phoneAuthService } from '../services/phoneAuth.service';
import { useAuthStore } from '../stores/useAuthStore';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@shared/types/navigation';
import type { AuthStackParamList } from '@shared/types/navigation';

export default function PhoneLoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false); // Track xem đã gửi OTP chưa
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { setToken, setUser } = useAuthStore();
  type NavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<AuthStackParamList>,
    NativeStackNavigationProp<RootStackParamList>
  >;
  const navigation = useNavigation<NavigationProp>();

  // Test Reactotron khi component mount
  useEffect(() => {
    if (__DEV__ && console.tron) {
      console.tron.log('PhoneLoginScreen mounted');
      console.tron.display({
        name: 'Phone Login Screen',
        value: { phoneNumber, otpSent },
        important: true,
      });
    }
  }, []);

  // Đếm ngược để gửi lại OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return;
    }

    // Validate số điện thoại cơ bản
    const phoneRegex = /^[0-9]{9,11}$/;
    const cleanedPhone = phoneNumber.replace(/\s+/g, '').replace(/[()-]/g, '');

    if (!phoneRegex.test(cleanedPhone)) {
      Alert.alert(
        'Lỗi',
        'Số điện thoại không hợp lệ. Vui lòng nhập 9-11 chữ số',
      );
      return;
    }

    setLoading(true);
    try {
      const result = await phoneAuthService.sendOTP(phoneNumber);

      if (result.success) {
        setOtpSent(true);
        setCountdown(60); // Đếm ngược 60 giây
        Alert.alert(
          'Thành công',
          'Mã OTP đã được gửi đến số điện thoại của bạn',
        );
      } else {
        Alert.alert('Lỗi', result.error || 'Không thể gửi mã OTP');
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Đã xảy ra lỗi. Vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã OTP');
      return;
    }

    setVerifying(true);
    try {
      const result = await phoneAuthService.verifyOTP(phoneNumber, otp);

      if (result.success) {
        // Lưu token và user vào store
        if (result.accessToken) {
          await setToken(result.accessToken, result.refreshToken);
        }
        if (result.user) {
          setUser(result.user);
        }

        // Navigate to MainApp (RootStack level)
        // React Navigation sẽ tự động tìm route ở parent navigator
        navigation.getParent()?.reset({
          index: 0,
          routes: [{ name: 'MainApp' as keyof RootStackParamList }],
        });
      } else {
        Alert.alert('Lỗi', result.error || 'Mã OTP không đúng');
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Đã xảy ra lỗi. Vui lòng thử lại');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) {
      Alert.alert(
        'Thông báo',
        `Vui lòng đợi ${countdown} giây trước khi gửi lại`,
      );
      return;
    }
    await handleSendOTP();
  };

  const resetForm = () => {
    setPhoneNumber('');
    setOtp('');
    setOtpSent(false);
    setCountdown(0);
    phoneAuthService.resetSession();
  };

  const handleChangePhone = () => {
    resetForm();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Đăng nhập bằng số điện thoại</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại (VD: 0912345678)"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            editable={!otpSent}
            autoCapitalize="none"
          />
        </View>

        {!otpSent ? (
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSendOTP}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Gửi mã OTP</Text>
            )}
          </TouchableOpacity>
        ) : (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mã OTP</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập mã OTP (6 chữ số)"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, verifying && styles.buttonDisabled]}
              onPress={handleVerifyOTP}
              disabled={verifying}
            >
              {verifying ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Xác thực OTP</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendOTP}
              disabled={countdown > 0}
            >
              <Text style={styles.resendButtonText}>
                {countdown > 0
                  ? `Gửi lại mã OTP (${countdown}s)`
                  : 'Gửi lại mã OTP'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.changePhoneButton}
              onPress={handleChangePhone}
            >
              <Text style={styles.changePhoneButtonText}>
                Thay đổi số điện thoại
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  resendButtonText: {
    color: '#007AFF',
    fontSize: 14,
  },
  changePhoneButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  changePhoneButtonText: {
    color: '#666',
    fontSize: 14,
  },
});
