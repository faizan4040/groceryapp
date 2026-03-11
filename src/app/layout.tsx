// 'use client'
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Provider } from "@/Provider";


export const metadata: Metadata = {
  title: "FreshCart | 30 minutes grocery Delivery",
  description: "30 minutes grocery Delivery App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full min-h-screen bg-linear-to-b from-green-200 to-white">
        <Provider>
         {children}
        </Provider>
         <Toaster position="top-right" />
      </body>
    </html>
  );
}
