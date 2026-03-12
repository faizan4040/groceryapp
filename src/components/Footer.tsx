'use client'

import { ShoppingCart } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-black/10 mt-24">

      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* BRAND */}
          <div>

            <div className="flex items-center gap-3 mb-5">

              <div className="bg-green-500 w-10 h-10 flex items-center justify-center rounded-lg">
                <span className="text-white"><ShoppingCart/></span>
              </div>

              <h2 className="text-xl text-gray-900 font-bold ">
                Fresh<span className="text-green-600 text-xl font-bold">Cart</span>
              </h2>

            </div>

            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Fresh groceries directly from local farms delivered
              straight to your door with quality and care.
            </p>

            {/* SOCIAL */}
            <div className="flex gap-3 mt-6">

              {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map((Icon, i) => (

                <div
                  key={i}
                  className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-100 text-gray-600 hover:bg-green-500 hover:text-white transition duration-300 cursor-pointer"
                >
                  <Icon size={14} />
                </div>

              ))}

            </div>

          </div>

          {/* COMPANY */}
          <div>

            <h3 className="text-gray-900 font-semibold mb-5">
              Company
            </h3>

            <ul className="space-y-3 text-sm text-gray-500">

              {["About Us","Our Farmers","Sustainability","Careers","Blog"].map((item,i)=>(
                <li
                  key={i}
                  className="hover:text-green-600 cursor-pointer transition"
                >
                  {item}
                </li>
              ))}

            </ul>

          </div>

          {/* CUSTOMER SERVICE */}
          <div>

            <h3 className="text-gray-900 font-semibold mb-5">
              Customer Service
            </h3>

            <ul className="space-y-3 text-sm text-gray-500">

              {[
                "Contact Us",
                "Shipping Policy",
                "Refund & Returns",
                "FAQs",
                "Store Locator"
              ].map((item,i)=>(
                <li
                  key={i}
                  className="hover:text-green-600 cursor-pointer transition"
                >
                  {item}
                </li>
              ))}

            </ul>

          </div>

          {/* CONTACT */}
          <div>

            <h3 className="text-gray-900 font-semibold mb-5">
              Contact
            </h3>

            <div className="space-y-4 text-sm text-gray-500">

              <div className="flex items-start gap-3">

                <FiMapPin className="text-green-600 mt-1" />

                <p>
                  123 Fresh Way, Organic Valley,
                  CA 94103, USA
                </p>

              </div>

              <div className="flex items-center gap-3">

                <FiPhone className="text-green-600" />

                <p>+1 (555) 123-4567</p>

              </div>

              <div className="flex items-center gap-3">

                <FiMail className="text-green-600" />

                <p>support@freshcart.com</p>

              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM */}
        <div className="mt-16 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">

          <p>
            © {new Date().getFullYear()} FreshCart. All rights reserved.
          </p>

          <div className="flex gap-3">

            <div className="w-9 h-5 bg-gray-200 rounded"></div>
            <div className="w-9 h-5 bg-gray-200 rounded"></div>
            <div className="w-9 h-5 bg-gray-200 rounded"></div>
            <div className="w-9 h-5 bg-gray-200 rounded"></div>

          </div>

        </div>

      </div>

    </footer>
  )
}