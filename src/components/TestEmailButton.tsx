import React from 'react'
import { Button } from '@/components/ui/button'
import { testResendEmail } from '@/utils/testEmailFunction'
import { toast } from 'sonner'

export const TestEmailButton: React.FC = () => {
  const handleTestEmail = async () => {
    try {
      toast.info('Sending test email...')
      const result = await testResendEmail('isaaccarley1@gmail.com')
      
      if (result.success) {
        toast.success('Test email sent successfully! Check your inbox.')
      } else {
        toast.error(`Test email failed: ${result.error}`)
      }
    } catch (error) {
      toast.error(`Error: ${error}`)
    }
  }

  return (
    <Button onClick={handleTestEmail} variant="outline">
      Test Email Function
    </Button>
  )
}