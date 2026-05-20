export const SITE_NAME = "TATARING CATERING";
export const SITE_TAGLINE = "Cita Rasa Batak, Buat Setiap Momen Jadi Pesta.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tataring.id";
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

export const EVENT_TYPES = [
  { value: "pesta_adat", label: "Pesta Adat" },
  { value: "wedding", label: "Wedding Batak" },
  { value: "arisan", label: "Arisan Marga" },
  { value: "birthday", label: "Birthday" },
  { value: "kantor", label: "Acara Kantor" },
  { value: "lainnya", label: "Lainnya" },
] as const;

export const PACKAGE_CATEGORIES = [
  { value: "pesta_adat", label: "Pesta Adat" },
  { value: "wedding", label: "Wedding Batak" },
  { value: "arisan", label: "Arisan Marga" },
  { value: "birthday", label: "Birthday" },
  { value: "kantor", label: "Acara Kantor" },
  { value: "custom", label: "Custom" },
] as const;

export const BLOG_CATEGORIES = [
  { value: "resep", label: "Resep Batak" },
  { value: "tips_event", label: "Tips Event" },
  { value: "budaya", label: "Budaya & Tradisi" },
  { value: "behind_scene", label: "Behind the Scene" },
  { value: "promo", label: "Promo & Kabar" },
] as const;

export const ORDER_STATUSES = [
  { value: "new", label: "Baru" },
  { value: "contacted", label: "Dihubungi" },
  { value: "confirmed", label: "Dikonfirmasi" },
  { value: "done", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
] as const;

export const DEFAULT_SLOT_CAPACITY = 3;
