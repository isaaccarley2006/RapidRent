import { useUser } from '@/lib/auth/useUser'

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
  }
}

export const track = (event: string, payload?: Record<string, unknown>): void => {
  try {
    if (import.meta.env.VITE_ANALYTICS_ENABLED !== 'true') {
      return // No-op when analytics is disabled
    }

    const enrichedPayload = {
      ...payload,
      timestamp: new Date().toISOString()
    }

    // Initialize dataLayer if it doesn't exist
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event,
        ...enrichedPayload
      })
      
      // Also log to console in development
      if (import.meta.env.DEV) {
        console.info('Analytics Event:', event, enrichedPayload)
      }
    }
  } catch (error) {
    // Silently fail to avoid breaking UI
    console.warn('Analytics tracking failed:', error)
  }
}

export const withUserContext = (basePayload: Record<string, unknown> = {}) => {
  // This is a higher-order function that will be called from components
  // where useUser is available in the component context
  return (getUserContext?: () => { user_id?: string; role?: string }) => {
    const userContext = getUserContext ? getUserContext() : {}
    return {
      ...basePayload,
      ...userContext
    }
  }
}

// Legacy events for backward compatibility
export const analyticsEvents = {
  landlordInboxViewed: () => track('landlord_inbox_viewed'),
  offerStatusChanged: (offerId: string, oldStatus: string, newStatus: string) => 
    track('offer_status_changed', { offer_id: offerId, old_status: oldStatus, new_status: newStatus }),
  offerCompared: (offerIds: string[]) => 
    track('offer_compared', { offer_ids: offerIds })
}