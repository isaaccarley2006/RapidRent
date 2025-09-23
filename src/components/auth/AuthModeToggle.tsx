import React from 'react'

interface AuthModeToggleProps {
  mode: 'signin' | 'signup'
  onToggle: () => void
}

export const AuthModeToggle: React.FC<AuthModeToggleProps> = ({ mode, onToggle }) => {
  return (
    <div className="flex bg-muted rounded-lg p-1 mb-8">
      <button
        type="button"
        onClick={() => mode === 'signup' && onToggle()}
        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
          mode === 'signin'
            ? 'bg-background text-text-primary shadow-sm'
            : 'text-text-muted hover:text-text-primary'
        }`}
      >
        Sign In
      </button>
      <button
        type="button"
        onClick={() => mode === 'signin' && onToggle()}
        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
          mode === 'signup'
            ? 'bg-background text-text-primary shadow-sm'
            : 'text-text-muted hover:text-text-primary'
        }`}
      >
        Sign Up
      </button>
    </div>
  )
}