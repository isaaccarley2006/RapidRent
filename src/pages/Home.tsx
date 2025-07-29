
import React from 'react'
import { 
  HeroSection, 
  FeaturesSection, 
  TestimonialsSection, 
  PricingSection 
} from '@/components/home'

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
    </div>
  )
}

export default Home
