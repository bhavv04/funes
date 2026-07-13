import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Install from "@/components/sections/Install";
import HowItWorks from "@/components/sections/Features";
import Roadmap from "@/components/sections/Roadmap";

export default function Home() {
  return (
    <main>
        <Navbar />
            <Hero />
            <HowItWorks />
            <Install />
            <Roadmap />
      <Footer />
    </main>
  );
}