"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";
import { WHATSAPP_NUMBER } from "@/lib/constants";

interface NavLink {
  href: string;
  label: string;
}

interface MobileMenuProps {
  links: NavLink[];
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ links, open, onClose }: MobileMenuProps) {
  const { t } = useLanguage();
  const waHref = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : "https://wa.me/628123456789";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-background shadow-xl lg:hidden"
          >
            <div className="flex items-center border-b border-border px-6 py-4">
              <div className="flex flex-col leading-none">
                <span className="font-heading text-xl text-primary">TATARING</span>
                <span className="text-[10px] tracking-widest text-muted-foreground uppercase">CATERING</span>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.08 }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-foreground/75 transition-colors hover:bg-muted hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="border-t border-border px-6 py-6 space-y-3">
              <Link
                href="/order"
                onClick={onClose}
                className={buttonVariants({ className: "w-full justify-center" })}
              >
                {t("nav.order")}
              </Link>
              <p className="text-center text-xs text-muted-foreground">
                {t("mobile.or")}{" "}
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {t("mobile.chat_wa")}
                </a>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
