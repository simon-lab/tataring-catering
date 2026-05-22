export type ActionResult = { error: string } | { error: null };
export const OK: ActionResult = { error: null };

export function translateDbError(message: string): string {
  // Check constraints — spesifik per kolom
  if (message.includes("price_per_portion"))
    return "Harga per porsi harus lebih dari Rp 0";
  if (message.includes("min_portion"))
    return "Minimal porsi harus lebih dari 0";
  if (message.includes("max_portion"))
    return "Maksimal porsi harus lebih dari 0";
  if (message.includes("rating"))
    return "Rating harus antara 1 dan 5";
  if (message.includes("max_slots"))
    return "Kapasitas slot harus minimal 1";
  if (message.includes("check constraint") || message.includes("violates check"))
    return "Nilai yang dimasukkan tidak valid, periksa kembali isian form";

  // Duplikat / unique
  if (message.includes("slug"))
    return "Nama ini sudah digunakan, coba nama yang berbeda";
  if (message.includes("unique") || message.includes("duplicate key"))
    return "Data ini sudah ada sebelumnya, tidak bisa duplikat";

  // Kolom wajib kosong
  if (message.includes("null value") || message.includes("not-null") || message.includes("violates not-null"))
    return "Ada kolom wajib yang belum diisi";

  // RLS / izin
  if (message.includes("row-level security") || message.includes("permission denied") || message.includes("insufficient_privilege"))
    return "Akses ditolak oleh database. Periksa pengaturan keamanan (RLS) di Supabase";

  // Foreign key
  if (message.includes("foreign key"))
    return "Data terkait tidak ditemukan di database";

  // Sesi / token
  if (message.includes("JWT") || message.includes("token expired"))
    return "Sesi login habis, silakan login ulang";

  // Koneksi
  if (message.includes("fetch") || message.includes("network") || message.includes("ECONNREFUSED"))
    return "Tidak bisa terhubung ke server, periksa koneksi internet";

  return "Terjadi kesalahan saat menyimpan, silakan coba lagi";
}
