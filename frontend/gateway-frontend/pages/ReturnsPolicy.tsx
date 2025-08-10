import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { RotateCcw, Package, Clock, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

export default function ReturnsPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Returns & Refund Policy | MakrX - Easy Returns Process</title>
        <meta name="description" content="MakrX Returns and Refund Policy - Learn about our simple returns process, refund timelines, and customer protection policies." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-br from-makrx-blue to-blue-800 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <RotateCcw className="w-16 h-16 text-makrx-yellow" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Returns & Refund Policy
          </h1>
          <p className="text-xl text-white/90 mb-6">
            Simple returns and customer-friendly refund process
          </p>
          <p className="text-white/80">
            Last updated: January 20, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Quick Summary */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Quick Summary
          </h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-green-800 mb-2">Return Window:</h3>
              <ul className="text-green-700 space-y-1">
                <li>• Physical products: 30 days</li>
                <li>• Digital services: 7 days</li>
                <li>• Custom orders: Case-by-case</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-800 mb-2">Refund Timeline:</h3>
              <ul className="text-green-700 space-y-1">
                <li>• UPI/Cards: 3-5 business days</li>
                <li>• Bank transfer: 5-7 business days</li>
                <li>• Wallet credit: Instant</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-800 mb-2">Easy Process:</h3>
              <ul className="text-green-700 space-y-1">
                <li>• Request online or contact support</li>
                <li>• Free return shipping (in most cases)</li>
                <li>• No questions asked for defects</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to Customer Satisfaction</h2>
            <p className="text-gray-700 leading-relaxed">
              At MakrX, we believe in building long-term relationships with our maker community. 
              Our returns and refund policy is designed to be fair, transparent, and customer-friendly, 
              ensuring you can shop with confidence and focus on creating amazing projects.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-blue-800 text-sm">
                <strong>Customer Protection:</strong> This policy complies with the Consumer Protection Act, 2019, 
                and provides additional protections beyond legal requirements.
              </p>
            </div>
          </section>

          {/* Return Eligibility */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Package className="w-6 h-6 mr-2 text-makrx-blue" />
              Return Eligibility
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">What Can Be Returned</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-green-800 mb-3">Eligible for Return:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• <strong>Physical Products:</strong> Tools, materials, kits, electronics</li>
                  <li>• <strong>Unused Items:</strong> In original packaging with all accessories</li>
                  <li>• <strong>Defective Products:</strong> Manufacturing defects or damage during shipping</li>
                  <li>• <strong>Wrong Items:</strong> If we sent the incorrect product</li>
                </ul>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• <strong>Subscription Services:</strong> Within cooling-off period</li>
                  <li>• <strong>Digital Downloads:</strong> If not downloaded or corrupted</li>
                  <li>• <strong>Custom 3D Prints:</strong> If not matching specifications</li>
                  <li>• <strong>Makerspace Access:</strong> Unused bookings</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">What Cannot Be Returned</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h4 className="font-semibold text-red-800 mb-3">Non-Returnable Items:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• <strong>Used Consumables:</strong> Filaments, chemicals, adhesives (once opened)</li>
                  <li>• <strong>Custom Design Files:</strong> Personalized or custom-created digital content</li>
                  <li>• <strong>Gift Cards:</strong> Digital gift cards and store credits</li>
                  <li>• <strong>Safety Equipment:</strong> Used safety gear for hygiene reasons</li>
                </ul>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• <strong>Completed Services:</strong> Finished 3D printing, laser cutting jobs</li>
                  <li>• <strong>Downloaded Software:</strong> Digital products that have been accessed</li>
                  <li>• <strong>Perishable Materials:</strong> Time-sensitive or degradable items</li>
                  <li>• <strong>Final Sale Items:</strong> Clearance products marked as final sale</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Return Process */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Return Items</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-makrx-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-makrx-blue font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Request Return</h3>
                <p className="text-gray-600 text-sm">
                  Log into your account or contact support to initiate a return request
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-makrx-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-makrx-blue font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Package & Ship</h3>
                <p className="text-gray-600 text-sm">
                  Pack items securely and use our prepaid return label
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-makrx-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-makrx-blue font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Get Refund</h3>
                <p className="text-gray-600 text-sm">
                  Receive your refund once we process the returned item
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Return Request Information</h3>
              <p className="text-blue-700 text-sm mb-3">When requesting a return, please provide:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Order number and purchase date</li>
                  <li>• Reason for return (defect, wrong item, etc.)</li>
                  <li>• Photos (if reporting defect or damage)</li>
                </ul>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Preferred refund method</li>
                  <li>• Return shipping address (if different)</li>
                  <li>• Any special handling requirements</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Refund Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <CreditCard className="w-6 h-6 mr-2 text-makrx-blue" />
              Refund Process & Timeline
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Refund Methods</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-semibold text-green-800 mb-3">Original Payment Method</h4>
                <ul className="text-green-700 text-sm space-y-2">
                  <li>• <strong>Credit/Debit Cards:</strong> 3-5 business days</li>
                  <li>• <strong>UPI Payments:</strong> 1-3 business days</li>
                  <li>• <strong>Net Banking:</strong> 5-7 business days</li>
                  <li>• <strong>Wallets:</strong> 1-2 business days</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-800 mb-3">Alternative Options</h4>
                <ul className="text-blue-700 text-sm space-y-2">
                  <li>• <strong>MakrX Wallet Credit:</strong> Instant (+ 5% bonus)</li>
                  <li>• <strong>Store Credit:</strong> Instant, never expires</li>
                  <li>• <strong>Exchange:</strong> Ship replacement immediately</li>
                  <li>• <strong>Donation:</strong> Tax-deductible maker education</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Refund Calculation</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">Full Refund Includes:</h4>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• Product cost</li>
                    <li>• Original shipping charges (if item defective)</li>
                    <li>• Applicable taxes and fees</li>
                    <li>• Return shipping (for defects/errors)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">Deductions May Apply:</h4>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• Return shipping (customer convenience)</li>
                    <li>• Restocking fee (opened software/custom items)</li>
                    <li>• Usage charges (partial service consumption)</li>
                    <li>• Payment processing fees (international cards)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Special Cases */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Special Return Cases</h2>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
                  Custom Orders & 3D Printing
                </h3>
                <div className="text-gray-700 text-sm space-y-2">
                  <p><strong>Custom 3D Prints:</strong> Returns accepted if print quality doesn't match specifications or contains defects.</p>
                  <p><strong>Custom Design Work:</strong> 50% refund available within 48 hours if project requirements change significantly.</p>
                  <p><strong>Bulk Orders:</strong> Partial returns accepted for unused quantities, minimum 25% restocking fee applies.</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Clock className="w-5 h-5 text-blue-500 mr-2" />
                  Subscriptions & Memberships
                </h3>
                <div className="text-gray-700 text-sm space-y-2">
                  <p><strong>Makerspace Memberships:</strong> Pro-rated refunds for unused time, cancellation anytime.</p>
                  <p><strong>Learning Subscriptions:</strong> 30-day money-back guarantee, access continues until refund processed.</p>
                  <p><strong>Service Credits:</strong> Unused credits refundable within 12 months of purchase.</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Package className="w-5 h-5 text-purple-500 mr-2" />
                  Damaged or Defective Items
                </h3>
                <div className="text-gray-700 text-sm space-y-2">
                  <p><strong>Shipping Damage:</strong> Full refund or replacement, return shipping at our expense.</p>
                  <p><strong>Manufacturing Defects:</strong> Extended return window (90 days), choice of repair/replace/refund.</p>
                  <p><strong>DOA (Dead on Arrival):</strong> Immediate replacement shipped, no need to return defective item first.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Customer Protection */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Consumer Rights</h2>
            
            <div className="bg-makrx-blue/10 border border-makrx-blue/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-makrx-blue mb-4">Under Indian Consumer Protection Act, 2019</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-makrx-blue mb-2">Your Rights Include:</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Right to be informed about product quality and standards</li>
                    <li>• Right to seek redressal against unfair trade practices</li>
                    <li>• Right to be heard and assured of fair treatment</li>
                    <li>• Right to consumer education and awareness</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-makrx-blue mb-2">Grievance Redressal:</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Internal resolution within 7 days</li>
                    <li>• Escalation to District Consumer Forum</li>
                    <li>• State Consumer Disputes Redressal Commission</li>
                    <li>• National Consumer Disputes Redressal Commission</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Returns Support</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-3">Customer Support</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Email:</strong> <a href="mailto:returns@makrx.org" className="text-makrx-blue underline">returns@makrx.org</a></p>
                  <p><strong>Phone:</strong> +91-80-4567-8900</p>
                  <p><strong>WhatsApp:</strong> +91-98765-43210</p>
                  <p><strong>Hours:</strong> Monday-Saturday, 9 AM-7 PM IST</p>
                  <p><strong>Average Response:</strong> Within 4 hours</p>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-3">Return Address</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>MakrX Returns Center</strong></p>
                  <p>Botness Technologies Pvt Ltd</p>
                  <p>Plot No. 123, Tech Park</p>
                  <p>Electronic City, Phase 2</p>
                  <p>Bangalore, Karnataka 560100</p>
                  <p><strong>Landmark:</strong> Near Metro Station</p>
                </div>
              </div>
            </div>
          </section>

          {/* Policy Updates */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Policy Updates</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Returns & Refund Policy to reflect changes in our practices or legal requirements. 
              Significant changes will be communicated via email and website notifications. 
              Your continued use of our services after changes constitutes acceptance of the updated policy.
            </p>
          </section>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-100 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Need to Return Something?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="inline-flex items-center px-6 py-3 bg-makrx-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Return Request
            </Link>
            <Link 
              to="/support" 
              className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-makrx-yellow text-makrx-blue rounded-lg hover:bg-yellow-300 transition-colors"
          >
            ← Back to MakrX
          </Link>
        </div>
      </div>
    </div>
  );
}
