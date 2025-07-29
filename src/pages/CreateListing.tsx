import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { AppLayout } from '@/components/layouts/AppLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Home, Loader2 } from 'lucide-react'

const propertySchema = z.object({
  title: z.string().min(1, 'Property title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters'),
  location: z.string().min(1, 'Location is required').max(100, 'Location must be less than 100 characters'),
  price: z.string().min(1, 'Price is required').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Price must be a valid positive number'),
  propertyType: z.string().min(1, 'Property type is required'),
  bedrooms: z.string().min(1, 'Number of bedrooms is required'),
  bathrooms: z.string().min(1, 'Number of bathrooms is required'),
  furnished: z.string().min(1, 'Furnished status is required'),
  deposit: z.string().min(1, 'Deposit amount is required').refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Deposit must be a valid number'),
  availableFrom: z.string().min(1, 'Available from date is required'),
  leaseDuration: z.string().min(1, 'Minimum lease duration is required'),
  billsIncluded: z.boolean(),
  petFriendly: z.boolean(),
  parking: z.boolean(),
  garden: z.boolean(),
  balcony: z.boolean()
})

type PropertyFormData = z.infer<typeof propertySchema>

const CreateListing: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      price: '',
      propertyType: '',
      bedrooms: '',
      bathrooms: '',
      furnished: '',
      deposit: '',
      availableFrom: '',
      leaseDuration: '',
      billsIncluded: false,
      petFriendly: false,
      parking: false,
      garden: false,
      balcony: false
    }
  })

  const onSubmit = async (data: PropertyFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a listing",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create comprehensive property description from all form data
      const fullDescription = `${data.description}

Property Details:
• Type: ${data.propertyType}
• Bedrooms: ${data.bedrooms}
• Bathrooms: ${data.bathrooms}
• Furnished: ${data.furnished}
• Deposit: £${data.deposit}
• Available from: ${data.availableFrom}
• Minimum lease: ${data.leaseDuration}
• Bills included: ${data.billsIncluded ? 'Yes' : 'No'}
• Pet friendly: ${data.petFriendly ? 'Yes' : 'No'}
• Parking: ${data.parking ? 'Yes' : 'No'}
• Garden: ${data.garden ? 'Yes' : 'No'}
• Balcony: ${data.balcony ? 'Yes' : 'No'}`

      const { error } = await supabase
        .from('properties')
        .insert({
          title: data.title,
          description: fullDescription,
          location: data.location,
          price: parseFloat(data.price),
          landlord_id: user.id,
          status: 'listed',
          bedrooms: data.bedrooms === 'studio' ? 0 : parseInt(data.bedrooms.replace(/[^\d]/g, '')) || null,
          bathrooms: parseFloat(data.bathrooms.replace(/[^\d.]/g, '')) || null,
          furnished: data.furnished === 'fully-furnished' || data.furnished === 'part-furnished',
          property_type: data.propertyType
        })

      if (error) throw error

      toast({
        title: "Success!",
        description: "Your property listing has been created and is now live on the marketplace."
      })

      navigate('/dashboard')
    } catch (error) {
      console.error('Error creating property:', error)
      toast({
        title: "Error",
        description: "Failed to create property listing. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppLayout>
      <div className="px-6 py-8">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="mb-4 border-muted text-text-primary hover:bg-surface rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-semibold text-text-primary">
            Create New Property Listing
          </h1>
          <p className="text-text-muted mt-2">
            Add your property to the marketplace and start receiving offers
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information Section */}
            <Card className="bg-white border border-gray-200 rounded-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Home className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Essential details about your property</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-text-primary font-medium">Property Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Modern 2-bedroom apartment in city center"
                            {...field}
                            className="border-muted rounded-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-text-primary font-medium">Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Manchester City Centre, M1 2AB"
                            {...field}
                            className="border-muted rounded-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-text-primary font-medium">Monthly Rent (£)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 1200"
                            {...field}
                            className="border-muted rounded-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-text-primary font-medium">Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your property, its features, amenities, and what makes it special..."
                            className="border-muted rounded-xl min-h-[100px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Property Specifications Section */}
            <Card className="bg-white border border-gray-200 rounded-xl">
              <CardHeader>
                <CardTitle>Property Specifications</CardTitle>
                <CardDescription>Detailed specifications and features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  <FormField
                    control={form.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-text-primary font-medium">Property Type</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="border-muted rounded-xl">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="apartment">Apartment</SelectItem>
                              <SelectItem value="house">House</SelectItem>
                              <SelectItem value="studio">Studio</SelectItem>
                              <SelectItem value="flat">Flat</SelectItem>
                              <SelectItem value="penthouse">Penthouse</SelectItem>
                              <SelectItem value="townhouse">Townhouse</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-text-primary font-medium">Bedrooms</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="border-muted rounded-xl">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="studio">Studio</SelectItem>
                              <SelectItem value="1">1 Bedroom</SelectItem>
                              <SelectItem value="2">2 Bedrooms</SelectItem>
                              <SelectItem value="3">3 Bedrooms</SelectItem>
                              <SelectItem value="4">4 Bedrooms</SelectItem>
                              <SelectItem value="5+">5+ Bedrooms</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-text-primary font-medium">Bathrooms</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="border-muted rounded-xl">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Bathroom</SelectItem>
                              <SelectItem value="1.5">1.5 Bathrooms</SelectItem>
                              <SelectItem value="2">2 Bathrooms</SelectItem>
                              <SelectItem value="2.5">2.5 Bathrooms</SelectItem>
                              <SelectItem value="3">3 Bathrooms</SelectItem>
                              <SelectItem value="3+">3+ Bathrooms</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="furnished"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-text-primary font-medium">Furnished</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="border-muted rounded-xl">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fully-furnished">Fully Furnished</SelectItem>
                              <SelectItem value="part-furnished">Part Furnished</SelectItem>
                              <SelectItem value="unfurnished">Unfurnished</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Financial & Availability Section */}
            <Card className="bg-white border border-gray-200 rounded-xl">
              <CardHeader>
                <CardTitle>Financial & Availability</CardTitle>
                <CardDescription>Rental terms and availability details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="deposit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-text-primary font-medium">Deposit (£)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 1500"
                            {...field}
                            className="border-muted rounded-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="availableFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-text-primary font-medium">Available From</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            className="border-muted rounded-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="leaseDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-text-primary font-medium">Minimum Lease</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="border-muted rounded-xl">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3-months">3 Months</SelectItem>
                              <SelectItem value="6-months">6 Months</SelectItem>
                              <SelectItem value="12-months">12 Months</SelectItem>
                              <SelectItem value="18-months">18 Months</SelectItem>
                              <SelectItem value="24-months">24 Months</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Amenities & Features Section */}
            <Card className="bg-white border border-gray-200 rounded-xl">
              <CardHeader>
                <CardTitle>Amenities & Features</CardTitle>
                <CardDescription>Select all amenities and features available</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  <FormField
                    control={form.control}
                    name="billsIncluded"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="rounded"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-text-primary font-medium text-sm">
                            Bills Included
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="petFriendly"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="rounded"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-text-primary font-medium text-sm">
                            Pet Friendly
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="parking"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="rounded"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-text-primary font-medium text-sm">
                            Parking Available
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="garden"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="rounded"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-text-primary font-medium text-sm">
                            Garden/Yard
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="balcony"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="rounded"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-text-primary font-medium text-sm">
                            Balcony/Terrace
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Section */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="border-muted text-text-primary hover:bg-surface rounded-xl px-8"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Listing...
                  </>
                ) : (
                  'Create Listing'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AppLayout>
  )
}

export default CreateListing