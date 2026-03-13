import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Provider } from "@/Provider";

export const metadata: Metadata = {
  title: "FreshCart | 30 Minutes Grocery Delivery",
  description: "Get fresh fruits, vegetables, dairy & more delivered in 30 minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full min-h-screen bg-green-50 antialiased">
        <Provider>
          {children}
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
                iconTheme: {
                  primary: "#16a34a",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </Provider>
      </body>
    </html>
  );
}