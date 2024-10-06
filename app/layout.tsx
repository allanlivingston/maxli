import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Import the global stylesheet
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OnPoint Batteries",
  description: "Eco-friendly power solutions for your adventures",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
