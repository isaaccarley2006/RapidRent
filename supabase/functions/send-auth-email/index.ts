import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

interface AuthHookPayload {
  user: {
    email: string
  }
  email_data: {
    token: string
    token_hash: string
    redirect_to: string
    email_action_type: string
    site_url: string
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const payload: AuthHookPayload = await req.json()
    console.log("Received auth hook payload:", JSON.stringify(payload, null, 2))
    
    const { user, email_data } = payload
    const to = user.email
    const token = email_data.token
    const type = email_data.email_action_type as 'signup' | 'recovery' | 'email_change'

    let subject = ""
    let html = ""

    switch (type) {
      case 'signup':
        subject = "Verify your email - RentView"
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; text-align: center;">Welcome to RentView!</h1>
            <p style="color: #666; font-size: 16px;">Thank you for signing up. Please use the verification code below to complete your registration:</p>
            
            <div style="background-color: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h2 style="color: #333; font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 0;">${token}</h2>
            </div>
            
            <p style="color: #666; font-size: 14px;">This code will expire in 60 seconds.</p>
            <p style="color: #666; font-size: 14px;">If you didn't request this verification, you can safely ignore this email.</p>
            
            <hr style="border: none; border-top: 1px solid #e9ecef; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              This email was sent by RentView. If you have any questions, please contact our support team.
            </p>
          </div>
        `
        break
        
      case 'recovery':
        subject = "Reset your password - RentView"
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; text-align: center;">Password Reset</h1>
            <p style="color: #666; font-size: 16px;">You requested to reset your password. Please use the verification code below:</p>
            
            <div style="background-color: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h2 style="color: #333; font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 0;">${token}</h2>
            </div>
            
            <p style="color: #666; font-size: 14px;">This code will expire in 60 seconds.</p>
            <p style="color: #666; font-size: 14px;">If you didn't request this password reset, you can safely ignore this email.</p>
          </div>
        `
        break
        
      default:
        throw new Error(`Unsupported email type: ${type}`)
    }

    const emailResponse = await resend.emails.send({
      from: "RentView <onboarding@resend.dev>", // Use this for testing, replace with your verified domain later
      to: [to],
      subject,
      html,
    })

    console.log("Auth email sent successfully:", emailResponse)

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    })
  } catch (error: any) {
    console.error("Error in send-auth-email function:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    )
  }
}

serve(handler)