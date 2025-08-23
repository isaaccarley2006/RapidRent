
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, Home, Clock, CheckCircle, Star } from 'lucide-react'

interface Offer {
  id: string
  property_id: string
  offer_price: number
  status: string
  message: string | null
  created_at: string
  properties: {
    title: string
    location: string | null
    price: number | null
  }
}

export const TenantDashboard: React.FC = () => {
  const { user } = useAuth()
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOffers = async () => {
      if (!user) return
      
      try {
        const { data, error } = await supabase
          .from('offers')
          .select(`
            *,
            properties (
              title,
              location,
              price
            )
          `)
          .eq('tenant_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setOffers(data || [])
      } catch (error) {
        console.error('Error fetching offers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [user])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-green-600 bg-green-50'
      case 'shortlisted': return 'text-yellow-600 bg-yellow-50'
      case 'pending': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4" />
      case 'shortlisted': return <Star className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border border-gray-200 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Offers</p>
                <p className="text-2xl font-semibold text-gray-900">{offers.length}</p>
              </div>
              <Home className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {offers.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {offers.filter(o => o.status === 'accepted').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Offers */}
      <Card className="bg-white border border-gray-200 rounded-xl">
        <CardHeader>
          <CardTitle>Your Offers</CardTitle>
          <CardDescription>
            Track the status of your rental applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {offers.length === 0 ? (
            <div className="text-center py-8">
              <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No offers yet</h3>
              <p className="text-gray-500 mb-4">Start browsing properties to make your first offer</p>
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl">
                Browse Properties
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {offers.map((offer) => (
                <div key={offer.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{offer.properties.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {offer.properties.location}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-gray-600">
                          Your offer: £{Math.round(offer.offer_price).toLocaleString()}
                        </span>
                        {offer.properties.price && (
                          <span className="text-sm text-gray-500">
                            Listed at: £{Math.round(offer.properties.price).toLocaleString()}
                          </span>
                        )}
                      </div>
                      {offer.message && (
                        <p className="text-sm text-gray-600 mt-2 italic">
                          "{offer.message}"
                        </p>
                      )}
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      getStatusColor(offer.status)
                    }`}>
                      {getStatusIcon(offer.status)}
                      {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
