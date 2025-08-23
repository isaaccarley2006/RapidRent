
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Building, Plus, Eye, MapPin, Upload, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


interface Property {
  id: string
  title: string
  description: string | null
  location: string | null
  price: number | null
  status: string
  created_at: string
  images: string[] | null
}

interface PropertyWithOffers extends Property {
  offers: Array<{
    id: string
    offer_price: number
    status: string
    tenant_id: string
  }>
}

export const LandlordDashboard: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [properties, setProperties] = useState<PropertyWithOffers[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingProperty, setDeletingProperty] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperties = async () => {
      if (!user) return
      
      try {
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            offers (
              id,
              offer_price,
              status,
              tenant_id
            )
          `)
          .eq('landlord_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setProperties(data || [])
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [user])

  const handleDeleteProperty = async (propertyId: string) => {
    if (!user) return
    
    try {
      setDeletingProperty(propertyId)
      
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId)
        .eq('landlord_id', user.id)

      if (error) throw error

      // Update local state to remove the deleted property
      setProperties(prev => prev.filter(p => p.id !== propertyId))
      
      toast({
        title: "Property deleted",
        description: "Your property has been deleted successfully."
      })
    } catch (error) {
      console.error('Error deleting property:', error)
      toast({
        title: "Error deleting property",
        description: "Failed to delete property. Please try again.",
        variant: "destructive"
      })
    } finally {
      setDeletingProperty(null)
    }
  }

  const totalOffers = properties.reduce((sum, property) => sum + property.offers.length, 0)
  const pendingOffers = properties.reduce((sum, property) => 
    sum + property.offers.filter(offer => offer.status === 'pending').length, 0
  )

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
                <p className="text-sm font-medium text-gray-600">Properties</p>
                <p className="text-2xl font-semibold text-gray-900">{properties.length}</p>
              </div>
              <Building className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Offers</p>
                <p className="text-2xl font-semibold text-gray-900">{totalOffers}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Offers</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingOffers}</p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-semibold">!</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties List */}
      <Card className="bg-white border border-gray-200 rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Properties</CardTitle>
            <CardDescription>
              Manage your rental listings and track offers
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate('/bulk-upload')}
              variant="outline"
              className="rounded-xl"
            >
              <Upload className="w-4 h-4 mr-2" />
              Bulk Upload
            </Button>
            <Button 
              onClick={() => navigate('/create-listing')}
              className="bg-primary hover:bg-primary/90 text-white rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {properties.length === 0 ? (
            <div className="text-center py-8">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties listed</h3>
              <p className="text-gray-500 mb-4">Create your first property listing to start receiving offers</p>
              <Button 
                onClick={() => navigate('/create-listing')}
                className="bg-primary hover:bg-primary/90 text-white rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Property
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {properties.map((property) => (
                <div key={property.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start gap-4">
                    {/* Property Image */}
                    <div className="w-20 h-16 flex-shrink-0">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-muted/40 to-muted/60 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-muted/40 to-muted/60 rounded-lg flex items-center justify-center">
                          <Building className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{property.title}</h4>
                      {property.location && (
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{property.location}</span>
                        </div>
                      )}
                      {property.price && (
                        <p className="text-lg font-semibold text-primary mt-2">
                          £{Math.round(property.price).toLocaleString()}/month
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-sm text-gray-600">
                          {property.offers.length} offer{property.offers.length !== 1 ? 's' : ''}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          property.status === 'listed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {property.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300 rounded-xl"
                      >
                        View Details
                      </Button>
                      {property.offers.length > 0 && (
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-white rounded-xl"
                          onClick={() => navigate(`/property/${property.id}/offers`)}
                        >
                          View Offers ({property.offers.length})
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-300 text-red-700 hover:bg-red-50 rounded-xl"
                            disabled={deletingProperty === property.id}
                          >
                            {deletingProperty === property.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Property</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{property.title}"? This action cannot be undone and will also delete all associated offers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteProperty(property.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete Property
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
