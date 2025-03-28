import { AuthProvider } from "@/lib/auth/provider";
import { Navbar } from "@/components/layout/Navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Spendify | Master Your Money, Unlock Your Future",
  description: "Spendify is a personal financial management system that helps you track expenses, categorize transactions, generate reports, and gain financial insights.",
  keywords: "finance, budget, expense tracking, money management, financial insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased vsc-initialized`}>
        <AuthProvider>
          <Navbar />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
