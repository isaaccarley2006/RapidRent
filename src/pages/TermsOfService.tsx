import React from 'react'
import { Helmet } from 'react-helmet-async'

const TermsOfService: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - RentView</title>
        <meta name="description" content="RentView's terms of service outline the rules and regulations for using our rental property platform and services." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/legal/terms" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <header className="mb-12">
            <h1 className="text-4xl font-bold text-text-primary mb-4">Terms of Service</h1>
            <p className="text-text-muted text-lg">
              Last updated: {new Date().toLocaleDateString('en-GB', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </header>

          <main className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">1. Acceptance of Terms</h2>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Legal counsel review required]</strong> By accessing and using RentView, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">2. Description of Service</h2>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Define service scope and limitations]</strong> RentView is a platform that connects tenants and landlords for rental property transactions. We facilitate property listings, applications, and related services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">3. User Accounts and Registration</h2>
              <h3 className="text-xl font-medium text-text-primary mb-3">3.1 Account Creation</h3>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Specify registration requirements]</strong> Users must provide accurate and complete information when creating an account.
              </p>
              
              <h3 className="text-xl font-medium text-text-primary mb-3">3.2 Account Security</h3>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Define security responsibilities]</strong> Users are responsible for maintaining the confidentiality of their account credentials.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">4. User Conduct and Prohibited Activities</h2>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Detail prohibited activities]</strong> Users agree not to engage in activities that may harm the platform or other users, including:
              </p>
              <ul className="list-disc pl-6 text-text-muted mb-4">
                <li>Providing false or misleading information</li>
                <li>Violating applicable laws or regulations</li>
                <li>Interfering with platform operations</li>
                <li>Harassing or discriminating against other users</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">5. Property Listings and Transactions</h2>
              <h3 className="text-xl font-medium text-text-primary mb-3">5.1 Landlord Obligations</h3>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Define landlord responsibilities]</strong> Landlords must ensure all property information is accurate and comply with applicable housing laws.
              </p>
              
              <h3 className="text-xl font-medium text-text-primary mb-3">5.2 Tenant Obligations</h3>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Define tenant responsibilities]</strong> Tenants must provide truthful information in applications and comply with lease terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">6. Fees and Payments</h2>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Detail fee structure and payment terms]</strong> Certain services may be subject to fees. All applicable fees will be clearly disclosed before any transaction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">7. Intellectual Property</h2>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Define IP ownership and usage rights]</strong> All content and materials on RentView are protected by intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">8. Disclaimers and Limitation of Liability</h2>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Legal review required for liability limitations]</strong> RentView provides the platform "as is" without warranties of any kind.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">9. Termination</h2>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Define termination procedures]</strong> Either party may terminate this agreement under certain circumstances.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">10. Governing Law</h2>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Specify governing law and jurisdiction]</strong> These terms are governed by the laws of England and Wales.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">11. Contact Information</h2>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Provide complete contact details]</strong> For questions about these terms, please contact us at:
              </p>
              <div className="bg-muted/20 p-4 rounded-lg">
                <p className="text-text-muted">
                  Email: [TODO: Add legal email]<br />
                  Address: [TODO: Add registered address]
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  )
}

export default TermsOfService