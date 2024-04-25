import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NFTCred",
  description: "A Dapp for lending and borrowing with collateral NFT.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <header><Navbar /></header>
        {children}
      <footer className="py-4 text-center bg-gray-200 dark:bg-gray-800 fixed bottom-0 left-0 w-full"><Footer /></footer>
      </body>
    </html>
  );
}
