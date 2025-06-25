
import React from 'react'
import { 
  Navigation, 
  HeroSection, 
  FeaturesSection, 
  TestimonialsSection, 
  PricingSection, 
  Footer 
} from '@/components/home'

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  )
}

export default Home
