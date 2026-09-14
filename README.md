# Radar Acara — Direktori & Peta Acara

Web app untuk memantau jadwal dan lokasi acara di sekitarmu. Dibangun dengan
Next.js 16 (App Router), Tailwind CSS v4, dan Leaflet — siap deploy ke Vercel.

## Fitur

- Pencarian & filter status (Semua / Berlangsung / Mendatang / Selesai)
- Status dihitung otomatis dari tanggal hari ini — tidak perlu diset manual
- Peta interaktif (Leaflet + tile gelap) dengan penanda per acara
- Klik acara di daftar untuk fokus ke peta, atau sebaliknya
- Tampilan mobile: toggle antara Daftar dan Peta

## Jalankan secara lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## Deploy ke Vercel

1. Push folder ini ke repo GitHub/GitLab Anda.
2. Di [vercel.com](https://vercel.com), klik **Add New → Project**, lalu pilih repo tersebut.
3. Vercel otomatis mendeteksi Next.js — klik **Deploy**, tidak perlu konfigurasi tambahan.

Atau lewat CLI:

```bash
npm i -g vercel
vercel
```

## Kustomisasi

### 1. Ganti nama & branding
Edit `lib/config.ts`:

```ts
export const siteConfig = {
  name: "NAMA SITUS ANDA",
  tagline: "Tagline singkat",
  description: "Deskripsi untuk SEO/meta tag",
  defaultMapCenter: { lat: ..., lng: ... }, // pusat peta default
  defaultMapZoom: 9,
};
```

### 2. Ganti data acara
Edit array di `lib/events.ts`. Setiap acara butuh:

```ts
{
  id: "unik",
  title: "Nama Acara",
  location: "Nama Lokasi",
  date: "2026-10-01",   // format YYYY-MM-DD
  time: "19:00",         // opsional
  lat: -7.56,
  lng: 110.82,
  tag: "Kategori",       // opsional
  description: "...",    // opsional
}
```

Status (Berlangsung/Mendatang/Selesai) dihitung otomatis berdasarkan `date`
dibandingkan tanggal hari ini — Anda tidak perlu mengaturnya manual.

Ingin ambil data dari Google Sheets, Airtable, atau database? Ganti isi
`lib/events.ts` menjadi fungsi `async` yang fetch dari sumber tersebut, lalu
sesuaikan `app/page.tsx` untuk memanggilnya sebagai Server Component.

### 3. Ganti warna
Token warna ada di `app/globals.css` bagian `:root` (mis. `--accent-live`,
`--accent-upcoming`).

## Struktur proyek

```
app/            halaman & layout (App Router)
components/     komponen UI (list, kartu acara, peta, tab, search)
lib/            config, tipe data, data acara, helper status
```
