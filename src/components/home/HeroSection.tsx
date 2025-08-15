import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState('');
  const handleSearch = () => {
    if (searchLocation.trim()) {
      navigate(`/listings?location=${encodeURIComponent(searchLocation)}`);
    }
  };
  const handleRenterClick = () => {
    navigate('/listings');
  };
  const handleLandlordClick = () => {
    navigate('/auth');
  };
  return <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-6">
          <h1 className="text-6xl md:text-7xl font-bold text-text-primary leading-tight">
            Find your perfect
          </h1>
          <h1 className="text-6xl md:text-7xl font-bold text-primary mt-2 leading-tight">
            place to call home.
          </h1>
        </div>
        <p className="text-2xl text-text-muted mb-12 max-w-2xl mx-auto">One platform for your entire rental journey – verified profiles, centralised listings, eligibility checks, and a secure, faster process for renters, landlords, and agents.</p>
        
        {/* Search Input */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
            <Input type="text" placeholder="Where do you want to live?" value={searchLocation} onChange={e => setSearchLocation(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSearch()} className="pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-muted focus:border-primary focus:ring-primary bg-white" />
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Button onClick={handleRenterClick} size="lg" className="bg-primary hover:bg-primary-dark text-white px-8 py-4 text-lg rounded-xl">
            I'm a Renter
          </Button>
          <Button onClick={handleLandlordClick} variant="outline" size="lg" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg rounded-xl">
            I'm a Landlord
          </Button>
        </div>
      </div>
    </section>;
};