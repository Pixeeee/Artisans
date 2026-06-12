import { MainNav } from "@/components/main-nav";
import { AboutCtaFaq } from "@/components/about-cta-faq";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050816] pt-24 text-white">
      <MainNav />
      <AboutCtaFaq />
    </main>
  );
}
