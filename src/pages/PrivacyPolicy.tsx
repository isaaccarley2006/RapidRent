import React from 'react'
import { Helmet } from 'react-helmet-async'

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - RentView</title>
        <meta name="description" content="RentView's privacy policy explains how we collect, use, and protect your personal information when you use our rental property platform." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/legal/privacy" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <header className="mb-12">
            <h1 className="text-4xl font-bold text-text-primary mb-4">Privacy Policy</h1>
            <p className="text-text-muted text-lg">
              Last updated: {new Date().toLocaleDateString('en-GB', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </header>

          <main className="prose prose-lg max-w-none">
            <p className="text-text-muted mb-8">
              RentView ("we", "us", "our") is committed to protecting your privacy and handling your personal data in a secure and transparent way. This policy explains how we collect, use, and share information when you use our platform.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">1. Information We Collect</h2>
              <ul className="list-disc pl-6 text-text-muted mb-4 space-y-2">
                <li><strong>Account information:</strong> name, email, phone number, password.</li>
                <li><strong>Verification data:</strong> ID documents, biometrics, credit history, employment/income details, rental history (processed by trusted third-party providers such as ComplyCube, Lets Safe, and Konfir).</li>
                <li><strong>Property data:</strong> property details if you are a landlord or agent.</li>
                <li><strong>Usage data:</strong> website interactions, cookies, and analytics.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">2. How We Use Your Data</h2>
              <ul className="list-disc pl-6 text-text-muted mb-4 space-y-2">
                <li>To create and manage your RentView account.</li>
                <li>To verify your identity, credit, and rental eligibility.</li>
                <li>To share verified results with landlords or agents (with your consent).</li>
                <li>To improve and secure the RentView platform.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">3. Sharing Your Data</h2>
              <ul className="list-disc pl-6 text-text-muted mb-4 space-y-2">
                <li>With third-party verification providers (ComplyCube, Lets Safe, Konfir).</li>
                <li>With landlords and agents, once you consent to share your verified profile.</li>
                <li>With legal or regulatory bodies if required by law.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">4. Your Rights</h2>
              <p className="text-text-muted mb-4">
                Under UK GDPR, you have the right to:
              </p>
              <ul className="list-disc pl-6 text-text-muted mb-4 space-y-2">
                <li>Access your data.</li>
                <li>Request correction or deletion.</li>
                <li>Withdraw consent.</li>
                <li>Request portability of your data.</li>
              </ul>
              <p className="text-text-muted mb-4">
                Requests can be made to: support@rentview.co.uk
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">5. Data Retention</h2>
              <p className="text-text-muted mb-4">
                We only keep your data for as long as necessary to provide our services or comply with legal obligations. Verification data is stored securely and can be deleted upon request.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">6. Security</h2>
              <p className="text-text-muted mb-4">
                We use industry-standard security measures, including encryption and secure third-party integrations.
              </p>
            </section>
          </main>
        </div>
      </div>
    </>
  )
}

export default PrivacyPolicy