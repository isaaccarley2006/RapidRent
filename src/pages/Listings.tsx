
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/layouts/AppLayout'
import { PropertyCard } from '@/components/listings/PropertyCard'
import { SearchFilters } from '@/components/listings/SearchFilters'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useQuery } from '@tanstack/react-query'

interface Property {
  id: string
  title: string
  description: string | null
  price: number | null
  location: string | null
  status: string
  landlord_id: string
  created_at: string
  updated_at: string
}

interface Filters {
  location: string
  minPrice: string
  maxPrice: string
  status: string
}

const Listings: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const initialLocation = searchParams.get('location') || ''

  const [filters, setFilters] = useState<Filters>({
    location: initialLocation,
    minPrice: '',
    maxPrice: '',
    status: 'listed'
  })
  const [searchQuery, setSearchQuery] = useState('')

  const fetchProperties = async (): Promise<Property[]> => {
    let query = supabase
      .from('properties')
      .select('*')
      .eq('status', filters.status || 'listed')
      .order('created_at', { ascending: false })

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }

    if (filters.minPrice) {
      query = query.gte('price', parseFloat(filters.minPrice))
    }

    if (filters.maxPrice) {
      query = query.lte('price', parseFloat(filters.maxPrice))
    }

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching properties:', error)
      throw error
    }

    return data || []
  }

  const { data: properties, isLoading, error, refetch } = useQuery({
    queryKey: ['properties', filters, searchQuery],
    queryFn: fetchProperties
  })

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleBackToHome = () => {
    navigate('/')
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={handleBackToHome}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="text-2xl font-bold text-gray-900">
                Rent<span className="text-[#FA6404]">View</span>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Button 
                onClick={() => navigate('/auth')}
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-[#FA6404] hover:bg-[#e55a04] text-white"
              >
                Get Started
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Property Listings
          </h1>
          <p className="text-gray-600">
            Find your perfect rental property
          </p>
        </div>

        <SearchFilters
          filters={filters}
          searchQuery={searchQuery}
          onFiltersChange={handleFiltersChange}
          onSearchChange={handleSearchChange}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800">
              Error loading properties. Please try again.
            </p>
            <button
              onClick={() => refetch()}
              className="mt-2 text-[#FA6404] hover:text-[#e55a04] font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {properties && properties.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0v-3.586a1 1 0 01.293-.707l6.414-6.414a1 1 0 011.414 0l6.414 6.414a1 1 0 01.293.707V21M9 12l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search criteria
            </p>
          </div>
        )}

        {properties && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Listings
