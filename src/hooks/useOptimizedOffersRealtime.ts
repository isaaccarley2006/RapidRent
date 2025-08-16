import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

interface UseOptimizedOffersRealtimeProps {
  userId: string | undefined
  propertyId?: string
  enabled?: boolean
}

export const useOptimizedOffersRealtime = ({ 
  userId, 
  propertyId, 
  enabled = true 
}: UseOptimizedOffersRealtimeProps) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!userId || !enabled) return

    let channel: any
    let refetchTimeout: NodeJS.Timeout

    const setupRealtimeSubscription = async () => {
      // Get cached property IDs or fetch them
      const propertiesQueryKey = ['properties', userId]
      let propertyIds: string[] = []

      const cachedProperties = queryClient.getQueryData(propertiesQueryKey)
      if (cachedProperties) {
        propertyIds = (cachedProperties as any[]).map(p => p.id)
      } else {
        const { data: properties } = await supabase
          .from('properties')
          .select('id')
          .eq('landlord_id', userId)

        if (properties && properties.length > 0) {
          propertyIds = properties.map(p => p.id)
          queryClient.setQueryData(propertiesQueryKey, properties)
        }
      }

      if (propertyIds.length === 0) return

      // Debounced invalidation to prevent rapid successive updates
      const debouncedInvalidate = () => {
        clearTimeout(refetchTimeout)
        refetchTimeout = setTimeout(() => {
          queryClient.invalidateQueries({ 
            queryKey: ['offers', userId],
            exact: false 
          })
        }, 300) // 300ms debounce
      }

      // Set up channel with connection pooling
      const channelName = propertyId 
        ? `offers-${propertyId}` 
        : `offers-landlord-${userId}`

      channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'offers',
            filter: propertyId 
              ? `property_id=eq.${propertyId}`
              : `property_id=in.(${propertyIds.join(',')})`
          },
          (payload) => {
            console.log('Offers real-time update:', payload)
            debouncedInvalidate()
          }
        )
        .subscribe((status) => {
          console.log('Offers subscription status:', status)
        })
    }

    setupRealtimeSubscription()

    return () => {
      clearTimeout(refetchTimeout)
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [userId, propertyId, enabled, queryClient])
}