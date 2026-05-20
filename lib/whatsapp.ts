import { WHATSAPP_NUMBER } from "@/lib/constants";

interface OrderMessage {
  customerName: string;
  eventDate: string;
  eventType: string;
  packageName: string;
  portionCount: number;
  addons: string[];
  deliveryAddress: string;
  notes: string;
  estimatedTotal: number;
}

export function generateOrderMessage(order: OrderMessage): string {
  const addonsText = order.addons.length > 0 ? order.addons.join(", ") : "-";
  const total = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(order.estimatedTotal);

  return `Halo TATARING CATERING, saya mau pesan:

Nama: ${order.customerName}
Tanggal Acara: ${order.eventDate}
Jenis: ${order.eventType}
Paket: ${order.packageName}
Porsi: ${order.portionCount}
Add-on: ${addonsText}
Lokasi: ${order.deliveryAddress}
Catatan: ${order.notes || "-"}

Estimasi: ${total}`;
}

export function buildWhatsAppUrl(message: string, phone?: string): string {
  const number = phone ?? WHATSAPP_NUMBER;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
