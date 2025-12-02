'use client';

import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SalesGrid from "@/components/SalesGrid";
import EmailSignup from "@/components/EmailSignup";
import Footer from "@/components/Footer";
import ScrollingBanner from "@/components/ScrollingBanner";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={setSearchQuery} />
      <main>
        <Hero />
        <ScrollingBanner />
        <SalesGrid searchQuery={searchQuery} />
        <EmailSignup />
      </main>
      <Footer />
    </div>
  );
}
