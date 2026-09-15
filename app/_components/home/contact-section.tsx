import Link from "next/link";

import { SectionRail } from "@/app/_components/home/section-rail";
import { Reveal } from "@/components/home/motion";
import { contactLinks, heroContent } from "@/lib/home-content";

export function ContactSection() {
  const emailLink =
    contactLinks.find((link) => link.label === "Email")?.href ??
    heroContent.primaryCta.href;
  const secondaryLinks = contactLinks.filter((link) => link.label !== "Email");

  return (
    <SectionRail id="contact" label="Contact" className="pb-8">
      <Reveal>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">
            Want to talk about a project?
          </p>
          <a
            href={emailLink}
            className="mt-4 block break-all font-serif text-[1.65rem] font-semibold leading-tight tracking-tight text-foreground underline underline-offset-[6px] decoration-foreground/30 transition-colors hover:decoration-foreground sm:inline-block sm:break-normal sm:text-4xl lg:text-5xl"
          >
            sokritha.dev@gmail.com
          </a>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {secondaryLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={
                  link.href.startsWith("http") || link.href.endsWith(".pdf")
                    ? "_blank"
                    : undefined
                }
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="mt-12 text-xs text-muted-foreground sm:mt-16">
            Yen Sokritha — built with care.
          </p>
        </div>
      </Reveal>
    </SectionRail>
  );
}
