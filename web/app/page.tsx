import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Hero from "@/components/sections/hero";
import Install from "@/components/sections/install";
import HowItWorks from "@/components/sections/features";

export default function Home() {
  return (
    <main>
      <Navbar />
      <div className="pt-24">
        <Hero />
        <HowItWorks />
        <Install />
      </div>
      <Footer />
    </main>
  );
}