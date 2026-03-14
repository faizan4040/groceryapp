import React from "react";
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/user.models";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Herosection from "@/components/Herosection";
import Category from "@/components/Category";
import FeatureProduct from "@/components/FeatureProduct";
import InfoProducts from "@/components/infoProducts";
import BestSeller from "@/components/BestSeller";
import Customer from "@/components/Customer";
import NewsLetter from "@/components/NewsLetter";
import Footer from "@/components/Footer";
import UserDashboard from "@/components/UserDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import DevliveryBoy from "@/components/DevliveryBoy";

interface PageShellProps {
  user?: any;
}

const PageShell: React.FC<PageShellProps> = ({ user }) => {
  const renderDashboard = () => {
    if (!user) return null;
    switch (user.role) {
      case "user":        return <UserDashboard />;
      case "admin":       return <AdminDashboard />;
      case "deliveryBoy": return <DevliveryBoy />;  // was "delivery" — wrong role string
      default:            return null;
    }
  };

  return (
    <div>
      <Navbar user={user} />
      {renderDashboard()}
      <Herosection />
      <Category />
      <FeatureProduct />
      <InfoProducts />
      <BestSeller />
      <Customer />
      <NewsLetter />
      <Footer />
    </div>
  );
};

const Home = async () => {
  const session = await auth();

  // Not logged in → public landing page
  if (!session?.user?.id) {
    return <PageShell />;
  }

  await connectDB();
  const user = await User.findById(session.user.id).lean();

  // User record missing → force re-login
  if (!user) {
    redirect("/login");
  }

  //  FIXED: redirect instead of rendering EditRolemobile inline
  // Rendering inline meant the JWT was never updated after form submit
  // because middleware never saw the /edit-role route
  const isIncomplete = !user.role || !user.mobile;
  if (isIncomplete) {
    redirect("/edit-role");  //  was: return <EditRolemobile />
  }

  return <PageShell user={JSON.parse(JSON.stringify(user))} />;
};

export default Home;













// import React from "react";
// import { auth } from "@/auth";
// import EditRolemobile from "@/components/EditRolemobile";
// import connectDB from "@/lib/db";
// import User from "@/models/user.models";
// import { redirect } from "next/navigation";
// import Navbar from "@/components/Navbar";
// import Herosection from "@/components/Herosection";
// import Category from "@/components/Category";
// import FeatureProduct from "@/components/FeatureProduct";
// import InfoProducts from "@/components/infoProducts";
// import BestSeller from "@/components/BestSeller";
// import Customer from "@/components/Customer";
// import NewsLetter from "@/components/NewsLetter";
// import Footer from "@/components/Footer";
// import UserDashboard from "@/components/UserDashboard";
// import AdminDashboard from "@/components/AdminDashboard";
// import DevliveryBoy from "@/components/DevliveryBoy";

// interface PageShellProps {
//   user?: any;
// }

// const PageShell: React.FC<PageShellProps> = ({ user }) => {
//   const renderDashboard = () => {
//     if (!user) return null;
//     switch (user.role) {
//       case "user":
//         return <UserDashboard />;
//       case "admin":
//         return <AdminDashboard />;
//       case "delivery":
//         return <DevliveryBoy />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div>
//       <Navbar user={user} />
//       {renderDashboard()}
//       <Herosection />
//       <Category />
//       <FeatureProduct />
//       <InfoProducts />
//       <BestSeller />
//       <Customer />
//       <NewsLetter />
//       <Footer />
//     </div>
//   );
// };

// const Home = async () => {
//   const session = await auth();

//   // Not logged in → public landing page
//   if (!session?.user?.id) {
//     return <PageShell />;
//   }

//   // Logged in → fetch user from DB
//   await connectDB();
//   const user = await User.findById(session.user.id).lean();

//   // User record missing → force re-login
//   if (!user) {
//     redirect("/login");
//   }

//   // Check for incomplete profile
//   const isIncomplete = !user.role || !user.mobile;
//   if (isIncomplete) {
//     return <EditRolemobile />;
//   }

//   return <PageShell user={JSON.parse(JSON.stringify(user))} />;
// };

// export default Home;