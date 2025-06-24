
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Heading } from '@/components/ui/heading'
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
    <div className="min-h-screen bg-background font-sans">
      {/* Navigation Header */}
      <header className="border-b border-muted bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-text-primary">
              Rent<span className="text-primary">View</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => navigate('/listings')}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                Properties
              </button>
              <button 
                onClick={() => navigate('/auth')}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                Sign In
              </button>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-primary hover:bg-primary-dark text-white rounded-xl"
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
          <Heading level={1} highlight="place to call home." className="mb-6 leading-tight">
            Find your perfect place to call home.
          </Heading>
          <p className="text-xl text-text-muted mb-12 max-w-2xl mx-auto">
            Discover amazing rental properties and connect with trusted landlords. 
            Your next home is just a search away.
          </p>
          
          {/* Search Input */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
              <Input
                type="text"
                placeholder="Where do you want to live?"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-muted focus:border-primary focus:ring-primary bg-card"
              />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Button
              onClick={handleRenterClick}
              size="lg"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 text-lg rounded-xl"
            >
              I'm a Renter
            </Button>
            <Button
              onClick={handleLandlordClick}
              variant="outline"
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg rounded-xl"
            >
              I'm a Landlord
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-6xl mx-auto">
          <Heading level={2} className="text-center text-text-primary mb-16">
            Everything you need in one place
          </Heading>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card rounded-xl shadow-sm border border-muted p-8 text-center">
              <CardContent className="pt-0">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                  <HomeIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">For Renters</h3>
                <p className="text-text-muted">
                  Find your perfect home with our smart search tools and connect directly with landlords.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card rounded-xl shadow-sm border border-muted p-8 text-center">
              <CardContent className="pt-0">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">For Agents</h3>
                <p className="text-text-muted">
                  Manage multiple properties efficiently and connect with quality tenants seamlessly.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card rounded-xl shadow-sm border border-muted p-8 text-center">
              <CardContent className="pt-0">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">For Landlords</h3>
                <p className="text-text-muted">
                  List your properties, screen tenants, and manage rentals with confidence and ease.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <Heading level={2} className="text-center text-text-primary mb-16">
            What our users say
          </Heading>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card rounded-xl shadow-sm border border-muted p-6">
              <CardContent className="pt-0">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-text-muted mb-4">
                  "Found my dream apartment within a week! The process was so smooth and the landlord was fantastic."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    SM
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary">Sarah M.</div>
                    <div className="text-sm text-text-muted">Tenant</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card rounded-xl shadow-sm border border-muted p-6">
              <CardContent className="pt-0">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-text-muted mb-4">
                  "As a landlord, this platform has made finding quality tenants so much easier. Highly recommended!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    JD
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary">John D.</div>
                    <div className="text-sm text-text-muted">Landlord</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card rounded-xl shadow-sm border border-muted p-6">
              <CardContent className="pt-0">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-text-muted mb-4">
                  "The search filters are amazing and the direct communication feature saved me so much time."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    EB
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary">Emma B.</div>
                    <div className="text-sm text-text-muted">Tenant</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-6xl mx-auto">
          <Heading level={2} className="text-center text-text-primary mb-16">
            Simple, transparent pricing
          </Heading>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card rounded-xl shadow-sm border-2 border-muted p-8 text-center">
              <CardContent className="pt-0">
                <h3 className="text-2xl font-bold text-text-primary mb-2">Free Forever</h3>
                <div className="text-4xl font-bold text-text-primary mb-6">£0</div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span className="text-text-muted">Browse all properties</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span className="text-text-muted">Contact landlords</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span className="text-text-muted">Basic search filters</span>
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl border-2 border-muted hover:border-primary hover:text-primary"
                  onClick={() => navigate('/auth')}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card rounded-xl shadow-lg border-2 border-primary p-8 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <CardContent className="pt-0">
                <h3 className="text-2xl font-bold text-text-primary mb-2">Boost Your Offer</h3>
                <div className="text-4xl font-bold text-text-primary mb-6">£7.99</div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span className="text-text-muted">Everything in Free</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span className="text-text-muted">Priority in search results</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span className="text-text-muted">Offer boost features</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl"
                  onClick={() => navigate('/auth')}
                >
                  Choose Plan
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card rounded-xl shadow-sm border-2 border-muted p-8 text-center">
              <CardContent className="pt-0">
                <h3 className="text-2xl font-bold text-text-primary mb-2">Premium Insights</h3>
                <div className="text-4xl font-bold text-text-primary mb-6">
                  £9.99<span className="text-lg text-text-muted">/mo</span>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span className="text-text-muted">Everything in Boost</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span className="text-text-muted">Market insights</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span className="text-text-muted">Advanced analytics</span>
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl border-2 border-muted hover:border-primary hover:text-primary"
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
      <footer className="bg-card border-t border-muted py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold text-text-primary mb-4">
                Rent<span className="text-primary">View</span>
              </div>
              <p className="text-text-muted">
                Making rental property search simple and transparent for everyone.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-text-primary mb-4">For Tenants</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => navigate('/listings')}
                    className="text-text-muted hover:text-primary transition-colors"
                  >
                    Browse Properties
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/auth')}
                    className="text-text-muted hover:text-primary transition-colors"
                  >
                    Create Account
                  </button>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-primary transition-colors">
                    Tenant Guide
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-text-primary mb-4">For Landlords</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => navigate('/auth')}
                    className="text-text-muted hover:text-primary transition-colors"
                  >
                    List Property
                  </button>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-primary transition-colors">
                    Landlord Tools
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-primary transition-colors">
                    Resources
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-text-primary mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-text-muted hover:text-primary transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-primary transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-muted pt-8 text-center text-text-muted">
            <p>&copy; 2024 RentView. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
