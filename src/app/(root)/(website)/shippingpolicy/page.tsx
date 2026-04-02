import React from 'react';
import { Truck, Clock, Globe, ShieldCheck, AlertCircle } from 'lucide-react';

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Shipping Policy
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: October 2026. Everything you need to know about how we get our products to your door.
          </p>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <Truck className="text-green-600 mb-3" size={32} />
            <h3 className="font-bold">Free Shipping</h3>
            <p className="text-sm text-gray-500">On all orders over $75</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <Clock className="text-green-600 mb-3" size={32} />
            <h3 className="font-bold">Processing Time</h3>
            <p className="text-sm text-gray-500">1-2 Business Days</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <Globe className="text-green-600 mb-3" size={32} />
            <h3 className="font-bold">Global Delivery</h3>
            <p className="text-sm text-gray-500">To over 50 countries</p>
          </div>
        </div>

        {/* Policy Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 space-y-10">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <ShieldCheck className="mr-2 text-green-600" size={24} /> 
              Shipping Methods & Costs
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-4 font-semibold text-gray-600">Method</th>
                    <th className="py-4 font-semibold text-gray-600">Estimated Delivery</th>
                    <th className="py-4 font-semibold text-gray-600">Price</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-50">
                    <td className="py-4">Standard Shipping</td>
                    <td className="py-4">5 - 7 Business Days</td>
                    <td className="py-4 font-medium">$5.00</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-4">Expedited Shipping</td>
                    <td className="py-4">2 - 3 Business Days</td>
                    <td className="py-4 font-medium">$15.00</td>
                  </tr>
                  <tr>
                    <td className="py-4">Overnight Delivery</td>
                    <td className="py-4">Next Business Day</td>
                    <td className="py-4 font-medium">$30.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">International Shipping</h2>
            <p className="leading-relaxed text-gray-600">
              We offer worldwide shipping. Please note that international orders may be subject to 
              import duties and taxes (including VAT), which are incurred once a shipment reaches 
              your destination country. <strong>[Company Name]</strong> is not responsible for 
              these charges if they are applied and are your responsibility as the customer.
            </p>
          </section>

          {/* Section 3 */}
          <section className="bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
            <h2 className="text-xl font-bold mb-2 flex items-center">
              <AlertCircle className="mr-2 text-green-600" size={20} />
              How do I check the status of my order?
            </h2>
            <p className="text-gray-700">
              When your order has shipped, you will receive an email notification from us which 
              will include a tracking number you can use to check its status. Please allow 48 hours 
              for the tracking information to become available.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Refunds, Returns, and Exchanges</h2>
            <p className="leading-relaxed text-gray-600">
              We accept returns up to 30 days after delivery, if the item is unused and in its 
              original condition, and we will refund the full order amount minus the shipping 
              costs for the return. 
            </p>
            <p className="mt-4 text-gray-600">
              In the event that your order arrives damaged in any way, please email us as soon as 
              possible at <span className="text-green-600 font-medium">support@yourbrand.com</span> with 
              your order number and a photo of the item’s condition.
            </p>
          </section>

        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>If you have any further questions, please don't hesitate to contact us at</p>
          <a href="mailto:support@yourbrand.com" className="text-green-600 hover:underline font-medium">
            support@yourbrand.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;