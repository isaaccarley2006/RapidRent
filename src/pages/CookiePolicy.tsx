import React from 'react'
import { Helmet } from 'react-helmet-async'

const CookiePolicy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Cookie Policy - RentView</title>
        <meta name="description" content="Learn about how RentView uses cookies and similar technologies to enhance your experience on our rental property platform." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/legal/cookies" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <header className="mb-12">
            <h1 className="text-4xl font-bold text-text-primary mb-4">Cookie Policy</h1>
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
              <h2 className="text-2xl font-semibold text-text-primary mb-4">1. What Are Cookies?</h2>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Legal counsel review required]</strong> Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and improving our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">2. How We Use Cookies</h2>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Specify actual cookie usage]</strong> We use cookies for various purposes to enhance your experience on RentView.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">3. Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-medium text-text-primary mb-3">3.1 Essential Cookies</h3>
              <p className="text-text-muted mb-4">
                <strong>[TODO: List essential cookies]</strong> These cookies are necessary for the website to function properly and cannot be disabled.
              </p>
              
              <h3 className="text-xl font-medium text-text-primary mb-3">3.2 Performance Cookies</h3>
              <p className="text-text-muted mb-4">
                <strong>[TODO: List analytics cookies]</strong> These cookies help us understand how visitors interact with our website by collecting anonymous information.
              </p>
              
              <h3 className="text-xl font-medium text-text-primary mb-3">3.3 Functionality Cookies</h3>
              <p className="text-text-muted mb-4">
                <strong>[TODO: List functionality cookies]</strong> These cookies remember your preferences and provide enhanced features.
              </p>
              
              <h3 className="text-xl font-medium text-text-primary mb-3">3.4 Targeting/Advertising Cookies</h3>
              <p className="text-text-muted mb-4">
                <strong>[TODO: List advertising cookies if applicable]</strong> These cookies may be used to deliver relevant advertisements based on your interests.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">4. Third-Party Cookies</h2>
              <p className="text-text-muted mb-4">
                <strong>[TODO: List third-party services and their cookies]</strong> We may use third-party services that place their own cookies on your device. These include:
              </p>
              <ul className="list-disc pl-6 text-text-muted mb-4">
                <li>Analytics providers (e.g., Google Analytics)</li>
                <li>Social media platforms</li>
                <li>Payment processors</li>
                <li>Customer support tools</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">5. Cookie Duration</h2>
              
              <h3 className="text-xl font-medium text-text-primary mb-3">5.1 Session Cookies</h3>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Explain session cookies]</strong> These cookies are temporary and are deleted when you close your browser.
              </p>
              
              <h3 className="text-xl font-medium text-text-primary mb-3">5.2 Persistent Cookies</h3>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Explain persistent cookies and retention periods]</strong> These cookies remain on your device for a specified period or until you delete them.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">6. Managing Your Cookie Preferences</h2>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Implement cookie consent mechanism]</strong> You can control and manage cookies in several ways:
              </p>
              
              <h3 className="text-xl font-medium text-text-primary mb-3">6.1 Browser Settings</h3>
              <p className="text-text-muted mb-4">
                Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or delete certain cookies.
              </p>
              
              <h3 className="text-xl font-medium text-text-primary mb-3">6.2 Our Cookie Preferences</h3>
              <div className="bg-muted/20 p-4 rounded-lg mb-4">
                <p className="text-text-muted">
                  <strong>[TODO: Add cookie preference center link]</strong><br />
                  You can manage your cookie preferences through our Cookie Preference Center.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">7. Impact of Disabling Cookies</h2>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Explain functionality impact]</strong> Disabling certain cookies may affect your ability to use some features of our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">8. Updates to This Policy</h2>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Define update procedures]</strong> We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">9. Contact Information</h2>
              <p className="text-text-muted mb-4">
                <strong>[TODO: Provide complete contact details]</strong> If you have any questions about our use of cookies, please contact us at:
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

export default CookiePolicy