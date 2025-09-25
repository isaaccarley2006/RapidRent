
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Auth: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to tenant auth as default
    navigate('/auth/tenant', { replace: true })
  }, [navigate])

  return null
}

export default Auth
