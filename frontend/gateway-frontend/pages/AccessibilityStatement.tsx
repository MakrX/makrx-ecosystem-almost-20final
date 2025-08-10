import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Eye, Keyboard, Volume2, Monitor, Heart, Mail } from 'lucide-react';

export default function AccessibilityStatement() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Accessibility Statement | MakrX - Committed to Digital Inclusion</title>
        <meta name="description" content="MakrX Accessibility Statement - Our commitment to making our platform accessible to everyone, including people with disabilities." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-br from-makrx-blue to-blue-800 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <Heart className="w-16 h-16 text-makrx-yellow" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Accessibility Statement
          </h1>
          <p className="text-xl text-white/90 mb-6">
            Our commitment to digital inclusion and accessibility
          </p>
          <p className="text-white/80">
            Last updated: January 20, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Quick Access */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Quick Access</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Accessibility Features:</h3>
              <ul className="text-blue-700 space-y-1">
                <li>• Skip navigation links</li>
                <li>• Keyboard navigation support</li>
                <li>• Screen reader optimization</li>
                <li>• High contrast color schemes</li>
                <li>• Resizable text and UI elements</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Need Help?</h3>
              <ul className="text-blue-700 space-y-1">
                <li>• Email: <a href="mailto:accessibility@makrx.org" className="underline">accessibility@makrx.org</a></li>
                <li>• Phone: +91-80-XXXX-XXXX</li>
                <li>• Available: Monday-Friday, 9 AM-6 PM IST</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          {/* Our Commitment */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to Accessibility</h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>Botness Technologies Pvt Ltd</strong> is committed to ensuring that our MakrX platform is accessible 
              to everyone, including people with disabilities. We believe that digital inclusion is not just a legal requirement 
              but a fundamental aspect of creating an equitable maker ecosystem.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We are continuously working to improve the accessibility of our platform and strive to adhere to the 
              <strong> Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> standards.
            </p>
          </section>

          {/* Accessibility Features */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Accessibility Features</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Keyboard className="w-6 h-6 text-makrx-blue mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">Keyboard Navigation</h3>
                </div>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Full keyboard navigation support</li>
                  <li>• Visible focus indicators</li>
                  <li>• Skip links to main content</li>
                  <li>• Logical tab order throughout</li>
                  <li>• Standard keyboard shortcuts</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Eye className="w-6 h-6 text-makrx-blue mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">Visual Accessibility</h3>
                </div>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• High contrast color schemes</li>
                  <li>• Scalable text up to 200%</li>
                  <li>• Alternative text for images</li>
                  <li>• Color is not the only visual cue</li>
                  <li>• Dark and light theme options</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Volume2 className="w-6 h-6 text-makrx-blue mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">Screen Reader Support</h3>
                </div>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Semantic HTML structure</li>
                  <li>• ARIA labels and descriptions</li>
                  <li>• Heading hierarchy (H1-H6)</li>
                  <li>• Form labels and instructions</li>
                  <li>• Live region announcements</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Monitor className="w-6 h-6 text-makrx-blue mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">Device Compatibility</h3>
                </div>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Mobile and tablet optimized</li>
                  <li>• Responsive design principles</li>
                  <li>• Touch-friendly interface</li>
                  <li>• Works with assistive technologies</li>
                  <li>• Cross-browser compatibility</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Standards Compliance */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Standards and Guidelines</h2>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">We Follow These Standards:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• <strong>WCAG 2.1 Level AA:</strong> International web accessibility standard</li>
                  <li>• <strong>Section 508:</strong> US federal accessibility requirements</li>
                  <li>• <strong>EN 301 549:</strong> European accessibility standard</li>
                </ul>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• <strong>ARIA 1.2:</strong> Accessible Rich Internet Applications</li>
                  <li>• <strong>HTML5 Semantic:</strong> Proper document structure</li>
                  <li>• <strong>Rights of PWD Act:</strong> Indian accessibility compliance</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Current Compliance Status</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>Status:</strong> We are actively working toward full WCAG 2.1 AA compliance. 
                While we have implemented many accessibility features, we recognize there may be areas for improvement 
                and welcome feedback to help us enhance accessibility.
              </p>
            </div>
          </section>

          {/* Known Issues */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Known Accessibility Issues</h2>
            <p className="text-gray-700 mb-4">
              We are aware of the following accessibility challenges and are actively working to address them:
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-3">Currently Being Improved:</h3>
              <ul className="text-red-700 text-sm space-y-2">
                <li>• <strong>Complex Data Visualizations:</strong> Some charts and graphs may not be fully accessible to screen readers. We provide alternative data formats and are implementing better ARIA descriptions.</li>
                <li>• <strong>Third-Party Content:</strong> Some embedded content from partner makerspaces may not meet our accessibility standards. We are working with partners to improve this.</li>
                <li>• <strong>File Upload Interactions:</strong> The drag-and-drop file upload interface is being enhanced for better keyboard and screen reader support.</li>
                <li>• <strong>Real-Time Notifications:</strong> Live notifications are being improved for better screen reader announcements.</li>
              </ul>
              <p className="text-red-700 text-sm mt-4">
                <strong>Timeline:</strong> We aim to address these issues within the next 6 months and will update this statement as improvements are made.
              </p>
            </div>
          </section>

          {/* How to Use Accessibility Features */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use Our Accessibility Features</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Keyboard Navigation</h3>
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Common Shortcuts:</h4>
                  <ul className="text-blue-700 space-y-1">
                    <li>• <kbd className="bg-blue-200 px-2 py-1 rounded text-xs">Tab</kbd> - Move to next element</li>
                    <li>• <kbd className="bg-blue-200 px-2 py-1 rounded text-xs">Shift + Tab</kbd> - Move to previous element</li>
                    <li>• <kbd className="bg-blue-200 px-2 py-1 rounded text-xs">Enter</kbd> - Activate buttons/links</li>
                    <li>• <kbd className="bg-blue-200 px-2 py-1 rounded text-xs">Space</kbd> - Check boxes, activate buttons</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Navigation:</h4>
                  <ul className="text-blue-700 space-y-1">
                    <li>• <kbd className="bg-blue-200 px-2 py-1 rounded text-xs">Alt + S</kbd> - Skip to main content</li>
                    <li>• <kbd className="bg-blue-200 px-2 py-1 rounded text-xs">Arrow Keys</kbd> - Navigate menus</li>
                    <li>• <kbd className="bg-blue-200 px-2 py-1 rounded text-xs">Esc</kbd> - Close dialogs/menus</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Screen Reader Tips</h3>
            <div className="bg-purple-50 rounded-lg p-4 mb-4">
              <p className="text-purple-800 text-sm mb-2">
                <strong>Tested with:</strong> NVDA, JAWS, VoiceOver, and TalkBack
              </p>
              <ul className="text-purple-700 text-sm space-y-1">
                <li>• Use heading navigation to quickly move between sections</li>
                <li>• Form fields have descriptive labels and instructions</li>
                <li>• Error messages are announced clearly</li>
                <li>• Dynamic content changes are announced via live regions</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Visual Adjustments</h3>
            <div className="bg-green-50 rounded-lg p-4">
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Use your browser's zoom function to increase text size up to 200%</li>
                <li>• Toggle between light and dark themes using the theme switcher</li>
                <li>• High contrast mode is supported in Windows and macOS</li>
                <li>• Reduce motion preferences are respected for animations</li>
              </ul>
            </div>
          </section>

          {/* Feedback and Support */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Feedback and Support</h2>
            
            <div className="bg-makrx-blue/10 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-makrx-blue mb-3">We Want to Hear From You</h3>
              <p className="text-gray-700 mb-4">
                Your feedback is crucial in helping us improve accessibility. If you encounter any barriers 
                or have suggestions for improvement, please don't hesitate to contact us.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-makrx-blue mb-2">Accessibility Team</h4>
                  <div className="text-gray-700 text-sm space-y-1">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      <a href="mailto:accessibility@makrx.org" className="text-makrx-blue underline">accessibility@makrx.org</a>
                    </div>
                    <p>Phone: +91-80-4567-8900</p>
                    <p>Available: Monday-Friday, 9 AM-6 PM IST</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-makrx-blue mb-2">What to Include</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Description of the issue</li>
                    <li>• Page URL where you encountered the problem</li>
                    <li>• Assistive technology you're using</li>
                    <li>• Browser and operating system</li>
                    <li>• Any error messages received</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Response Time</h3>
            <p className="text-gray-700">
              We aim to respond to accessibility-related inquiries within <strong>2 business days</strong>. 
              For urgent accessibility issues that prevent you from using critical features, 
              we will prioritize and respond within <strong>24 hours</strong>.
            </p>
          </section>

          {/* Alternative Formats */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Alternative Formats</h2>
            <p className="text-gray-700 mb-4">
              If you need information from our website in an alternative format, we can provide:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Available Formats:</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Large print documents</li>
                  <li>• Audio recordings</li>
                  <li>• Plain text versions</li>
                  <li>• Screen reader optimized PDFs</li>
                  <li>• Braille (upon request)</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Request Process:</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Email us with your specific needs</li>
                  <li>• Allow 3-5 business days for preparation</li>
                  <li>• Formats are provided at no additional cost</li>
                  <li>• Available for policies, guides, and key content</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Third-Party Content */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Content and Services</h2>
            <p className="text-gray-700 mb-4">
              Our platform integrates with various third-party services and partner makerspaces. 
              While we encourage all partners to maintain accessible practices, we cannot guarantee 
              the accessibility of all third-party content.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>If you encounter accessibility issues with third-party content:</strong> Please contact us, 
                and we will work with our partners to address the issue or provide alternative access methods.
              </p>
            </div>
          </section>

          {/* Updates to This Statement */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Statement</h2>
            <p className="text-gray-700 leading-relaxed">
              We review and update this accessibility statement regularly to reflect our ongoing improvements 
              and ensure it remains accurate. Significant changes will be announced through our usual communication channels.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This statement was last reviewed and updated on <strong>January 20, 2025</strong>.
            </p>
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
