
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Home as HomeIcon, Users, Star, Shield, TrendingUp, CheckCircle } from 'lucide-react'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [searchLocation, setSearchLocation] = useState('')

  const handleSearch = () => {
    if (searchLocation.trim()) {
      navigate(`/listings?location=${encodeURIComponent(searchLocation)}`)
    }
  }

  const handleRenterClick = () => {
    navigate('/listings')
  }

  const handleLandlordClick = () => {
    navigate('/auth')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">
              Rent<span className="text-[#FA6404]">View</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => navigate('/listings')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Properties
              </button>
              <button 
                onClick={() => navigate('/auth')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign In
              </button>
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

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find your perfect <span className="text-[#FA6404]">place to call home.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover amazing rental properties and connect with trusted landlords. 
            Your next home is just a search away.
          </p>
          
          {/* Search Input */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Where do you want to live?"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-gray-200 focus:border-[#FA6404] focus:ring-[#FA6404]"
              />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Button
              onClick={handleRenterClick}
              size="lg"
              className="bg-[#FA6404] hover:bg-[#e55a04] text-white px-8 py-4 text-lg rounded-xl"
            >
              I'm a Renter
            </Button>
            <Button
              onClick={handleLandlordClick}
              variant="outline"
              size="lg"
              className="border-2 border-[#FA6404] text-[#FA6404] hover:bg-[#FA6404] hover:text-white px-8 py-4 text-lg rounded-xl"
            >
              I'm a Landlord
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Everything you need in one place
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <CardContent className="pt-0">
                <div className="w-16 h-16 bg-[#FA6404] rounded-xl flex items-center justify-center mx-auto mb-6">
                  <HomeIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">For Renters</h3>
                <p className="text-gray-600">
                  Find your perfect home with our smart search tools and connect directly with landlords.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <CardContent className="pt-0">
                <div className="w-16 h-16 bg-[#FA6404] rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">For Agents</h3>
                <p className="text-gray-600">
                  Manage multiple properties efficiently and connect with quality tenants seamlessly.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <CardContent className="pt-0">
                <div className="w-16 h-16 bg-[#FA6404] rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">For Landlords</h3>
                <p className="text-gray-600">
                  List your properties, screen tenants, and manage rentals with confidence and ease.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            What our users say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <CardContent className="pt-0">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FA6404] text-[#FA6404]" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Found my dream apartment within a week! The process was so smooth and the landlord was fantastic."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#FA6404] rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    SM
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Sarah M.</div>
                    <div className="text-sm text-gray-500">Tenant</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <CardContent className="pt-0">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FA6404] text-[#FA6404]" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "As a landlord, this platform has made finding quality tenants so much easier. Highly recommended!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#FA6404] rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    JD
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">John D.</div>
                    <div className="text-sm text-gray-500">Landlord</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <CardContent className="pt-0">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FA6404] text-[#FA6404]" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The search filters are amazing and the direct communication feature saved me so much time."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#FA6404] rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    EB
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Emma B.</div>
                    <div className="text-sm text-gray-500">Tenant</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Simple, transparent pricing
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-8 text-center">
              <CardContent className="pt-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Forever</h3>
                <div className="text-4xl font-bold text-gray-900 mb-6">£0</div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600">Browse all properties</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600">Contact landlords</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600">Basic search filters</span>
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl border-2 border-gray-300"
                  onClick={() => navigate('/auth')}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-xl shadow-lg border-2 border-[#FA6404] p-8 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#FA6404] text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <CardContent className="pt-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Boost Your Offer</h3>
                <div className="text-4xl font-bold text-gray-900 mb-6">£7.99</div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600">Everything in Free</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600">Priority in search results</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600">Offer boost features</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-[#FA6404] hover:bg-[#e55a04] text-white rounded-xl"
                  onClick={() => navigate('/auth')}
                >
                  Choose Plan
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-8 text-center">
              <CardContent className="pt-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Insights</h3>
                <div className="text-4xl font-bold text-gray-900 mb-6">
                  £9.99<span className="text-lg text-gray-500">/mo</span>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600">Everything in Boost</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600">Market insights</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600">Advanced analytics</span>
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl border-2 border-gray-300"
                  onClick={() => navigate('/auth')}
                >
                  Choose Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-4">
                Rent<span className="text-[#FA6404]">View</span>
              </div>
              <p className="text-gray-600">
                Making rental property search simple and transparent for everyone.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">For Tenants</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => navigate('/listings')}
                    className="text-gray-600 hover:text-[#FA6404] transition-colors"
                  >
                    Browse Properties
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/auth')}
                    className="text-gray-600 hover:text-[#FA6404] transition-colors"
                  >
                    Create Account
                  </button>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#FA6404] transition-colors">
                    Tenant Guide
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">For Landlords</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => navigate('/auth')}
                    className="text-gray-600 hover:text-[#FA6404] transition-colors"
                  >
                    List Property
                  </button>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#FA6404] transition-colors">
                    Landlord Tools
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#FA6404] transition-colors">
                    Resources
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#FA6404] transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#FA6404] transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#FA6404] transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 text-center text-gray-600">
            <p>&copy; 2024 RentView. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
