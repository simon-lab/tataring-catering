import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, MessageCircle, ArrowLeft } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Pesanan Terkirim — ${SITE_NAME}`,
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: PageProps) {
  const { order } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle2 className="size-10 text-primary" />
      </div>

      <h1 className="mt-6 font-heading text-3xl text-foreground">
        Pesanan Terkirim!
      </h1>

      {order && (
        <p className="mt-2 text-sm text-muted-foreground">
          Nomor pesanan:{" "}
          <span className="font-semibold text-foreground">{order}</span>
        </p>
      )}

      <p className="mt-4 text-muted-foreground">
        WhatsApp admin sudah terbuka dengan detail pesananmu. Tim TATARING CATERING akan
        membalas dalam{" "}
        <span className="font-semibold text-foreground">1–3 jam kerja</span>.
      </p>

      <div className="mt-8 rounded-xl border border-border bg-muted/40 p-5 text-sm text-left space-y-2 w-full">
        <p className="font-semibold text-foreground">Langkah selanjutnya:</p>
        <ol className="list-decimal list-inside space-y-1.5 text-muted-foreground">
          <li>Admin akan konfirmasi ketersediaan tanggal & paket.</li>
          <li>Kamu akan menerima rincian harga final + info DP.</li>
          <li>Setelah DP dikonfirmasi, pesanan resmi terdaftar.</li>
        </ol>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 w-full sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:w-auto"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Beranda
        </Link>
        <Link
          href="/menu"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
        >
          Lihat Menu Lain
        </Link>
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        Mauliate godang! Terima kasih telah mempercayakan acara spesialmu kepada TATARING CATERING.
      </p>
    </div>
  );
}
