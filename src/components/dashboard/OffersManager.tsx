import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Eye, Check, X, User, DollarSign, Calendar, Home, Phone, Mail, MapPin } from 'lucide-react'
import { format } from 'date-fns'

interface OfferWithDetails {
  id: string
  offer_price: number
  status: string
  preferred_move_in_date: string | null
  tenant_message: string | null
  created_at: string
  properties: {
    title: string
    location: string | null
    price: number | null
  } | null
  profiles: {
    full_name: string | null
    email: string | null
    phone: string | null
    employment_status: string | null
    annual_income: number | null
    current_rental_situation: string | null
    has_pets: boolean | null
    pet_details: string | null
    is_smoker: boolean | null
    tenant_references: string | null
    additional_notes: string | null
  } | null
}

interface OffersManagerProps {
  propertyId?: string
}

export const OffersManager: React.FC<OffersManagerProps> = ({ propertyId }) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [offers, setOffers] = useState<OfferWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOffer, setSelectedOffer] = useState<OfferWithDetails | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchOffers()
  }, [user, propertyId])

  const fetchOffers = async () => {
    if (!user) return

    try {
      let query = supabase
        .from('offers')
        .select(`
          *,
          properties (
            title,
            location,
            price
          ),
          profiles (
            full_name,
            email,
            phone,
            employment_status,
            annual_income,
            current_rental_situation,
            has_pets,
            pet_details,
            is_smoker,
            tenant_references,
            additional_notes
          )
        `)
        .order('created_at', { ascending: false })

      if (propertyId) {
        query = query.eq('property_id', propertyId)
      } else {
        // For dashboard view, get offers for all landlord's properties
        const { data: properties } = await supabase
          .from('properties')
          .select('id')
          .eq('landlord_id', user.id)

        if (properties && properties.length > 0) {
          const propertyIds = properties.map(p => p.id)
          query = query.in('property_id', propertyIds)
        }
      }

      const { data, error } = await query

      if (error) throw error
      setOffers((data as any[]) || [])
    } catch (error) {
      console.error('Error fetching offers:', error)
      toast({
        title: "Error loading offers",
        description: "Please try refreshing the page.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const updateOfferStatus = async (offerId: string, status: 'accepted' | 'rejected') => {
    setUpdating(offerId)

    try {
      const { error } = await supabase
        .from('offers')
        .update({ status })
        .eq('id', offerId)

      if (error) throw error

      toast({
        title: `Offer ${status}`,
        description: `The offer has been ${status} successfully.`
      })

      fetchOffers()
    } catch (error) {
      console.error('Error updating offer:', error)
      toast({
        title: "Error updating offer",
        description: "Please try again.",
        variant: "destructive"
      })
    } finally {
      setUpdating(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (offers.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No offers yet</h3>
          <p className="text-gray-500">
            {propertyId ? 'This property hasn\'t received any offers yet.' : 'None of your properties have received offers yet.'}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Offers</CardTitle>
        <CardDescription>
          {propertyId ? 'Manage offers for this property' : 'Manage all offers across your properties'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Offer Price</TableHead>
              <TableHead>Move-in Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers.map((offer) => (
              <TableRow key={offer.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{offer.properties?.title || 'Property not found'}</div>
                    {offer.properties?.location && (
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {offer.properties.location}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{offer.profiles?.full_name || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">{offer.profiles?.email || 'No email'}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{formatCurrency(offer.offer_price)}/month</div>
                    {offer.properties?.price && (
                      <div className="text-sm text-gray-500">
                        Listed: {formatCurrency(offer.properties.price)}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {offer.preferred_move_in_date ? 
                    format(new Date(offer.preferred_move_in_date), 'MMM d, yyyy') : 
                    'Not specified'
                  }
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(offer.status)}>
                    {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedOffer(offer)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Offer Details</DialogTitle>
                          <DialogDescription>
                            Review tenant profile and offer details
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedOffer && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Offer Details */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <DollarSign className="w-5 h-5 text-primary" />
                                  Offer Details
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Property</label>
                                  <p className="font-medium">{selectedOffer.properties?.title || 'Property not found'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Offer Price</label>
                                  <p className="font-medium text-lg">{formatCurrency(selectedOffer.offer_price)}/month</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Move-in Date</label>
                                  <p>{selectedOffer.preferred_move_in_date ? 
                                    format(new Date(selectedOffer.preferred_move_in_date), 'MMMM d, yyyy') : 
                                    'Not specified'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Submitted</label>
                                  <p>{format(new Date(selectedOffer.created_at), 'MMMM d, yyyy')}</p>
                                </div>
                                {selectedOffer.tenant_message && (
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Message</label>
                                    <p className="italic">"{selectedOffer.tenant_message}"</p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>

                            {/* Tenant Profile */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <User className="w-5 h-5 text-primary" />
                                  Tenant Profile
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Name</label>
                                  <p className="font-medium">{selectedOffer.profiles?.full_name || 'Not provided'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Contact</label>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Mail className="w-4 h-4 text-gray-400" />
                                      <span>{selectedOffer.profiles?.email || 'No email'}</span>
                                    </div>
                                    {selectedOffer.profiles?.phone && (
                                      <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span>{selectedOffer.profiles.phone}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Employment</label>
                                  <p>{selectedOffer.profiles?.employment_status || 'Not specified'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Annual Income</label>
                                  <p>{selectedOffer.profiles?.annual_income ? 
                                    formatCurrency(selectedOffer.profiles.annual_income) : 
                                    'Not disclosed'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Current Situation</label>
                                  <p>{selectedOffer.profiles?.current_rental_situation || 'Not specified'}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Pets</label>
                                    <p>{selectedOffer.profiles?.has_pets ? 'Yes' : 'No'}</p>
                                    {selectedOffer.profiles?.has_pets && selectedOffer.profiles?.pet_details && (
                                      <p className="text-sm text-gray-500 italic">{selectedOffer.profiles.pet_details}</p>
                                    )}
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Smoker</label>
                                    <p>{selectedOffer.profiles?.is_smoker ? 'Yes' : 'No'}</p>
                                  </div>
                                </div>
                                {selectedOffer.profiles?.tenant_references && (
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">References</label>
                                    <p className="text-sm">{selectedOffer.profiles.tenant_references}</p>
                                  </div>
                                )}
                                {selectedOffer.profiles?.additional_notes && (
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Additional Notes</label>
                                    <p className="text-sm">{selectedOffer.profiles.additional_notes}</p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                        )}

                        {selectedOffer && selectedOffer.status === 'pending' && (
                          <div className="flex justify-end gap-4 mt-6">
                            <Button
                              variant="outline"
                              onClick={() => updateOfferStatus(selectedOffer.id, 'rejected')}
                              disabled={updating === selectedOffer.id}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                            <Button
                              onClick={() => updateOfferStatus(selectedOffer.id, 'accepted')}
                              disabled={updating === selectedOffer.id}
                            >
                              {updating === selectedOffer.id ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Check className="w-4 h-4 mr-2" />
                              )}
                              Accept
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {offer.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateOfferStatus(offer.id, 'rejected')}
                          disabled={updating === offer.id}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateOfferStatus(offer.id, 'accepted')}
                          disabled={updating === offer.id}
                        >
                          {updating === offer.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}