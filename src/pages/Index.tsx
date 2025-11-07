import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SalesGrid from "@/components/SalesGrid";
import EmailSignup from "@/components/EmailSignup";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <SalesGrid />
        <EmailSignup />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
