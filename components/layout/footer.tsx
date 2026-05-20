import Link from "next/link";
import { Phone, Mail, Clock, MapPin } from "lucide-react";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

const navLinks = [
  { href: "/menu",         label: "Menu" },
  { href: "/cerita-menu",  label: "Cerita Menu" },
  { href: "/galeri",       label: "Galeri" },
  { href: "/blog",         label: "Blog" },
  { href: "/ketersediaan", label: "Ketersediaan" },
  { href: "/tentang-kami", label: "Tentang Kami" },
  { href: "/faq",          label: "FAQ" },
  { href: "/kontak",       label: "Kontak" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex flex-col leading-none">
              <span className="font-heading text-2xl text-primary">TATARING</span>
              <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
                CATERING
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {SITE_TAGLINE} Catering Batak otentik untuk setiap momen spesialmu.
            </p>
            <a
              href="https://instagram.com/tataringcatering"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram TATARING CATERING"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <IconInstagram className="size-4" />
              @tataringcatering
            </a>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground">
              Navigasi
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground">
              Kontak
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://wa.me/628123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                  +62 812-3456-789
                </a>
              </li>
              <li>
                <a
                  href="mailto:halo@tataring.id"
                  className="flex items-start gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                  halo@tataring.id
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                Senin–Sabtu, 08.00–17.00 WIB
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                Jl. Sisingamangaraja No. 88, Medan, Sumatera Utara
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE_NAME}. Semua hak dilindungi.</p>
          <p>Mauliate godang atas kepercayaanmu.</p>
        </div>
      </div>
    </footer>
  );
}
