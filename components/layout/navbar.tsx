"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { LanguageToggle } from "./language-toggle";
import { MobileMenu } from "./mobile-menu";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/menu",          label: "Menu" },
  { href: "/cerita-menu",   label: "Cerita Menu" },
  { href: "/galeri",        label: "Galeri" },
  { href: "/blog",          label: "Blog" },
  { href: "/ketersediaan",  label: "Ketersediaan" },
  { href: "/kontak",        label: "Kontak" },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tutup mobile menu saat navigasi
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-200 border-b",
          scrolled
            ? "bg-background/95 backdrop-blur-md border-border shadow-sm"
            : "bg-background border-transparent"
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none shrink-0">
            <span className="font-heading text-xl text-primary tracking-wide">
              TATARING
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              CATERING
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname.startsWith(link.href)
                    ? "text-primary font-semibold"
                    : "text-foreground/65"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageToggle />
            <Link
              href="/order"
              className={buttonVariants({ size: "sm" })}
            >
              Pesan Sekarang
            </Link>
          </div>

          {/* Mobile: lang toggle + hamburger */}
          <div className="flex lg:hidden items-center gap-1">
            <LanguageToggle />
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "size-9"
              )}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu
        links={navLinks}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}
