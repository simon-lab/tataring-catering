import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/admin-nav";
import { LogoutButton } from "@/components/admin/logout-button";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Halaman login (atau belum autentikasi) — render tanpa sidebar
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar — fixed */}
      <aside className="fixed left-0 top-0 z-40 flex h-full w-56 flex-col border-r border-border bg-card">
        {/* Brand */}
        <div className="shrink-0 border-b border-border px-4 py-5">
          <p className="font-heading text-lg leading-none text-primary">TATARING</p>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Admin Panel
          </p>
        </div>

        {/* Nav links */}
        <AdminNav />

        {/* User info + logout */}
        <div className="shrink-0 border-t border-border p-3 space-y-1">
          <p className="truncate px-3 py-1 text-xs text-muted-foreground">
            {user.email}
          </p>
          <LogoutButton />
        </div>
      </aside>

      {/* Main — offset kiri sesuai lebar sidebar */}
      <main className="ml-56 flex-1 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
