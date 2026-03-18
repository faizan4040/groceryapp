import React from 'react'

const AdminDashboard = () => {
  return (
    <div>
      
    </div>
  )
}

export default AdminDashboard





// 'use client'

// import React, { useState } from "react";
// import { Menu, X, Home, Users, Settings, LogOut } from "lucide-react";

// const AdminDashboard = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="min-h-screen bg-gray-100">

//       {/* NAVBAR */}
//       <nav className="w-[95%] fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-white shadow-lg rounded-2xl px-4 md:px-6 py-2.5 md:py-3">
//         <div className="flex items-center justify-between gap-3">

//           {/* LEFT */}
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setSidebarOpen(true)}
//               className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100"
//             >
//               <Menu size={20} />
//             </button>

//             <h1 className="font-bold text-lg">Admin Panel</h1>
//           </div>

//           {/* RIGHT */}
//           <div className="flex items-center gap-3">
//             <img
//               src="https://i.pravatar.cc/40"
//               className="w-9 h-9 rounded-full"
//             />
//           </div>
//         </div>
//       </nav>

//       {/* LAYOUT */}
//       <div className="flex pt-24 px-3 md:px-6 gap-4">

//         {/* SIDEBAR */}
//         <aside
//           className={`fixed md:static top-20 left-3 md:left-0 z-40 w-64 bg-white rounded-2xl shadow-lg p-4 transition-transform duration-300 ${
//             sidebarOpen ? "translate-x-0" : "-translate-x-[110%] md:translate-x-0"
//           }`}
//         >
//           <div className="flex justify-between items-center mb-4 md:hidden">
//             <h2 className="font-semibold">Menu</h2>
//             <button onClick={() => setSidebarOpen(false)}>
//               <X />
//             </button>
//           </div>

//           <nav className="space-y-2">
//             <SidebarItem icon={<Home />} label="Dashboard" />
//             <SidebarItem icon={<Users />} label="Users" />
//             <SidebarItem icon={<Settings />} label="Settings" />
//             <SidebarItem icon={<LogOut />} label="Logout" />
//           </nav>
//         </aside>

//         {/* MAIN */}
//         <main className="flex-1">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             <Card title="Total Users" value="1,245" />
//             <Card title="Revenue" value="$12,340" />
//             <Card title="Orders" value="320" />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// const SidebarItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
//   <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 cursor-pointer">
//     {icon}
//     <span>{label}</span>
//   </div>
// );

// const Card = ({ title, value }: { title: string; value: string }) => (
//   <div className="bg-white p-5 rounded-2xl shadow">
//     <h3 className="text-gray-500 text-sm">{title}</h3>
//     <p className="text-2xl font-bold mt-2">{value}</p>
//   </div>
// );

// export default AdminDashboard;
