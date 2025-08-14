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
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">1. Introduction</h2>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Legal counsel review required]</strong> RentView ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our rental property platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-text-primary mb-3">2.1 Personal Information</h3>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Specify exact data types collected]</strong> We may collect personal information including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-text-muted mb-4">
                <li>Name, email address, and contact information</li>
                <li>Identity verification documents</li>
                <li>Financial information for tenancy applications</li>
                <li>Property preferences and search history</li>
                <li>Communication records</li>
              </ul>

              <h3 className="text-xl font-medium text-text-primary mb-3">2.2 Technical Information</h3>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Define technical data collection scope]</strong> We automatically collect certain technical information when you use our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">3. How We Use Your Information</h2>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Detail specific use cases and legal basis under GDPR]</strong> We use your information to provide and improve our services, including:
              </p>
              <ul className="list-disc pl-6 text-text-muted mb-4">
                <li>Facilitating property searches and applications</li>
                <li>Verifying identity and conducting background checks</li>
                <li>Communicating about your account and services</li>
                <li>Improving our platform and user experience</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Specify third-party sharing arrangements]</strong> We may share your information with landlords, property managers, and service providers as necessary to facilitate rental transactions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">5. Your Rights Under GDPR</h2>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Detail specific GDPR rights and procedures]</strong> As a data subject, you have the right to:
              </p>
              <ul className="list-disc pl-6 text-text-muted mb-4">
                <li>Access your personal data</li>
                <li>Rectify inaccurate data</li>
                <li>Request erasure of your data</li>
                <li>Restrict processing</li>
                <li>Data portability</li>
                <li>Object to processing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">6. Data Security</h2>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Specify security measures]</strong> We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">7. Data Retention</h2>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Define retention periods]</strong> We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">8. Contact Information</h2>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Provide complete contact details]</strong> For any privacy-related questions or to exercise your rights, please contact us at:
              </p>
              <div className="bg-muted/20 p-4 rounded-lg">
                <p className="text-text-muted">
                  Email: [TODO: Add privacy email]<br />
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

export default PrivacyPolicy