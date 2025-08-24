import React from 'react';
import { Helmet } from 'react-helmet-async';
const TermsOfService: React.FC = () => {
  return <>
      <Helmet>
        <title>Terms of Service - RapidRent</title>
        <meta name="description" content="RapidRent's terms of service outline the rules and regulations for using our rental property platform and services." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/legal/terms" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <header className="mb-12">
            <h1 className="text-4xl font-bold text-text-primary mb-4">RapidRent Terms of Service</h1>
            <p className="text-text-muted text-lg">
              Welcome to RapidRent. By using our platform, you agree to these terms.
            </p>
          </header>

          <main className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">1. Our Role</h2>
              <p className="text-text-muted mb-4">
                RapidRent provides a platform for tenants, landlords, and agents to manage rental journeys. We are not a letting or estate agent and do not guarantee rental agreements. Verification is carried out by third-party providers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">2. Using RapidRent</h2>
              <ul className="list-disc pl-6 text-text-muted mb-4 space-y-2">
                <li>You must provide accurate information.</li>
                <li>You must not use RapidRent for unlawful purposes.</li>
                <li>You are responsible for keeping your login details secure.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">3. Verification Services</h2>
              <ul className="list-disc pl-6 text-text-muted mb-4 space-y-2">
                <li>Verification is performed by trusted third-party providers.</li>
                <li>RapidRent displays the results but is not responsible for their accuracy.</li>
                <li>Landlords remain legally responsible for all tenant checks, including Right-to-Rent.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">4. Limitation of Liability</h2>
              <ul className="list-disc pl-6 text-text-muted mb-4 space-y-2">
                <li>RapidRent is not responsible for rental outcomes, disputes, or losses arising from use of the platform.</li>
                <li>The service is provided "as is" without warranties of uninterrupted access.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">5. Termination</h2>
              <p className="text-text-muted mb-4">
                We may suspend or terminate accounts that violate these terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">6. Governing Law</h2>
              <p className="text-text-muted mb-4">
                These terms are governed by the laws of England and Wales.
              </p>
            </section>

            <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg mt-8">
              <h3 className="text-lg font-semibold text-amber-800 mb-3">⚠️ Important Disclaimers</h3>
              <ul className="list-disc pl-6 text-amber-700 space-y-1">
                <li>RapidRent is not a letting or estate agent.</li>
                <li>Verification services are delivered by authorised third-party providers.</li>
                <li>Landlords remain responsible for their own legal duties, including Right-to-Rent compliance.</li>
                <li>RapidRent does not guarantee tenancy approval, rental agreements, or property availability.</li>
              </ul>
            </div>
          </main>
        </div>
      </div>
    </>;
};
export default TermsOfService;