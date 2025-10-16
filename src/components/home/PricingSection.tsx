import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { CheckCircle } from 'lucide-react';
export const PricingSection: React.FC = () => {
  const navigate = useNavigate();
  return <section className="py-20 px-6 bg-transparent">
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
              <Button variant="outline" className="w-full rounded-xl border-2 border-muted hover:border-primary hover:text-primary" onClick={() => navigate('/auth')}>
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
              <Button className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl" onClick={() => navigate('/auth')}>
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
              <Button variant="outline" className="w-full rounded-xl border-2 border-muted hover:border-primary hover:text-primary" onClick={() => navigate('/auth')}>
                Choose Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>;
};