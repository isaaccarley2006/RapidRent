import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Home as HomeIcon, Users, Shield } from 'lucide-react';
export const FeaturesSection: React.FC = () => {
  return <section className="py-20 rounded-2xl px-[5px] bg-transparent">
      <div className="max-w-6xl mx-auto">
        <Heading level={2} className="text-center text-text-primary mb-16">
          Everything you need in one place
        </Heading>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white rounded-xl shadow-sm border border-muted p-8 text-center">
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
          
          <Card className="bg-white rounded-xl shadow-sm border border-muted p-8 text-center">
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
          
          <Card className="bg-white rounded-xl shadow-sm border border-muted p-8 text-center">
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
        </div>
      </div>
    </section>;
};