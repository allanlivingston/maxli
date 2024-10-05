import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Import the global stylesheet

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OnPoint Batteries",
  description: "Eco-friendly power solutions for your adventures",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
