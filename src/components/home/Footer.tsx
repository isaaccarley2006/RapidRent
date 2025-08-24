
import React from 'react'
import { useNavigate } from 'react-router-dom'

export const Footer: React.FC = () => {
  const navigate = useNavigate()

  return (
    <footer className="bg-white border-t border-muted py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-2xl font-bold text-text-primary mb-4">
              Rapid<span className="text-primary">Rent</span>
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
            <h4 className="font-semibold text-text-primary mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => navigate('/legal/privacy')}
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/legal/terms')}
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/legal/cookies')}
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  Cookie Policy
                </button>
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
            </ul>
          </div>
        </div>
        
        <div className="border-t border-muted pt-8 text-center text-text-muted">
          <p>&copy; 2024 RapidRent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
