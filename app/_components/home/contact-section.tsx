import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/app/_components/home/section-heading";
import { Button } from "@/components/ui/button";
import { MotionAccent, Reveal } from "@/components/home/motion";
import { contactLinks } from "@/lib/home-content";

export function ContactSection() {
  return (
    <section id="contact" className="px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal className="rounded-[calc(var(--radius)*2)] border border-border/60 bg-card px-6 py-10 shadow-[var(--shadow-soft)] sm:px-10">
          <SectionHeading
            eyebrow="Contact"
            title="Have a product idea, platform challenge, or team that needs momentum?"
            description="If you’re looking for a developer who can build, improve, or help guide a product team, I’d be happy to connect."
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <MotionAccent>
              <Button asChild size="lg" className="h-12 rounded-full px-6">
                <Link href="mailto:sokritha.yen@gmail.com">
                  Say hello
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </MotionAccent>
            {contactLinks.map((link) => (
              <MotionAccent key={link.label}>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-border/70 px-6"
                >
                  <Link
                    href={link.href}
                    target={link.href.startsWith("/") ? "_blank" : undefined}
                  >
                    {link.label}
                  </Link>
                </Button>
              </MotionAccent>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
