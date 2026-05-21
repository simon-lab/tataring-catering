"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  id: string;
  q: string;
  a: string;
}

interface FaqCategory {
  label: string;
  icon: string;
  items: FaqItem[];
}

const FAQ_DATA: FaqCategory[] = [
  {
    label: "Pemesanan",
    icon: "📋",
    items: [
      {
        id: "p1",
        q: "Berapa minimum order untuk catering TATARING?",
        a: "Minimum order kami adalah 20 porsi untuk paket reguler. Untuk kebutuhan di bawah 20 porsi, silakan hubungi admin kami langsung via WhatsApp untuk diskusi lebih lanjut.",
      },
      {
        id: "p2",
        q: "Bagaimana cara membayar DP?",
        a: "Setelah pesanan dikonfirmasi via WhatsApp, admin akan mengirimkan detail nomor rekening. DP sebesar 30–50% dari total estimasi perlu dibayarkan untuk mengamankan tanggal acaramu.",
      },
      {
        id: "p3",
        q: "Bisakah mengubah atau membatalkan pesanan?",
        a: "Perubahan pesanan (menu, porsi, tanggal) bisa dilakukan maksimal H-7 sebelum acara, tergantung ketersediaan. Pembatalan setelah DP dibayarkan tidak dapat dikembalikan. Untuk kondisi khusus (force majeure), kami akan mendiskusikan solusi terbaik bersama.",
      },
      {
        id: "p4",
        q: "Berapa lama lead time pemesanan yang disarankan?",
        a: "Kami menyarankan pemesanan minimal 7–14 hari sebelum acara untuk memastikan ketersediaan bahan dan tim. Untuk acara besar seperti wedding atau pesta adat 200+ porsi, disarankan 2–4 minggu sebelumnya.",
      },
    ],
  },
  {
    label: "Pengiriman",
    icon: "🚚",
    items: [
      {
        id: "k1",
        q: "Area mana saja yang dilayani oleh TATARING CATERING?",
        a: "Kami melayani area Medan dan sekitarnya, termasuk Deli Serdang, Binjai, dan Tebing Tinggi. Untuk area luar kota, biaya pengiriman disesuaikan dengan jarak — diskusikan dengan admin kami.",
      },
      {
        id: "k2",
        q: "Berapa biaya pengiriman?",
        a: "Biaya pengiriman dihitung berdasarkan jarak dari dapur kami ke lokasi acara. Informasi detail akan disampaikan admin saat konfirmasi pesanan. Untuk area Medan kota, tersedia tarif flat yang terjangkau.",
      },
      {
        id: "k3",
        q: "Apakah bisa self-pickup?",
        a: "Ya, tersedia opsi self-pickup dari dapur kami. Waktu pengambilan dan alamat dapur akan dikonfirmasi via WhatsApp setelah pesanan diproses.",
      },
    ],
  },
  {
    label: "Menu",
    icon: "🍽️",
    items: [
      {
        id: "m1",
        q: "Bisakah request menu custom di luar daftar paket?",
        a: "Tentu! Kami menerima request menu custom. Hubungi admin via WhatsApp dengan detail menu yang diinginkan, dan kami akan memberikan penawaran harga terbaik untuk kamu.",
      },
      {
        id: "m2",
        q: "Apakah ada pilihan untuk vegetarian atau pantangan alergi?",
        a: "Kami bisa menyesuaikan menu untuk kebutuhan vegetarian dan pantangan alergi tertentu. Cantumkan informasi tersebut di kolom 'Catatan Khusus' saat pemesanan, atau diskusikan langsung dengan admin kami.",
      },
      {
        id: "m3",
        q: "Apakah makanan TATARING CATERING halal?",
        a: "Semua menu kami menggunakan bahan-bahan yang halal. Kami berkomitmen untuk menyajikan makanan yang aman dan nyaman untuk semua tamu, termasuk yang beragama Muslim.",
      },
    ],
  },
  {
    label: "Pembayaran",
    icon: "💳",
    items: [
      {
        id: "b1",
        q: "Metode pembayaran apa saja yang diterima?",
        a: "Kami menerima transfer bank (semua bank mayor), QRIS, dan tunai saat delivery/pickup. Detail nomor rekening akan dikirimkan via WhatsApp setelah konfirmasi pesanan.",
      },
      {
        id: "b2",
        q: "Berapa persen DP yang harus dibayar?",
        a: "DP sebesar 30–50% dari total estimasi harga, tergantung besarnya pesanan. Sisa pembayaran dilunasi maksimal H-1 sebelum acara atau saat delivery, sesuai kesepakatan bersama admin.",
      },
      {
        id: "b3",
        q: "Apakah ada program cicilan atau kredit?",
        a: "Saat ini kami belum menyediakan program cicilan formal. Namun untuk acara besar dengan nilai yang signifikan, admin kami siap mendiskusikan skema pembayaran yang sesuai dengan kondisimu.",
      },
    ],
  },
];

export function FaqAccordion() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setOpenItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="space-y-10">
      {FAQ_DATA.map((cat) => (
        <div key={cat.label}>
          <h2 className="mb-4 flex items-center gap-2 font-heading text-2xl text-foreground">
            <span aria-hidden>{cat.icon}</span>
            {cat.label}
          </h2>
          <div className="space-y-2">
            {cat.items.map((item) => {
              const isOpen = openItems.has(item.id);
              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-border transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 text-muted-foreground transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-border bg-muted/20 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
