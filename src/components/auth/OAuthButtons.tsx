import React from 'react'
import { Button } from '@/components/ui/button'
import { Chrome, Apple } from 'lucide-react'

export const OAuthButtons: React.FC = () => {
  const handleGoogleSignUp = () => {
    // TODO: Implement Google OAuth
    console.log('Google sign up clicked')
  }

  const handleAppleSignUp = () => {
    // TODO: Implement Apple OAuth
    console.log('Apple sign up clicked')
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full h-12 border-muted hover:bg-muted/20 font-medium"
        onClick={handleGoogleSignUp}
      >
        <Chrome className="w-5 h-5 mr-3" />
        Sign up with Google
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full h-12 border-muted hover:bg-muted/20 font-medium"
        onClick={handleAppleSignUp}
      >
        <Apple className="w-5 h-5 mr-3" />
        Sign up with Apple
      </Button>
    </div>
  )
}