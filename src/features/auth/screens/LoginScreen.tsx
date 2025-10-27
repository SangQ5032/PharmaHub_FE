/* eslint-disable react-native/no-inline-styles */
// src/features/auth/screens/LoginScreen.tsx
import React, { useState } from 'react'
import { View, TextInput, Button, Text } from 'react-native'
import { useLogin } from '../api/hooks/useLogin'

export default function LoginScreen() {
  const { login, loading, error } = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = () => {
    login(email, password).catch(() => {})
  }

  return (
    <View style={{ flex:1, justifyContent:'center', padding:16 }}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      {error && <Text>{error}</Text>}
      <Button title={loading ? '...' : 'Login'} onPress={onSubmit} />
    </View>
  )
}
