"use client";

import Navbar from "../Navbar";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children, user }: any) => {
  return (
    <>
      {/* Navbar TOP */}
      <Navbar user={user} />

      {/* BELOW NAVBAR */}
      <div className="mt-16 flex flex-col md:flex-row">

        {/* Sidebar */}
        <div className="w-full md:w-64">
          <AdminSidebar />
        </div>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 bg-gray-50 min-h-screen">
          {children}
        </main>

      </div>
    </>
  );
};

export default AdminLayout;