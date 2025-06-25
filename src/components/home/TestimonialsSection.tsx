
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Heading } from '@/components/ui/heading'
import { Star } from 'lucide-react'

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <Heading level={2} className="text-center text-text-primary mb-16">
          What our users say
        </Heading>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white rounded-xl shadow-sm border border-muted p-6">
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

          <Card className="bg-white rounded-xl shadow-sm border border-muted p-6">
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

          <Card className="bg-white rounded-xl shadow-sm border border-muted p-6">
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
  )
}
