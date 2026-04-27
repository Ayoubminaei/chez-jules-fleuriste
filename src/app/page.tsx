import { Hero } from "@/components/sections/Hero";
import { ValueBar } from "@/components/sections/ValueBar";
import { Collections } from "@/components/sections/Collections";
import { Popular } from "@/components/sections/Popular";
import { Story } from "@/components/sections/Story";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTA } from "@/components/sections/CTA";

export default function Page() {
  return (
    <>
      <Hero />
      <ValueBar />
      <Collections />
      <Popular />
      <Story />
      <Testimonials />
      <CTA />
    </>
  );
}
