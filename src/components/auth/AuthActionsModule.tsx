import React from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { OAuthButtons } from '@/components/auth/OAuthButtons'
import { TrustMarkers } from '@/components/auth/TrustMarkers'

interface AuthActionsModuleProps {
  mode: 'signin' | 'signup'
  loading: boolean
  onToggleMode: () => void
}

export const AuthActionsModule: React.FC<AuthActionsModuleProps> = ({ mode, loading, onToggleMode }) => {
  return (
    <div className="space-y-6">
      <Button 
        type="submit" 
        className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg"
        disabled={loading}
      >
        {loading 
          ? (mode === 'signin' ? 'Signing in...' : 'Creating account...') 
          : (mode === 'signin' ? 'Sign In' : 'Create my account')
        }
      </Button>

      <Separator className="bg-muted" />
      
      <OAuthButtons />

      {mode === 'signup' && <TrustMarkers />}

      <div className="text-center pt-4">
        <button
          type="button"
          onClick={onToggleMode}
          className="text-text-muted hover:text-text-primary font-medium transition-colors"
        >
          {mode === 'signin' 
            ? "Don't have an account? Sign up" 
            : "Already have an account? Sign in"
          }
        </button>
      </div>
    </div>
  )
}