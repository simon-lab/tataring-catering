"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  FileText,
  Star,
  Images,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/dashboard",     label: "Dashboard",       icon: LayoutDashboard },
  { href: "/admin/orders",        label: "Pesanan",         icon: ShoppingBag },
  { href: "/admin/menu",          label: "Menu & Paket",    icon: UtensilsCrossed },
  { href: "/admin/blog",          label: "Blog",            icon: FileText },
  { href: "/admin/testimoni",     label: "Testimoni",       icon: Star },
  { href: "/admin/galeri",        label: "Galeri",          icon: Images },
  { href: "/admin/ketersediaan",  label: "Ketersediaan",    icon: CalendarDays },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
      {NAV.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-foreground/65 hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
