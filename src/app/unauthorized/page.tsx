import React from "react";
import Link from "next/link";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-6">
      
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        Access Denied
      </h1>

      <p className="text-gray-600 mb-6">
        You do not have permission to access this page.
      </p>

      <Link
        href="/"
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Go Back Home
      </Link>

    </div>
  );
};

export default Unauthorized;