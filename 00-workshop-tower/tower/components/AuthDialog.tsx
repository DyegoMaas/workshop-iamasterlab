'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface AuthDialogProps {
  isOpen: boolean
  onAuthenticated: () => void
}

const SECRET_PASSWORD = 'IAMASTERLAB'

export default function AuthDialog({ isOpen, onAuthenticated }: AuthDialogProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simular um pequeno delay para UX
    await new Promise(resolve => setTimeout(resolve, 500))

    if (password.trim().toUpperCase() === SECRET_PASSWORD) {
      // Salvar no localStorage
      localStorage.setItem('iamasterlab-authenticated', 'true')
      onAuthenticated()
    } else {
      setError('Senha incorreta. Tente novamente.')
      setPassword('')
    }
    
    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any)
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
            Digite a senha secreta do evento para continuar
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Digite a senha..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-center text-lg h-12"
              disabled={isLoading}
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 text-lg"
            disabled={isLoading || !password.trim()}
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