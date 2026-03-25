import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')

    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Failed to restore session:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
    }

    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      const response = await fetch(
        "https://nonpositivistic-unmesmerised-sharyn.ngrok-free.dev/api/tasks/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Login failed')
      }

      const data = await response.json()

      setToken(data.token)
      setUser(data.user)

      // Persist to localStorage
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('auth_user', JSON.stringify(data.user))

      // Redirect to home
      navigate('/')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (username, password, email) => {
    try {
      const response = await fetch(
        "https://nonpositivistic-unmesmerised-sharyn.ngrok-free.dev/api/tasks/add-user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Registration failed')
      }

      const data = await response.json()

      setToken(data.token)
      setUser(data.user)

      // Persist to localStorage
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('auth_user', JSON.stringify(data.user))

      // Redirect to home
      navigate('/')
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
