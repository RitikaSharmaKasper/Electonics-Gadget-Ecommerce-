import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";

function NoSearchResult() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q");

  return (
    <>
      <Navbar />

      <div className="bg-[#F6F8F9] px-4 pt-28 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-sm text-gray-500 mb-10 flex items-center gap-2">
            <Link to="/home" className="font-medium hover:underline">
              Home
            </Link>

            <span>&gt;</span>

            <span className="text-[#1800AC] font-medium">Search</span>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="p-6 md:p-8">
              <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-semibold text-[#7A1F2B] font-stack-sans mb-4">
                  Sorry, no search results found :(
                </h1>

                <p className="text-[#1C1C1C] mb-2">
                  The search term <span className="font-medium">"{query}"</span>{" "}
                  did not return any results.
                </p>

                <p className="text-[#1C1C1C] mb-10">
                  Please try again with a different search result or create a
                  new request regarding your searched product.
                </p>
              </div>

              <div className="max-w-md mx-auto md:mx-0">
                <h2 className="text-xl md:text-2xl font-semibold mb-5">
                  Get in touch with us —
                </h2>

                <p className="text-gray-600 mb-6">
                  Didn’t find the product you’re looking for? Contact us by
                  email or phone — we may be able to help you get it.
                </p>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-5 h-5" />
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=happyartsupplies@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm block text-blue-600"
                    >
                      happyartsupplies@gmail.com
                    </a>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-5 h-5" />
                    <a
                      href="https://wa.me/919886894723"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm block text-blue-600"
                    >
                      (+91) 98868 94723
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default NoSearchResult;
