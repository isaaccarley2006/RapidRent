import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Shield, MessageCircle } from 'lucide-react'
import { useUser } from '@/lib/auth/useUser'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface CommunityProfile {
  id: string
  user_id: string
  headline: string
  bio: string | null
  nationality?: string
  identity_verified?: boolean
}

interface ConnectDialogProps {
  isOpen: boolean
  onClose: () => void
  targetProfile: CommunityProfile
}

const getNationalityFlag = (nationality: string | undefined) => {
  const flags: { [key: string]: string } = {
    'Spanish': '🇪🇸',
    'French': '🇫🇷', 
    'German': '🇩🇪',
    'British': '🇬🇧',
    'Italian': '🇮🇹',
    'Portuguese': '🇵🇹',
    'Dutch': '🇳🇱',
    'Polish': '🇵🇱',
  }
  return flags[nationality || ''] || '🌍'
}

export const ConnectDialog: React.FC<ConnectDialogProps> = ({
  isOpen,
  onClose,
  targetProfile,
}) => {
  const { user } = useUser()
  const { toast } = useToast()
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleConnect = async () => {
    if (!user?.id || !message.trim()) return

    setLoading(true)
    try {
      // Check if connection already exists
      const { data: existingConnection } = await supabase
        .from('community_connections')
        .select('id')
        .or(`and(requester_id.eq.${user.id},target_id.eq.${targetProfile.user_id}),and(requester_id.eq.${targetProfile.user_id},target_id.eq.${user.id})`)
        .single()

      if (existingConnection) {
        toast({
          title: 'Connection already exists',
          description: 'You have already sent a connection request to this person.',
          variant: 'destructive',
        })
        onClose()
        return
      }

      // Create new connection request
      const { error } = await supabase
        .from('community_connections')
        .insert({
          requester_id: user.id,
          target_id: targetProfile.user_id,
          message: message.trim(),
          status: 'pending'
        })

      if (error) throw error

      toast({
        title: 'Connection request sent!',
        description: 'Your message has been sent. They will be notified of your interest.',
      })

      onClose()
      setMessage('')
    } catch (error: any) {
      console.error('Error sending connection request:', error)
      toast({
        title: 'Error sending request',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Connect with Housemate
          </DialogTitle>
          <DialogDescription>
            Send a message to introduce yourself and express your interest in connecting.
          </DialogDescription>
        </DialogHeader>

        {/* Target Profile Preview */}
        <div className="py-4 border-y border-border">
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {getNationalityFlag(targetProfile.nationality)}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  {targetProfile.nationality || 'Global'}
                </span>
                {targetProfile.identity_verified && (
                  <Badge variant="secondary" className="w-fit text-xs gap-1">
                    <Shield className="h-3 w-3" />
                    Verified ID
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-3">
            <h4 className="font-medium text-foreground line-clamp-1">
              {targetProfile.headline}
            </h4>
            {targetProfile.bio && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {targetProfile.bio}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="message" className="text-sm font-medium">
              Your Message *
            </Label>
            <Textarea
              id="message"
              placeholder="Hi! I saw your profile and think we'd be great housemates. I'm also looking for a place in the same area. Would love to chat more about potentially sharing a flat..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Introduce yourself and explain why you'd be a good match.
            </p>
          </div>

          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Privacy Notice:</strong> Only your nationality and ID verification status 
              will be visible to them initially. Full contact details are exchanged after mutual interest.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConnect}
            disabled={loading || !message.trim()}
          >
            {loading ? 'Sending...' : 'Send Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}