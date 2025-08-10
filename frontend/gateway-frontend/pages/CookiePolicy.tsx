import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Cookie, Settings, Check, X, Info } from 'lucide-react';

export default function CookiePolicy() {
  const [cookieSettings, setCookieSettings] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  const handleCookieToggle = (type: string) => {
    if (type !== 'essential') {
      setCookieSettings(prev => ({
        ...prev,
        [type]: !prev[type as keyof typeof prev]
      }));
    }
  };

  const saveCookieSettings = () => {
    localStorage.setItem('makrx-cookie-settings', JSON.stringify(cookieSettings));
    alert('Cookie preferences saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Cookie Policy | MakrX - How We Use Cookies</title>
        <meta name="description" content="MakrX Cookie Policy - Learn about how we use cookies and similar technologies to improve your experience." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-br from-makrx-blue to-blue-800 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <Cookie className="w-16 h-16 text-makrx-yellow" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Cookie Policy
          </h1>
          <p className="text-xl text-white/90 mb-6">
            How we use cookies and similar technologies
          </p>
          <p className="text-white/80">
            Last updated: January 20, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Cookie Settings Panel */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-4">
            <Settings className="w-6 h-6 text-makrx-blue mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Cookie Preferences</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-800">Essential Cookies</h3>
                <p className="text-sm text-gray-600">Required for basic website functionality</p>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Always Active</span>
                <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-800">Analytics Cookies</h3>
                <p className="text-sm text-gray-600">Help us understand how visitors interact with our website</p>
              </div>
              <button
                onClick={() => handleCookieToggle('analytics')}
                className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                  cookieSettings.analytics ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-800">Marketing Cookies</h3>
                <p className="text-sm text-gray-600">Used to track visitors across websites for advertising</p>
              </div>
              <button
                onClick={() => handleCookieToggle('marketing')}
                className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                  cookieSettings.marketing ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-800">Preference Cookies</h3>
                <p className="text-sm text-gray-600">Remember your settings and preferences</p>
              </div>
              <button
                onClick={() => handleCookieToggle('preferences')}
                className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                  cookieSettings.preferences ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={saveCookieSettings}
              className="bg-makrx-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Cookies?</h2>
            <p className="text-gray-700 leading-relaxed">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
              They are widely used to make websites work more efficiently and provide information to website owners.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                <p className="text-blue-800 text-sm">
                  Cookies cannot harm your computer and do not contain any personal information unless you specifically provide it.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              MakrX uses cookies for several purposes to enhance your experience and improve our services:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  Essential Functions
                </h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• User authentication and security</li>
                  <li>• Shopping cart functionality</li>
                  <li>• Form data preservation</li>
                  <li>• Session management</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Settings className="w-5 h-5 text-blue-600 mr-2" />
                  Personalization
                </h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Language and region preferences</li>
                  <li>• Theme and display settings</li>
                  <li>• Remembered login status</li>
                  <li>• Customized content delivery</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Types of Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Types of Cookies We Use</h2>
            
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">Essential Cookies (Always Active)</h3>
                <p className="text-green-700 text-sm mb-3">
                  These cookies are necessary for the website to function properly and cannot be switched off.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-green-300">
                        <th className="text-left py-2 text-green-800">Cookie Name</th>
                        <th className="text-left py-2 text-green-800">Purpose</th>
                        <th className="text-left py-2 text-green-800">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="text-green-700">
                      <tr className="border-b border-green-200">
                        <td className="py-2 font-mono">makrx_session</td>
                        <td className="py-2">User session management</td>
                        <td className="py-2">Session</td>
                      </tr>
                      <tr className="border-b border-green-200">
                        <td className="py-2 font-mono">makrx_auth</td>
                        <td className="py-2">Authentication state</td>
                        <td className="py-2">24 hours</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono">makrx_cart</td>
                        <td className="py-2">Shopping cart contents</td>
                        <td className="py-2">7 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Analytics Cookies (Optional)</h3>
                <p className="text-blue-700 text-sm mb-3">
                  Help us understand how visitors interact with our website by collecting and reporting information anonymously.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-blue-300">
                        <th className="text-left py-2 text-blue-800">Service</th>
                        <th className="text-left py-2 text-blue-800">Purpose</th>
                        <th className="text-left py-2 text-blue-800">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="text-blue-700">
                      <tr className="border-b border-blue-200">
                        <td className="py-2">Plausible Analytics</td>
                        <td className="py-2">Privacy-focused website analytics</td>
                        <td className="py-2">24 hours</td>
                      </tr>
                      <tr>
                        <td className="py-2">Performance Monitoring</td>
                        <td className="py-2">Site performance and error tracking</td>
                        <td className="py-2">30 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">Preference Cookies (Optional)</h3>
                <p className="text-purple-700 text-sm mb-3">
                  Remember your choices and settings to provide a more personalized experience.
                </p>
                <ul className="text-purple-700 text-sm space-y-1">
                  <li>• Language and region preferences</li>
                  <li>• Dark/light theme selection</li>
                  <li>• Dashboard layout preferences</li>
                  <li>• Notification settings</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Third-Party Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Some cookies are placed by third-party services that appear on our pages. We carefully select these partners 
              and ensure they comply with privacy regulations.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">Current Third-Party Services:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-yellow-800">Payment Processing</h4>
                  <ul className="text-yellow-700 text-sm space-y-1 mt-1">
                    <li>• Razorpay (secure payment processing)</li>
                    <li>• Stripe (international payments)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-800">Security & Performance</h4>
                  <ul className="text-yellow-700 text-sm space-y-1 mt-1">
                    <li>• Cloudflare (CDN and security)</li>
                    <li>• Sentry (error monitoring)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Managing Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Managing Your Cookie Preferences</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 On Our Website</h3>
            <p className="text-gray-700 mb-4">
              Use the cookie preference panel at the top of this page to control which types of cookies you accept. 
              Your choices are stored locally and will be remembered for future visits.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Browser Settings</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                You can also control cookies through your browser settings. Here's how to manage cookies in popular browsers:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Desktop Browsers:</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• <strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                    <li>• <strong>Firefox:</strong> Preferences → Privacy & Security</li>
                    <li>• <strong>Safari:</strong> Preferences → Privacy</li>
                    <li>• <strong>Edge:</strong> Settings → Cookies and site permissions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Mobile Browsers:</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• <strong>iOS Safari:</strong> Settings → Safari → Privacy</li>
                    <li>• <strong>Android Chrome:</strong> Menu → Settings → Site settings</li>
                    <li>• <strong>Mobile Firefox:</strong> Menu → Settings → Privacy</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Impact of Disabling Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Impact of Disabling Cookies</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start">
                <X className="w-5 h-5 text-red-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-2">Disabling cookies may affect:</h3>
                  <ul className="text-red-700 text-sm space-y-1">
                    <li>• Your ability to log in and stay logged in</li>
                    <li>• Shopping cart functionality</li>
                    <li>• Personalized content and recommendations</li>
                    <li>• Form auto-completion and saved preferences</li>
                    <li>• Some interactive features and tools</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Updates to Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Updates to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in technology, law, or our practices. 
              When we make significant changes, we will notify you through our website or by email.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Us</h2>
            <div className="bg-makrx-blue/10 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                If you have questions about our use of cookies or this policy, please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-makrx-blue mb-2">Privacy Team</h3>
                  <p className="text-gray-700 text-sm">
                    Email: <a href="mailto:privacy@makrx.org" className="text-makrx-blue underline">privacy@makrx.org</a><br />
                    Phone: +91-80-XXXX-XXXX
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-makrx-blue mb-2">Related Policies</h3>
                  <div className="text-sm space-y-1">
                    <Link to="/privacy" className="text-makrx-blue underline block">Privacy Policy</Link>
                    <Link to="/terms" className="text-makrx-blue underline block">Terms of Service</Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-makrx-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to MakrX
          </Link>
        </div>
      </div>
    </div>
  );
}
