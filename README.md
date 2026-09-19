# Klinik Nins Skincare — Landing Page

Landing page profesional untuk **Klinik nins'skincare**, klinik perawatan kulit yang berlokasi di
Cipeundeuy, Kabupaten Subang, Jawa Barat. Dibuat mobile-first, cepat, dan berorientasi konversi:
semua CTA mengarah ke WhatsApp / telepon / Google Maps.

Data yang ditampilkan diambil dari profil Google Maps bisnis tersebut (nama, kategori, alamat,
nomor telepon, jam operasional, rating, dan ulasan).

## ✨ Fitur

- **Mobile-first & responsive** — bekerja mulai dari smartphone kecil hingga desktop besar,
  tanpa horizontal scroll.
- **Cepat** — static site murni (HTML + CSS + JS), tanpa framework, tanpa build step.
  Peta Google Maps dimuat lazy saat mendekati viewport.
- **SEO** — meta lengkap, Open Graph & Twitter Card, `JSON-LD` schema
  [`HealthAndBeautyBusiness`](https://schema.org/HealthAndBeautyBusiness), `sitemap.xml`, `robots.txt`.
- **Aksesibilitas** — HTML semantik, skip link, kontras warna memadai, `aria-*`, dan dukungan
  `prefers-reduced-motion`.
- **GitHub Pages & Vercel ready** — aset memakai relative path, tidak ada konfigurasi khusus.

## 🧱 Teknologi

| Bagian | Teknologi |
| --- | --- |
| Markup | HTML5 semantik |
| Styling | CSS3 murni (custom properties, grid, `clamp()`) |
| Interaksi | Vanilla JavaScript (ES5-compatible, tanpa dependency) |
| Font | Google Fonts — *Fraunces* (display) & *Plus Jakarta Sans* (body) |
| Ikon | Inline SVG |
| Gambar | Foto lokal di `assets/img/` (Unsplash) + favicon SVG |

## 📁 Struktur Project

```text
.
├── index.html              # Halaman utama
├── css/
│   └── style.css           # Seluruh style (mobile-first)
├── js/
│   └── main.js             # Nav mobile, reveal on scroll, lazy map
├── assets/
│   ├── favicon.svg
│   └── img/                # Semua foto
├── robots.txt
├── sitemap.xml
├── .gitignore
└── README.md
```

## 🚀 Cara Menjalankan

### Prasyarat

Tidak ada dependency yang perlu di-install — cukup browser modern.

### Development

Cukup buka `index.html` di browser. Kalau ingin server lokal (direkomendasikan agar
font & peta termuat sempurna):

```bash
# Python 3
python -m http.server 5173

# atau Node.js
npx serve .
```

Lalu buka <http://localhost:5173>.

### Build

Project ini **tidak memerlukan build step** — file statis langsung siap deploy.

## ⚙️ Environment Variable

**Tidak ada.** Tidak ada kunci API atau rahasia yang digunakan. Peta memakai
Google Maps embed publik berbasis koordinat, bukan API key berbayar.

## 🌐 Deployment

### Vercel

1. Push project ke repository GitHub.
2. Masuk ke <https://vercel.com> → **Add New Project** → pilih repository.
3. Framework preset: **Other** (static). Biarkan default; Vercel otomatis mendeteksi
   output statis. Klik **Deploy**.

### GitHub Pages

1. Push project ke repository GitHub.
2. Buka **Settings → Pages**.
3. Pada **Build and deployment**, pilih *Deploy from a branch*:
   - Branch: `main` (atau `master`)
   - Folder: `/ (root)`
4. Save. Halaman akan tersedia di
   `https://<username>.github.io/<nama-repository>/`.

Karena semua aset memakai relative path (`css/style.css`, `assets/img/hero.jpg`, dst.),
halaman otomatis bekerja di kedua environment tersebut — **tanpa konfigurasi `base` tambahan**.

## 📝 Mengubah Konten

Semua konten ada di `index.html`. Hal-hal yang paling sering diubah:

| Konten | Lokasi |
| --- | --- |
| Nomor WhatsApp & telepon | `href="https://wa.me/6281210616807..."` dan `href="tel:+6281210616807"` |
| Alamat & jam operasional | Section `#lokasi` + `JSON-LD` di `<head>` |
| Daftar treatment & harga | Section `#layanan` |
| Testimoni | Section `#testimoni` |
| Foto | `assets/img/` — ganti file dengan nama yang sama |

> Catatan: rating 5,0 dan jam buka 09.00–22.00 diambil dari profil Google Maps.
> Harga treatment ditampilkan sebagai "mulai" dan sebaiknya dikonfirmasi ulang
> ke pemilik bisnis sebelum dipresentasikan.

## 📄 Lisensi

Kode project ini bebas digunakan untuk keperluan bisnis Klinik Nins Skincare.
Foto di `assets/img/` bersumber dari [Unsplash](https://unsplash.com) dan tunduk pada
lisensi masing-masing pembuatnya.
