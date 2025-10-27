// src/features/auth/hooks/useLogin.ts
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { authApi } from '../api/authApi'
import { setTokens } from '../slice/authSlice'

export function useLogin() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const res = await authApi.login({ email, password })
      const tokens = res.data.data
      dispatch(setTokens(tokens))
      return tokens
    } catch (e: any) {
      setError(e?.message || 'Login failed')
      throw e
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error }
}
