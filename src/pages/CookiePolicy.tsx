import React from 'react';
import { Helmet } from 'react-helmet-async';
const CookiePolicy: React.FC = () => {
  return <>
      <Helmet>
        <title>Cookie Policy - RapidRent</title>
        <meta name="description" content="Learn about how RapidRent uses cookies and similar technologies to enhance your experience on our rental property platform." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/legal/cookies" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <header className="mb-12">
            <h1 className="text-4xl font-bold text-text-primary mb-4">RapidRent Cookie Policy</h1>
            <p className="text-text-muted text-lg">
              RapidRent uses cookies and similar technologies to provide and improve our services.
            </p>
          </header>

          <main className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">What Are Cookies?</h2>
              <p className="text-text-muted mb-4">
                Cookies are small text files stored on your device when you visit our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">Types of Cookies We Use</h2>
              <ul className="list-disc pl-6 text-text-muted mb-4 space-y-2">
                <li><strong>Essential cookies:</strong> Required for the platform to function.</li>
                <li><strong>Analytics cookies:</strong> Help us understand how users interact with RapidRent.</li>
                <li><strong>Functional cookies:</strong> Remember your preferences and settings.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">Managing Cookies</h2>
              <p className="text-text-muted mb-4">
                You can manage or disable cookies via your browser settings. Some features may not function properly without them.
              </p>
            </section>
          </main>
        </div>
      </div>
    </>;
};
export default CookiePolicy;