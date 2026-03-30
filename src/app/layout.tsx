import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Provider } from "@/Provider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import StoreProvider from "@/redux/StoreProvider";
import { LoaderProvider } from "@/context/LoaderContext";
import InitUser from "@/InitUser";


const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "FreshCart | 30 Minutes Grocery Delivery",
  description: "Get fresh fruits, vegetables, dairy & more delivered in 30 minutes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="w-full min-h-screen bg-green-50 antialiased">
        <LoaderProvider>
          <Provider>
            <TooltipProvider>
              <StoreProvider>
                <InitUser /> {/* ← ADD THIS — must be inside StoreProvider */}
                {children}
              </StoreProvider>

              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    borderRadius: "12px",
                    background: "#fff",
                    color: "#1a1a1a",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
                    fontSize: "14px",
                    fontWeight: 500,
                  },
                  success: {
                    iconTheme: { primary: "#16a34a", secondary: "#fff" },
                  },
                  error: {
                    iconTheme: { primary: "#ef4444", secondary: "#fff" },
                  },
                }}
              />
            </TooltipProvider>
          </Provider>
        </LoaderProvider>
      </body>
    </html>
  );
}








// import type { Metadata } from "next";
// import { Toaster } from "react-hot-toast";
// import "./globals.css";
// import { Provider } from "@/Provider";
// import { Geist } from "next/font/google";
// import { cn } from "@/lib/utils";
// import { TooltipProvider } from "@/components/ui/tooltip"; 
// import StoreProvider from "@/redux/StoreProvider";
// import { LoaderProvider } from "@/context/LoaderContext";

// const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

// export const metadata: Metadata = {
//   title: "FreshCart | 30 Minutes Grocery Delivery",
//   description: "Get fresh fruits, vegetables, dairy & more delivered in 30 minutes.",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" className={cn("font-sans", geist.variable)}>
//       <body className="w-full min-h-screen bg-green-50 antialiased">
//         <LoaderProvider>
          
//         <Provider>
//           <TooltipProvider> 
            
//             <StoreProvider>
//               {children}
//             </StoreProvider>

//             <Toaster
//               position="top-right"
//               toastOptions={{
//                 duration: 3000,
//                 style: {
//                   borderRadius: "12px",
//                   background: "#fff",
//                   color: "#1a1a1a",
//                   boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
//                   fontSize: "14px",
//                   fontWeight: 500,
//                 },
//                 success: {
//                   iconTheme: {
//                     primary: "#16a34a",
//                     secondary: "#fff",
//                   },
//                 },
//                 error: {
//                   iconTheme: {
//                     primary: "#ef4444",
//                     secondary: "#fff",
//                   },
//                 },
//               }}
//             />
//           </TooltipProvider>
//         </Provider>

//         </LoaderProvider>
//       </body>
//     </html>
//   );
// }