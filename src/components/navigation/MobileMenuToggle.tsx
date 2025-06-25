
import React from 'react'
import { Menu, X } from 'lucide-react'

interface MobileMenuToggleProps {
  isOpen: boolean
  onToggle: () => void
}

export const MobileMenuToggle: React.FC<MobileMenuToggleProps> = ({ isOpen, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="md:hidden p-2 text-text-primary hover:text-primary transition-colors"
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  )
}
