'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface AuthDialogProps {
  isOpen: boolean
  onAuthenticated: (teamName: string) => void
}

const SECRET_PASSWORD = 'IAMASTERLAB'

export default function AuthDialog({ isOpen, onAuthenticated }: AuthDialogProps) {
  const [teamName, setTeamName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Configuração de desenvolvimento - ler variáveis de ambiente
  const requirePassword = process.env.NEXT_PUBLIC_REQUIRE_TEAM_PASSWORD !== 'false'
  const defaultPassword = process.env.NEXT_PUBLIC_TEAM_PASSWORD || SECRET_PASSWORD

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validar se o nome da equipe foi preenchido
    if (!teamName.trim()) {
      setError('Por favor, digite o nome da sua equipe.')
      setIsLoading(false)
      return
    }

    // Simular um pequeno delay para UX
    await new Promise(resolve => setTimeout(resolve, 500))

    // Usar senha padrão se não for requerida, senão validar entrada
    const passwordToValidate = requirePassword ? password.trim().toUpperCase() : defaultPassword
    
    if (passwordToValidate === SECRET_PASSWORD) {
      // Salvar no localStorage
      localStorage.setItem('iamasterlab-authenticated', 'true')
      onAuthenticated(teamName.trim())
    } else {
      setError('Senha incorreta. Tente novamente.')
      setPassword('')
    }
    
    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as React.FormEvent)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            🔐 Acesso Restrito
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            {requirePassword 
              ? 'Digite o nome da sua equipe e a senha secreta do evento'
              : 'Digite o nome da sua equipe (modo desenvolvimento)'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Nome da Equipe"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="text-center text-lg h-12"
              disabled={isLoading}
              autoFocus
            />
          </div>
          
          {requirePassword && (
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Digite a senha..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-center text-lg h-12"
                disabled={isLoading}
              />
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
            </div>
          )}
          
          {!requirePassword && (
            <div className="text-center text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
              <p>💡 Modo desenvolvimento: senha não requerida</p>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full h-12 text-lg"
            disabled={isLoading || !teamName.trim() || (requirePassword && !password.trim())}
          >
            {isLoading ? '🔍 Verificando...' : '🚀 Entrar'}
          </Button>
        </form>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>💡 Dica: A senha foi compartilhada no evento</p>
        </div>
      </DialogContent>
    </Dialog>
  )
} 