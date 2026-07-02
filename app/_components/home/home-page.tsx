import { AvailabilitySection } from "@/app/_components/home/availability-section";
import { ContactSection } from "@/app/_components/home/contact-section";
import { ExperienceSection } from "@/app/_components/home/experience-section";
import { FeaturesSection } from "@/app/_components/home/features-section";
import { HeroSection } from "@/app/_components/home/hero-section";
import { ProjectsSection } from "@/app/_components/home/projects-section";
import { SiteNavigation } from "@/app/_components/site-navigation";
import { SkillsSection } from "@/app/_components/home/skills-section";
import { PageTransition } from "@/components/home/motion";

export default function HomePage() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:pl-24">
      <div className="mx-auto max-w-7xl">
        <SiteNavigation active="about" />
        <HeroSection />
        <PageTransition>
          <FeaturesSection />
          <ProjectsSection />
          <ExperienceSection />
          <SkillsSection />
          <AvailabilitySection />
          <ContactSection />
        </PageTransition>
      </div>
    </main>
  );
}
