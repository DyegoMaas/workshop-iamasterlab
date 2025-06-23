'use client'

import { useState, useEffect } from 'react'

const AUTH_KEY = 'iamasterlab-authenticated'
const TEAM_NAME_KEY = 'iamasterlab-team-name'

// Lista de nomes de equipe que são instrutores
const INSTRUCTOR_TEAMS = ['instrutor', 'instructor', 'admin', 'equipe instrutor', 'strass', 'staff']

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [teamName, setTeamName] = useState('')

  useEffect(() => {
    // Verificar se já está autenticado no localStorage
    const authStatus = localStorage.getItem(AUTH_KEY)
    const savedTeamName = localStorage.getItem(TEAM_NAME_KEY)
    
    setIsAuthenticated(authStatus === 'true')
    setTeamName(savedTeamName || '')
    setIsLoading(false)
  }, [])

  const authenticate = (teamNameParam?: string) => {
    setIsAuthenticated(true)
    if (teamNameParam) {
      setTeamName(teamNameParam)
      localStorage.setItem(TEAM_NAME_KEY, teamNameParam)
    }
  }

  const logout = () => {
    localStorage.removeItem(AUTH_KEY)
    localStorage.removeItem(TEAM_NAME_KEY)
    setIsAuthenticated(false)
    setTeamName('')
  }

  const isInstructor = () => {
    if (!teamName || !isAuthenticated) return false
    return INSTRUCTOR_TEAMS.includes(teamName.toLowerCase().trim())
  }

  return {
    isAuthenticated,
    isLoading,
    teamName,
    isInstructor,
    authenticate,
    logout
  }
} 