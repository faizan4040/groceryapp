"use client";

import axios from "axios";
import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Leaf,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { IMAGES } from "../../../routes/AllImages";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"

type propType = {
  nextStep: (s: number) => void;
};

const Login = ({ nextStep }: propType) => {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {

      setLoading(true);

      const result = await axios.post("/api/auth/login", {
        email,
        password
      });

      toast.success("Login successful");

      console.log(result.data);

      // Save token
      localStorage.setItem("token", result.data.token);

      // Redirect
      router.push("/");

      setEmail("");
      setPassword("");

    } catch (error: any) {

      console.log(error);
      toast.error(
        error?.response?.data?.message || "Login failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full px-4 sm:px-6 lg:px-8 py-10 bg-linear-to-br from-green-50 via-white to-green-100 relative">

      {/* Back Button */}
      <div
        onClick={() => router.back()} // Go back to previous page
        className="absolute top-5 left-4 sm:left-6 flex items-center gap-2 text-green-700 hover:text-green-800 transition cursor-pointer"
      >
        <ArrowLeft size={20} />
        <span className="text-sm sm:text-base">Back</span>
      </div>

      <div className="w-full max-w-md">

        {/* Title */}
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-extrabold text-green-700 text-center mb-2"
        >
          Welcome Back
        </motion.h1>

        <p className="text-gray-600 text-center mb-8 flex items-center justify-center gap-1">
          Login to FreshCart
          <Leaf className="w-5 h-5 text-green-400" />
        </p>

        {/* Form */}
        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-5 bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
        >

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-5 text-gray-400" />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-5 text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-10 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />

            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 cursor-pointer text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          {/* Login Button */}
            <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            type="submit"
            className="bg-green-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
            {loading ? (
                <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Logging in...
                </>
            ) : (
                "Login"
            )}
            </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Google Login */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={()=>signIn("google")}
            className="flex items-center justify-center gap-3 border border-gray-200 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition"
          >
            <Image
              src={IMAGES.Google}
              alt="google"
              width={40}
              height={40}
            />
            Continue with Google
          </motion.button>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-green-600 font-semibold hover:underline"
            >
              Create account
            </Link>
          </p>

        </motion.form>
      </div>
    </div>
  );
};

export default Login;







//new code


// "use client";

// import React, { useState } from "react";
// import { motion } from "motion/react";
// import {
//   Leaf,
//   Mail,
//   Lock,
//   Eye,
//   EyeOff,
//   ArrowLeft,
// } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import toast from "react-hot-toast";
// import { IMAGES } from "../../../routes/AllImages";
// import { useRouter } from "next/navigation";
// import { signIn, getSession } from "next-auth/react";  

// type propType = {
//   nextStep: (s: number) => void;
// };

// // role → dashboard path map
// const dashboardMap: Record<string, string> = {
//   admin:       "/admin",
//   deliveryBoy: "/delivery",
//   user:        "/",
// };

// const Login = ({ nextStep }: propType) => {

//   const router = useRouter();

//   const [email, setEmail]             = useState("");
//   const [password, setPassword]       = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading]         = useState(false);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!email || !password) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     try {
//       setLoading(true);

//       // FIX 1: use next-auth signIn instead of axios
//       // axios was calling a custom /api/auth/login route that
//       // never created a NextAuth session — so getToken() in
//       // middleware always returned null and redirected to /login
//       const result = await signIn("credentials", {
//         email,
//         password,
//         redirect: false,   // handle redirect manually
//       });

//       // FIX 2: check for error from next-auth
//       if (result?.error) {
//         toast.error("Invalid email or password");
//         return;
//       }

//       toast.success("Login successful");

//       // FIX 3: read role from session and redirect to correct dashboard
//       // must call getSession() AFTER signIn() so the cookie is set
//       const session = await getSession();
//       const role    = session?.user?.role;

//       // no role yet (new user) → go complete profile
//       // has role → go to their dashboard
//       router.replace(role ? (dashboardMap[role] ?? "/") : "/edit-role-mobile");

//       setEmail("");
//       setPassword("");

//     } catch (error: any) {
//       console.log(error);
//       toast.error("Login failed");

//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen w-full px-4 sm:px-6 lg:px-8 py-10 bg-linear-to-br from-green-50 via-white to-green-100 relative">

//       {/* Back Button */}
//       <div
//         onClick={() => router.back()}
//         className="absolute top-5 left-4 sm:left-6 flex items-center gap-2 text-green-700 hover:text-green-800 transition cursor-pointer"
//       >
//         <ArrowLeft size={20} />
//         <span className="text-sm sm:text-base">Back</span>
//       </div>

//       <div className="w-full max-w-md">

//         {/* Title */}
//         <motion.h1
//           initial={{ y: 10, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.6 }}
//           className="text-3xl sm:text-4xl font-extrabold text-green-700 text-center mb-2"
//         >
//           Welcome Back
//         </motion.h1>

//         <p className="text-gray-600 text-center mb-8 flex items-center justify-center gap-1">
//           Login to FreshCart
//           <Leaf className="w-5 h-5 text-green-400" />
//         </p>

//         {/* Form */}
//         <motion.form
//           onSubmit={handleLogin}
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="flex flex-col gap-5 bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
//         >

//           {/* Email */}
//           <div className="relative">
//             <Mail className="absolute left-3 top-3.5 w-5 text-gray-400" />
//             <input
//               type="email"
//               placeholder="Email Address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
//             />
//           </div>

//           {/* Password */}
//           <div className="relative">
//             <Lock className="absolute left-3 top-3.5 w-5 text-gray-400" />
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-10 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
//             />
//             <div
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-3.5 cursor-pointer text-gray-400"
//             >
//               {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//             </div>
//           </div>

//           {/* Login Button */}
//           <motion.button
//             whileHover={{ scale: 1.03 }}
//             whileTap={{ scale: 0.97 }}
//             disabled={loading}
//             type="submit"
//             className="bg-green-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
//           >
//             {loading ? (
//               <>
//                 <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                 Logging in...
//               </>
//             ) : (
//               "Login"
//             )}
//           </motion.button>

//           {/* Divider */}
//           <div className="flex items-center gap-3 my-2">
//             <div className="flex-1 h-px bg-gray-200"></div>
//             <span className="text-sm text-gray-400">or</span>
//             <div className="flex-1 h-px bg-gray-200"></div>
//           </div>

//           {/* Google Login */}
//           {/* FIX 4: added callbackUrl so Google login also redirects by role */}
//           {/* middleware handles the role-based redirect after Google OAuth */}
//           <motion.button
//             whileHover={{ scale: 1.03 }}
//             whileTap={{ scale: 0.97 }}
//             type="button"
//             onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
//             className="flex items-center justify-center gap-3 border border-gray-200 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition"
//           >
//             <Image
//               src={IMAGES.Google}
//               alt="google"
//               width={40}
//               height={40}
//             />
//             Continue with Google
//           </motion.button>

//           {/* Register Link */}
//           <p className="text-center text-sm text-gray-600">
//             Don't have an account?{" "}
//             <Link
//               href="/register"
//               className="text-green-600 font-semibold hover:underline"
//             >
//               Create account
//             </Link>
//           </p>

//         </motion.form>
//       </div>
//     </div>
//   );
// };

// export default Login;