'use client'

import { useState, useEffect } from 'react'

const AUTH_KEY = 'iamasterlab-authenticated'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se já está autenticado no localStorage
    const authStatus = localStorage.getItem(AUTH_KEY)
    setIsAuthenticated(authStatus === 'true')
    setIsLoading(false)
  }, [])

  const authenticate = () => {
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem(AUTH_KEY)
    setIsAuthenticated(false)
  }

  return {
    isAuthenticated,
    isLoading,
    authenticate,
    logout
  }
} 