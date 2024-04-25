// Import necessary components and hooks
import Header from "./components/Navbar";
import Footer from "./components/Footer";
import { Inter } from "next/font/google";
import "./globals.css";

// Define and load the Inter font
const inter = Inter({ subsets: ["latin"] });

// Functional component for RootLayout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <Header />
      <body className={inter.className}>{children}</body>
      <Footer />
    </html>
  );
}