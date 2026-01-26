import Footer from "../layout/Footer";
import ContactSection from "@/components/ContactSection";
import HeroFeaturedTower from "@/components/HeroFeaturedTower";
import HeaderDesign from "@/layout/Header";

export default function Index() {
  return (
    <main className="bg-white/10">
      <HeaderDesign />
      <HeroFeaturedTower />
      <ContactSection />
      <Footer />
    </main>
  );
}
