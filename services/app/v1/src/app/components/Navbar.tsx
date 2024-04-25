// pages/Header.tsx
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Image
            src="/nftcred-logo.png"
            alt="NFTCred Logo"
            width={220}
            height={52.8}
            priority
          />
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/loans">Get a loan</Link></li>
            <li><Link href="/offers">My Offers</Link></li>
            <li><Link href="/allOffers">All Offers</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
