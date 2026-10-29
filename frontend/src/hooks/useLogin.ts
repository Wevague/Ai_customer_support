import { useState } from 'react'
import { loginApi } from '../api/auth.api'

export function useLogin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function login(identifier: string, password: string) {
    setLoading(true)
    setError('')

    try {
      const result = await loginApi({ identifier, password })
      localStorage.setItem('accessToken', result.accessToken)
      return result
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Login failed'

      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error }
}