import { supabase } from '@/integrations/supabase/client'

export const testResendEmail = async (email: string) => {
  try {
    console.log('🧪 Testing Resend email function with email:', email)
    
    const { data, error } = await supabase.functions.invoke('send-auth-email', {
      body: {
        user: {
          email: email
        },
        email_data: {
          token: '123456',
          token_hash: 'test-hash',
          redirect_to: window.location.origin,
          email_action_type: 'signup',
          site_url: window.location.origin
        }
      }
    })

    console.log('📧 Function response:', { data, error })

    if (error) {
      console.error('❌ Function error:', error)
      throw error
    }

    console.log('✅ Email function called successfully')
    return { success: true, data }
  } catch (error) {
    console.error('💥 Test email error:', error)
    return { success: false, error }
  }
}