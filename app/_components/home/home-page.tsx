import { AvailabilitySection } from "@/app/_components/home/availability-section";
import { ContactSection } from "@/app/_components/home/contact-section";
import { ExperienceSection } from "@/app/_components/home/experience-section";
import { FeaturesSection } from "@/app/_components/home/features-section";
import { HeroSection } from "@/app/_components/home/hero-section";
import { MetricsSection } from "@/app/_components/home/metrics-section";
import { ProjectsSection } from "@/app/_components/home/projects-section";
import { SkillsSection } from "@/app/_components/home/skills-section";
import { WelcomeIntro } from "@/app/_components/home/welcome-intro";
import { Firefly } from "@/app/_components/firefly";
import { SiteHeader } from "@/app/_components/site-header";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-background">
      <WelcomeIntro />
      <SiteHeader />
      <HeroSection />
      <MetricsSection />
      <FeaturesSection />
      <ProjectsSection />
      <ExperienceSection />
      <SkillsSection />
      <AvailabilitySection />
      <ContactSection />
      <Firefly />
    </main>
  );
}
