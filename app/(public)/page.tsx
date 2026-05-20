import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";
import { Hero } from "@/components/home/hero";
import { FeaturedPackages } from "@/components/home/featured-packages";
import { MenuStoriesPreview } from "@/components/home/menu-stories-preview";
import { TestimonialCarousel } from "@/components/home/testimonial-carousel";
import { CtaSection } from "@/components/home/cta-section";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import type { Package, MenuStory, Testimonial } from "@/types/database";

export const metadata: Metadata = {
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description:
    "Catering Batak otentik untuk acara adat, wedding, arisan marga, birthday, dan acara kantor di Medan. Horas! Mauliate.",
  openGraph: {
    title: SITE_NAME,
    description: SITE_TAGLINE,
    url: SITE_URL,
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630 }],
  },
};

async function getFeaturedPackages(): Promise<Package[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("packages")
      .select("*")
      .eq("is_active", true)
      .order("badge", { ascending: true, nullsFirst: false })
      .limit(4);
    return (data ?? []) as Package[];
  } catch {
    return [];
  }
}

async function getMenuStories(): Promise<MenuStory[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("menu_stories")
      .select("*")
      .eq("is_published", true)
      .limit(3);
    return (data ?? []) as MenuStory[];
  } catch {
    return [];
  }
}

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(6);
    return (data ?? []) as Testimonial[];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [packages, stories, testimonials] = await Promise.all([
    getFeaturedPackages(),
    getMenuStories(),
    getTestimonials(),
  ]);

  return (
    <>
      <Hero />
      <FeaturedPackages packages={packages} />
      <MenuStoriesPreview stories={stories} />

      {testimonials.length > 0 && (
        <SectionWrapper className="bg-muted/30">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Testimoni
            </p>
            <h2 className="mt-2 font-heading text-4xl text-foreground">
              Kata Mereka
            </h2>
            <p className="mt-2 text-muted-foreground">
              Ribuan acara sukses, ribuan kenangan yang tercipta bersama TATARING.
            </p>
          </div>
          <TestimonialCarousel testimonials={testimonials} />
        </SectionWrapper>
      )}

      <CtaSection />
    </>
  );
}
