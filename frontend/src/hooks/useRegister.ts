
import { useState } from 'react'
import { registerApi } from '../api/auth.api'

export function useRegister() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function register(data: {
    fullName: string
    email?: string
    phone?: string
    password: string
  }) {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await registerApi(data)
      setSuccess(result.message || 'Registration successful')
      return result
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Registration failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { register, loading, error, success }
}
