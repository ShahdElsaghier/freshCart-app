import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./_components/Navbar/Navbar";
import "../../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import { Toaster } from "@/components/ui/sonner"; 
import { AuthProvider } from "../../context/AuthContext"; 
import { CartProvider } from "../../context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FreshCart App",
  description: "FreshCart E-commerce App",
  icons: {
    icon: "/shopping-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Wrap the app with Auth and Cart providers */}
        <AuthProvider>
          <CartProvider>
            {/* Navbar */}
            <Navbar />

            {/* Page content */}
            {children}

            {/* Toaster for notifications */}
            <Toaster position="top-center" richColors />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}