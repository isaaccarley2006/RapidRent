export const trackEvent = (event: string, data?: Record<string, any>) => {
  // Fire analytics events if env configured
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // Implementation depends on analytics provider
    console.log('Analytics Event:', event, data)
    // Add your analytics provider integration here
  }
}

export const analyticsEvents = {
  landlordInboxViewed: () => trackEvent('landlord_inbox_viewed'),
  offerStatusChanged: (offerId: string, oldStatus: string, newStatus: string) => 
    trackEvent('offer_status_changed', { offer_id: offerId, old_status: oldStatus, new_status: newStatus }),
  offerCompared: (offerIds: string[]) => 
    trackEvent('offer_compared', { offer_ids: offerIds })
}