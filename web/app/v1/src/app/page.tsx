// @ts-nocheck
"use client";
import React from "react";
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import LoanForm from "./loans/page";
import Offers from "./offers/page";
import useContentState from "./hooks/useContentState";

export default function Home() {
  const { activeContent, handleSetActiveContent } = useContentState();

  const renderContent = () => {
    switch (activeContent) {
      case "loan":
        return <LoanForm />;
      case "offers":
        return <Offers />;
      default:
        return <LoanForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-white to-gray-200 dark:from-gray-800 dark:via-black dark:to-gray-800">
      <Header onSetActiveContent={handleSetActiveContent} />
      {renderContent()}
      <Footer />
    </div>
  );
}
