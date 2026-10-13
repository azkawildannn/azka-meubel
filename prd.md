# PRD — Website Katalog AZKA MEUBEL

**Versi:** 1.0 Final Draft
**Status:** Siap digunakan sebagai acuan desain dan pengembangan
**Tanggal:** 8 Oktober 2026
**Source of Truth Desain:** Folder `design-web/` hasil Stitch

---

## 1. Ringkasan Produk

Website **AZKA MEUBEL** adalah website katalog furnitur yang berfungsi sebagai media promosi, presentasi koleksi, dan sarana calon pelanggan untuk menghubungi Azka Meubel melalui WhatsApp.

Website bukan marketplace dan bukan e-commerce penuh. Tidak terdapat pembayaran online, keranjang belanja, checkout, atau manajemen pesanan di dalam website.

Alur utama pengguna:

**Melihat katalog → membuka detail produk → menekan tombol WhatsApp → melanjutkan konsultasi/pemesanan melalui WhatsApp.**

Website memiliki dua area utama:

1. **Website publik** untuk pengunjung.
2. **Area admin `/admin`** untuk pengelolaan produk menggunakan login.

---

# 2. Prinsip Utama Proyek

## 2.1 Desain menjadi acuan utama

Folder `design-web/` adalah **source of truth visual**. Implementasi harus mempertahankan karakter desain yang telah dibuat di Stitch: minimalis, editorial, premium, lapang, fokus pada foto produk, tipografi bersih, dan tidak berlebihan.

Developer tidak boleh mengganti desain menjadi dashboard, template SaaS, ecommerce generik, atau layout yang ramai hanya karena alasan teknis.

Perubahan yang diperbolehkan hanya:

- adaptasi untuk data dinamis dari database;
- adaptasi untuk desktop, tablet, dan mobile;
- penyesuaian konten nyata bisnis;
- penyesuaian aksesibilitas;
- penyesuaian performa;
- penambahan state fungsional yang belum ditampilkan di mockup, misalnya loading, error, empty state, dan konfirmasi penghapusan.

## 2.2 Bahasa website

**Seluruh antarmuka publik wajib menggunakan Bahasa Indonesia.**

Teks bahasa Inggris yang terdapat di desain Stitch hanya digunakan sebagai referensi visual dan wajib diterjemahkan atau ditulis ulang dalam Bahasa Indonesia yang natural.

Contoh:

| Desain Stitch | Implementasi final |
|---|---|
| Home | Beranda |
| About | Tentang Kami |
| Products | Produk |
| Contact | Kontak |
| Chat WhatsApp | Chat WhatsApp |
| Explore Products | Lihat Produk |
| Shop by Categories | Jelajahi Kategori |
| Featured Products | Produk Unggulan |
| View Details | Lihat Detail |
| Furniture Collection | Koleksi Furnitur |
| Crafted for Everyday Living | Dibuat untuk Kehidupan Sehari-hari |
| Furniture with purpose | Furnitur dengan Tujuan |
| Contact Our Studio | Hubungi Azka Meubel |
| Product ID | ID Produk |
| Complementary Pieces | Produk Pelengkap |
| Subscribe | Berlangganan |
| Load More | Muat Lebih Banyak |

Nama produk, nama material, nama koleksi, dan istilah teknis dapat dipertahankan jika memang merupakan nama resmi produk atau istilah yang digunakan bisnis.

## 2.3 Responsif adalah requirement wajib

Website harus dirancang dan diuji untuk:

- desktop;
- laptop;
- tablet;
- mobile portrait;
- mobile dengan layar sempit.

Tidak boleh terdapat horizontal scroll pada halaman publik maupun area admin.

Layout tidak boleh hanya diperkecil dari desktop. Struktur harus menyesuaikan konteks mobile.

---

# 3. Tujuan Bisnis

1. Menampilkan Azka Meubel sebagai brand furnitur yang profesional dan terpercaya.
2. Menampilkan produk secara visual dan informatif.
3. Memudahkan calon pelanggan menemukan produk.
4. Memberikan detail produk yang cukup sebelum pelanggan menghubungi bisnis.
5. Mengarahkan calon pelanggan ke WhatsApp untuk konsultasi dan pemesanan.
6. Memudahkan admin memperbarui katalog tanpa mengubah kode website.
7. Menyediakan fondasi website yang ringan dan mudah dirawat.

---

# 4. Sasaran Pengguna

## 4.1 Pengunjung umum

Calon pelanggan yang ingin:

- melihat koleksi furnitur;
- mencari berdasarkan kategori;
- melihat detail produk;
- mengetahui bahan, ukuran, harga, dan informasi produk;
- menghubungi Azka Meubel melalui WhatsApp.

## 4.2 Admin Azka Meubel

Admin yang memiliki hak untuk:

- login ke `/admin`;
- menambah produk;
- mengubah produk;
- menghapus produk;
- mengatur status produk tampil/tidak tampil;
- mengunggah dan mengelola gambar produk.

Tidak ada kebutuhan customer account pada MVP.

---

# 5. Scope MVP

## 5.1 Termasuk

- Beranda
- Tentang Kami
- Produk
- Detail Produk
- Kontak
- Navigasi global
- Footer global
- Integrasi WhatsApp
- Supabase PostgreSQL
- Supabase Storage untuk gambar produk
- Supabase Auth untuk login admin
- CRUD produk
- Publikasi / sembunyikan produk
- URL produk berbasis slug
- Responsive desktop dan mobile
- SEO dasar
- Optimasi gambar
- State loading, error, empty, success

## 5.2 Tidak termasuk

- Payment gateway
- Keranjang belanja
- Checkout
- Akun pelanggan
- Sistem order internal
- Invoice otomatis
- Pengiriman otomatis
- Pelacakan pesanan
- Integrasi marketplace
- Stok realtime kompleks
- Chat realtime di dalam website
- Notifikasi pesanan internal
- CMS penuh untuk seluruh konten halaman

---

# 6. Arsitektur Teknologi

## 6.1 Stack yang digunakan

### Frontend

- **Astro**
- **Tailwind CSS**
- JavaScript hanya pada komponen yang memerlukan interaksi

### Backend / layanan data

- **Supabase**
- PostgreSQL sebagai database
- Supabase Auth sebagai autentikasi admin
- Supabase Storage sebagai penyimpanan gambar produk
- Supabase Row Level Security (RLS) untuk pembatasan akses

### Hosting

- **Vercel** untuk deployment website

### Komunikasi pelanggan

- **WhatsApp** menggunakan URL `wa.me` dengan pesan otomatis.

---

# 7. Arsitektur Sistem

```text
Pengunjung
    │
    ▼
azkameubel.com
    │
    ▼
Vercel
    │
    ▼
Astro
    │
    ├──────────────► Supabase PostgreSQL
    │                      │
    │                      └── data produk
    │
    ├──────────────► Supabase Storage
    │                      │
    │                      └── gambar produk
    │
    └──────────────► WhatsApp
                           │
                           └── konsultasi / pemesanan

Admin
    │
    ▼
azkameubel.com/admin
    │
    ▼
Supabase Auth
    │
    ▼
Dashboard Admin
    │
    ▼
CRUD Produk
    │
    ▼
Supabase PostgreSQL + Storage
```

---

# 8. Struktur URL

| URL | Fungsi | Akses |
|---|---|---|
| `/` | Beranda | Publik |
| `/about` | Tentang Kami | Publik |
| `/products` | Katalog produk | Publik |
| `/products/[slug]` | Detail produk | Publik |
| `/contact` | Kontak | Publik |
| `/admin` | Login / dashboard admin | Admin |
| `/admin/products` | Manajemen produk | Admin |
| `/admin/products/new` | Tambah produk | Admin |
| `/admin/products/[id]/edit` | Edit produk | Admin |

URL `/admin` harus dilindungi. Pengguna tanpa sesi login tidak boleh mengakses dashboard dan fungsi CRUD.

---

# 9. Struktur Navigasi Publik

Header desktop:

- Logo / teks AZKA MEUBEL
- Beranda
- Tentang Kami
- Produk
- Kontak
- Tombol Chat WhatsApp

Header mobile:

- Logo
- Tombol menu / hamburger
- Tombol WhatsApp dapat tetap ditampilkan sesuai ruang yang tersedia

Menu mobile harus dapat dibuka dan ditutup dengan jelas, tidak menutupi isi secara permanen, dan dapat ditutup kembali setelah pengguna memilih halaman.

---

# 10. Spesifikasi Halaman Beranda

Desain mengacu pada `home_azka_meubel/screen.png` dan `home_azka_meubel/code.html`.

## 10.1 Hero

Tujuan: memberikan identitas brand dan mengarahkan pengunjung ke produk.

Elemen:

- foto furnitur/interior besar;
- headline utama dalam Bahasa Indonesia;
- deskripsi singkat;
- tombol **Lihat Produk**;
- tombol **Chat via WhatsApp**;
- informasi singkat mengenai karakter produk/brand bila diperlukan.

Contoh copy final:

> Furnitur yang Membuat Ruang Terasa Seperti Rumah.

Copy harus disesuaikan dengan identitas Azka Meubel nyata. Copy pada desain Stitch dianggap contoh dan bukan fakta bisnis.

## 10.2 Kategori Produk

Judul:

> Jelajahi Kategori

Kategori awal yang tersedia di desain:

- Ruang Tamu & Sofa
- Kursi Makan
- Kamar Tidur & Tempat Tidur
- Ruang Kerja & Penyimpanan

Kategori sebaiknya berasal dari database atau konfigurasi kategori agar mudah dikembangkan.

Desktop: layout horizontal/grid.

Mobile: menjadi grid 1–2 kolom atau carousel horizontal sesuai karakter desain, tanpa menyebabkan layout rusak.

## 10.3 Section editorial / brand story

Menampilkan kombinasi foto dan teks dengan gaya editorial.

Tujuan:

- memperkuat positioning brand;
- menjelaskan filosofi furnitur;
- memberi konteks sebelum pengguna melihat produk.

CTA:

> Baca Cerita Kami

## 10.4 Produk Unggulan

Judul:

> Produk Unggulan

Filter/kategori yang terlihat pada desain:

- Semua
- Kursi
- Sofa
- Tempat Tidur & Meja

Data produk harus diambil dari database.

Kartu produk minimal menampilkan:

- foto utama;
- nama produk;
- kategori;
- harga jika tersedia;
- tombol **Lihat Detail**.

Jika harga belum ingin ditampilkan secara publik, gunakan konfigurasi `show_price=false` pada produk.

## 10.5 Section brand statement

Section tipografi besar dengan pernyataan singkat mengenai filosofi Azka Meubel.

Tidak perlu menggunakan statistik palsu.

Angka seperti “800+”, “16K”, atau “100+” yang terdapat pada contoh desain hanya boleh digunakan jika ada data bisnis nyata yang dapat diverifikasi.

## 10.6 Testimoni

Jika menggunakan testimoni, sumber harus berasal dari pelanggan nyata dan memiliki izin publikasi.

Jika belum ada data valid, section boleh disembunyikan atau diganti dengan pernyataan brand yang tidak mengandung klaim kuantitatif palsu.

## 10.7 CTA akhir

Contoh:

> Temukan Furnitur yang Tepat untuk Ruang Anda.

CTA:

- **Lihat Produk**
- **Chat WhatsApp**

## 10.8 Footer

Menampilkan:

- AZKA MEUBEL
- tautan navigasi;
- WhatsApp;
- Instagram;
- alamat bisnis jika sudah dikonfirmasi;
- copyright.

Link yang masih berupa `#` pada mockup harus diganti dengan URL nyata atau dihapus sebelum produksi.

---

# 11. Spesifikasi Halaman Tentang Kami

Desain mengacu pada `about_azka_meubel/screen.png`.

## 11.1 Hero

Headline:

> Furnitur dengan Tujuan.

Deskripsi singkat tentang filosofi brand.

## 11.2 Filosofi Brand

Section editorial mengenai:

- filosofi desain;
- fungsi;
- kualitas;
- umur produk;
- hubungan antara desain dan ruang.

## 11.3 Material

Menjelaskan material yang benar-benar digunakan Azka Meubel.

Desain menyediakan konsep material seperti:

- kayu;
- rotan;
- kain;
- material alami.

Detail faktual harus disesuaikan dengan material nyata yang digunakan bisnis.

## 11.4 Workshop / craftsmanship

Menjelaskan proses pembuatan jika informasi tersebut benar-benar dimiliki bisnis.

Contoh section pada desain:

- ketelitian sambungan;
- anyaman rotan;
- proses finishing.

## 11.5 Prinsip Azka Meubel

Desain memiliki empat prinsip editorial. Judul Bahasa Indonesianya dapat menjadi:

- Material yang Jujur
- Geometri yang Tak Lekang Waktu
- Produksi yang Lebih Bertanggung Jawab
- Konsultasi yang Personal

## 11.6 CTA

- **Konsultasi via WhatsApp**
- **Kunjungi Showroom** jika showroom benar-benar tersedia.

---

# 12. Spesifikasi Halaman Produk

Desain mengacu pada `products_azka_meubel/screen.png`.

## 12.1 Header

Judul:

> Koleksi Furnitur

Deskripsi singkat tentang koleksi.

## 12.2 Filter Produk

Kategori awal:

- Semua Produk
- Kursi
- Sofa
- Meja
- Lemari
- Kamar Tidur
- Ruang Kerja

Filter harus bekerja berdasarkan data produk.

## 12.3 Grid Produk

Desktop:

- grid 3 kolom sesuai karakter desain;
- gambar dominan;
- teks produk di bawah gambar.

Tablet:

- dapat menggunakan 2 kolom.

Mobile:

- 1 atau 2 kolom sesuai lebar viewport dan ukuran kartu;
- teks tetap terbaca;
- tidak boleh terjadi horizontal overflow.

Setiap kartu produk:

- gambar utama;
- nama produk;
- deskripsi singkat/material;
- harga jika tersedia;
- link **Lihat Detail**.

## 12.4 Pagination / Load More

Desain saat ini menampilkan konsep “Muat Lebih Banyak”.

Implementasi dapat menggunakan:

- pagination; atau
- tombol **Muat Lebih Banyak**.

Untuk MVP, tombol **Muat Lebih Banyak** lebih sesuai dengan karakter desain.

Jika produk sedikit, tombol tidak perlu ditampilkan.

---

# 13. Spesifikasi Halaman Detail Produk

Desain mengacu pada `product_detail_kanso_chair_azka_meubel/screen.png`.

## 13.1 Breadcrumb

Contoh:

> Beranda / Produk / Kursi

Breadcrumb harus dinamis.

## 13.2 Galeri Produk

Menampilkan:

- foto utama;
- foto tambahan;
- thumbnail;
- tombol zoom jika memungkinkan tanpa membebani halaman.

Galeri harus nyaman digunakan di desktop dan mobile.

## 13.3 Informasi Produk

Minimal:

- nama produk;
- ID produk;
- kategori;
- harga jika tersedia;
- material;
- ukuran/dimensi;
- deskripsi;
- varian jika produk memiliki varian.

Contoh field teknis:

```text
Nama Produk
ID Produk
Kategori
Harga
Deskripsi
Material
Warna / Finishing
Dimensi
Berat (opsional)
Status Ketersediaan (opsional)
```

## 13.4 Tombol WhatsApp Dinamis

CTA utama:

> Chat via WhatsApp

Pesan WhatsApp harus dibuat otomatis berdasarkan produk yang sedang dibuka.

Contoh:

> Halo Azka Meubel, saya tertarik dengan produk **Kanso Solid Oak Dining Chair** (ID Produk: **AZK-CHR-042**). Saya ingin menanyakan ketersediaan dan detail produk.

Parameter minimal yang dikirim:

- nama produk;
- ID produk.

Parameter tambahan yang boleh dikirim:

- URL produk;
- kategori;
- varian yang dipilih.

Nomor WhatsApp harus disimpan sebagai konfigurasi lingkungan / konfigurasi aplikasi, bukan ditulis berulang di banyak file.

## 13.5 Informasi perawatan dan spesifikasi tambahan

Accordion seperti pada desain dapat digunakan untuk:

- Perawatan & Material
- Pengiriman & Waktu Pengerjaan
- Pesanan Kustom

Konten harus dibuat berdasarkan informasi bisnis nyata.

## 13.6 Produk terkait

Section:

> Produk Pelengkap

Menampilkan beberapa produk lain yang relevan berdasarkan kategori atau relasi produk.

Tidak perlu membuat sistem rekomendasi AI. Query sederhana berdasarkan kategori sudah cukup.

---

# 14. Spesifikasi Halaman Kontak

Desain mengacu pada `contact_azka_meubel/screen.png`.

## 14.1 Hero

Headline:

> Hubungi Azka Meubel

Deskripsi menjelaskan bahwa pelanggan dapat berkonsultasi melalui WhatsApp.

## 14.2 Form Kontak

Field:

- Nama Lengkap *
- Nomor WhatsApp *
- Pesan / Detail Permintaan *

Button:

> Kirim via WhatsApp

Form **tidak perlu menyimpan data ke database pada MVP**.

Saat submit:

1. validasi field;
2. sanitasi input;
3. bentuk pesan WhatsApp;
4. buka WhatsApp melalui `wa.me`.

## 14.3 Informasi Kontak

Dapat menampilkan:

- alamat;
- WhatsApp;
- Instagram;
- jam operasional;
- peta.

Alamat pada desain Stitch seperti Darmawangsa Square dan alamat Jepara merupakan **konten contoh** dan tidak boleh dipublikasikan sebelum dikonfirmasi sebagai alamat resmi Azka Meubel.

---

# 15. Footer Global

Footer digunakan konsisten di seluruh halaman publik.

Isi minimal:

### Brand
AZKA MEUBEL

### Navigasi
- Beranda
- Tentang Kami
- Produk
- Kontak

### Hubungi
- WhatsApp
- Instagram
- Email jika tersedia

### Legal
- Hak Cipta

Kolom newsletter/subscription yang terdapat pada desain boleh dinonaktifkan pada MVP karena tidak ada requirement sistem newsletter.

---

# 16. Sistem Admin

## 16.1 Login

URL:

`/admin`

Admin login menggunakan Supabase Auth.

Field:

- email;
- password.

Fitur:

- login;
- logout;
- session persistence;
- redirect ke dashboard setelah login;
- redirect ke login jika belum autentikasi.

## 16.2 Otorisasi

Autentikasi saja tidak cukup. Sistem harus membatasi operasi berdasarkan role.

Role minimal:

```text
ADMIN
```

Hanya admin yang boleh:

- insert produk;
- update produk;
- delete produk;
- upload gambar produk;
- mengubah status publikasi.

Pengunjung publik hanya memiliki akses baca terhadap produk yang dipublikasikan.

Gunakan **Supabase Row Level Security (RLS)**.

---

# 17. Dashboard Admin

Dashboard minimal berisi:

- jumlah produk;
- jumlah produk aktif/publikasi;
- jumlah draft;
- shortcut Tambah Produk;
- daftar produk terbaru.

Tidak perlu membuat dashboard analitik kompleks.

---

# 18. CRUD Produk

## 18.1 Create

Admin klik:

> + Tambah Produk

Form:

```text
Nama Produk *
ID Produk *
Slug *
Kategori *
Harga
Deskripsi Singkat
Deskripsi Lengkap
Material
Finishing / Warna
Dimensi
Foto Utama *
Foto Tambahan
Status Publikasi
```

## 18.2 Read

Admin dapat melihat daftar produk dalam tabel/list.

Kolom minimal:

- Foto
- Nama
- ID Produk
- Kategori
- Harga
- Status
- Tanggal diperbarui
- Aksi

Aksi:

- Edit
- Hapus
- Lihat

## 18.3 Update

Admin dapat mengubah semua field produk yang diperbolehkan.

Setelah penyimpanan berhasil:

- tampilkan notifikasi sukses;
- data frontend menggunakan data terbaru;
- tidak perlu deploy ulang website.

## 18.4 Delete

Penghapusan harus memiliki konfirmasi.

Contoh:

> Hapus produk “Kanso Solid Oak Dining Chair”?
>
> Tindakan ini akan menghapus data produk dari katalog.

Idealnya gambar produk yang tidak lagi digunakan juga dibersihkan agar storage tidak penuh.

## 18.5 Publish / Draft

Produk memiliki status:

- `draft`
- `published`

Produk draft tidak boleh muncul pada website publik.

---

# 19. Struktur Database

Database utama: PostgreSQL pada Supabase.

## 19.1 Tabel `products`

| Field | Tipe | Wajib | Keterangan |
|---|---|---:|---|
| id | uuid | Ya | Primary key |
| product_code | text | Ya | ID produk yang terlihat pengguna |
| name | text | Ya | Nama produk |
| slug | text | Ya | URL unik |
| category | text / uuid | Ya | Kategori produk |
| short_description | text | Tidak | Deskripsi singkat |
| description | text | Tidak | Deskripsi lengkap |
| price | numeric | Tidak | Harga produk |
| show_price | boolean | Ya | Tampilkan/sembunyikan harga |
| material | text | Tidak | Material |
| finish | text | Tidak | Finishing/warna |
| dimensions | text | Tidak | Dimensi produk |
| main_image | text | Ya | Path/URL gambar utama |
| gallery | jsonb | Tidak | Daftar gambar tambahan |
| status | text | Ya | draft/published |
| created_at | timestamptz | Ya | Waktu dibuat |
| updated_at | timestamptz | Ya | Waktu diperbarui |

Constraint:

- `product_code` unik;
- `slug` unik;
- `status` hanya `draft` atau `published`.

## 19.2 Tabel `categories`

| Field | Tipe |
|---|---|
| id | uuid |
| name | text |
| slug | text |
| description | text |
| image | text |
| is_active | boolean |
| created_at | timestamptz |

Kategori sebaiknya menggunakan tabel terpisah agar admin dapat memperluas kategori tanpa mengubah kode.

## 19.3 Tabel `profiles`

Digunakan untuk menghubungkan user Supabase Auth dengan role aplikasi.

| Field | Tipe |
|---|---|
| id | uuid |
| email | text |
| role | text |
| created_at | timestamptz |

Role minimum: `admin`.

---

# 20. Penyimpanan Gambar

Gunakan Supabase Storage.

Bucket yang disarankan:

`product-images`

Struktur path:

```text
product-images/
├── AZK-001/
│   ├── main.webp
│   ├── 02.webp
│   └── 03.webp
├── AZK-002/
│   └── main.webp
```

Aturan:

- gunakan WebP atau AVIF jika pipeline memungkinkan;
- jangan upload foto kamera mentah berukuran sangat besar;
- tetapkan batas ukuran upload;
- kompres gambar sebelum ditampilkan;
- gunakan responsive image sizes;
- lazy-load gambar di bawah viewport.

Hero image dapat menggunakan ukuran lebih besar, tetapi tetap harus dioptimasi.

---

# 21. WhatsApp Integration

## 21.1 Format dasar

```text
https://wa.me/<NOMOR>?text=<PESAN_TER-ENCODE>
```

Nomor menggunakan format internasional tanpa `+`, misalnya:

```text
6281234567890
```

Nomor di atas hanya contoh. Nomor produksi harus menggunakan nomor resmi Azka Meubel.

## 21.2 Pesan detail produk

Template:

> Halo Azka Meubel, saya tertarik dengan produk [NAMA PRODUK] (ID Produk: [ID PRODUK]). Saya ingin menanyakan ketersediaan dan detail produk.

## 21.3 Pesan dari halaman kontak

Template:

> Halo Azka Meubel, saya [NAMA]. Nomor WhatsApp saya [NOMOR]. Saya ingin menanyakan: [PESAN].

---

# 22. Responsif

## 22.1 Desktop

Target utama:

- 1280 px+
- layout maksimal sekitar 1440 px mengikuti karakter desain;
- grid editorial;
- navigasi horizontal;
- galeri produk multi-kolom.

## 22.2 Tablet

- navigasi dapat dipadatkan;
- grid produk menjadi 2 kolom;
- section split dapat berubah menjadi stacked;
- font heading disesuaikan agar tidak pecah.

## 22.3 Mobile

Target minimum pengujian:

- 320 px;
- 360 px;
- 375 px;
- 390 px;
- 414 px;
- 430 px.

Perilaku:

- menu menjadi hamburger;
- grid produk menjadi 1 atau 2 kolom sesuai desain;
- hero tetap proporsional;
- teks tidak keluar viewport;
- tombol dapat disentuh dengan nyaman;
- form menjadi satu kolom;
- galeri detail produk menjadi vertical stack / swipe gallery;
- footer menjadi beberapa blok yang ditumpuk.

## 22.4 Larangan

- tidak boleh ada horizontal scrolling;
- tidak boleh ada teks terpotong;
- tidak boleh ada tombol keluar viewport;
- tidak boleh menggunakan ukuran fixed yang memaksa desktop layout pada mobile;
- tidak boleh hanya mengecilkan desain desktop tanpa mengatur ulang hierarki.

---

# 23. Performance

Target utama adalah website ringan dan cepat.

Strategi:

1. Astro digunakan sebagai frontend utama.
2. Hindari library JavaScript besar yang tidak diperlukan.
3. Gunakan image optimization.
4. Gunakan lazy loading pada gambar non-hero.
5. Gunakan font secukupnya.
6. Hindari autoplay video background pada MVP.
7. Hindari animasi berat.
8. Hindari carousel library besar jika carousel sederhana dapat dibuat dengan CSS/JS ringan.
9. Minimize client-side JavaScript.
10. Gunakan cache/CDN Vercel dan caching asset.

Target Lighthouse awal:

- Performance: ≥ 90 jika kondisi hosting, gambar, dan jaringan mendukung;
- Accessibility: ≥ 90;
- Best Practices: ≥ 90;
- SEO: ≥ 90.

Angka tersebut merupakan target kualitas, bukan jaminan skor pasti karena hasil Lighthouse bergantung pada asset dan kondisi runtime.

---

# 24. SEO

Setiap halaman harus memiliki:

- `<title>` unik;
- meta description;
- canonical URL;
- Open Graph image;
- heading hierarchy yang benar;
- alt text gambar;
- URL yang mudah dibaca.

Contoh:

```text
/products/kursi-jati-minimalis
```

Bukan:

```text
/products?id=18
```

Untuk produk:

```text
<title>Kursi Jati Minimalis | AZKA MEUBEL</title>
```

---

# 25. Accessibility

Wajib:

- alt text pada gambar informatif;
- kontras warna yang mencukupi;
- navigasi keyboard;
- focus state yang terlihat;
- label form jelas;
- tombol mempunyai nama yang jelas;
- tidak menggunakan ikon sebagai satu-satunya penjelasan fungsi;
- heading tersusun hierarkis.

---

# 26. Security

## Frontend

- jangan expose Supabase service role key;
- hanya public/anon key yang boleh digunakan pada client jika memang diperlukan;
- secret disimpan sebagai environment variable.

## Supabase

- aktifkan RLS pada tabel terkait;
- public hanya boleh membaca produk `published`;
- hanya user dengan role admin yang dapat melakukan insert/update/delete;
- storage write hanya boleh dilakukan admin;
- validasi tipe dan ukuran file upload;
- validasi data di sisi client dan server/database policy.

## Admin

- gunakan Supabase Auth;
- jangan menyimpan password sendiri di database custom;
- sesi harus divalidasi sebelum membuka halaman admin.

---

# 27. Dynamic Content vs Static Content

## Dinamis dari database

- daftar produk;
- detail produk;
- kategori;
- harga;
- gambar produk;
- status publikasi;
- produk terkait.

## Statis / konfigurasi

- navigasi utama;
- struktur layout;
- copy brand utama jika tidak memerlukan CMS;
- footer;
- nomor WhatsApp melalui environment/config.

Dengan demikian admin hanya perlu CRUD produk, sesuai scope proyek.

---

# 28. State UI yang Wajib

Setiap halaman/data dinamis harus mempertimbangkan:

## Loading

Menampilkan skeleton atau indikator ringan.

## Empty

Contoh:

> Belum ada produk pada kategori ini.

## Error

Contoh:

> Produk tidak dapat dimuat. Silakan coba lagi.

## Success

Untuk admin:

> Produk berhasil disimpan.

## Delete confirmation

> Apakah Anda yakin ingin menghapus produk ini?

---

# 29. Validasi Produk

## Wajib

- Nama produk tidak boleh kosong;
- ID produk tidak boleh kosong;
- ID produk harus unik;
- slug harus unik;
- kategori wajib dipilih;
- gambar utama wajib tersedia untuk produk published.

## Harga

- harus berupa angka valid;
- tidak boleh negatif.

## Upload gambar

Batasi:

- format: JPG, JPEG, PNG, WebP/AVIF sesuai pipeline;
- ukuran maksimum sesuai konfigurasi aplikasi;
- jumlah galeri dibatasi untuk mencegah storage tidak terkendali.

---

# 30. Struktur Folder yang Disarankan

```text
azka-meubel/
├── public/
│   ├── favicon.svg
│   └── ...
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── CategoryCard.astro
│   │   ├── ProductCard.astro
│   │   ├── ProductGrid.astro
│   │   ├── ProductGallery.astro
│   │   ├── WhatsAppButton.astro
│   │   └── ...
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── products/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── contact.astro
│   │   └── admin/
│   │       ├── index.astro
│   │       └── products/
│   │           ├── index.astro
│   │           ├── new.astro
│   │           └── [id]/edit.astro
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── products.ts
│   │   └── whatsapp.ts
│   └── styles/
│       └── global.css
├── .env
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
└── README.md
```

Nama dan struktur dapat menyesuaikan versi Astro yang digunakan, tetapi pemisahan concern harus tetap jelas.

---

# 31. Environment Variables

Minimal:

```env
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_PUBLISHABLE_KEY=
PUBLIC_WHATSAPP_NUMBER=
```

Jangan masukkan service role key ke client/browser.

Jika server-side operation membutuhkan secret tambahan, gunakan variable non-public yang hanya tersedia di server.

---

# 32. Aturan Konten dari Desain Stitch

Desain Stitch mengandung sejumlah nama, alamat, angka, klaim material, sertifikasi, jumlah pelanggan, lokasi, dan pernyataan produksi yang tampak seperti data nyata.

**Semua data tersebut harus dianggap sebagai placeholder sampai dikonfirmasi oleh pemilik bisnis.**

Contoh yang wajib diverifikasi sebelum produksi:

- FSC certification;
- asal material;
- lokasi Jepara/Jakarta;
- alamat showroom;
- angka statistik;
- testimoni pelanggan;
- klaim pengiriman internasional;
- klaim jumlah tahun pengalaman;
- nama pelanggan;
- harga produk contoh;
- nomor WhatsApp;
- akun Instagram.

Jangan memasukkan klaim tersebut ke website produksi hanya karena terdapat di mockup.

---

# 33. Konten Bahasa Indonesia yang Ditetapkan

Semua navigasi dan CTA utama menggunakan Bahasa Indonesia:

| Elemen | Teks |
|---|---|
| Beranda | Beranda |
| About | Tentang Kami |
| Products | Produk |
| Contact | Kontak |
| WhatsApp | Chat WhatsApp |
| Hero CTA | Lihat Produk |
| Hero secondary | Chat via WhatsApp |
| Category | Jelajahi Kategori |
| Featured | Produk Unggulan |
| Product detail | Lihat Detail |
| Related | Produk Pelengkap |
| Contact | Hubungi Azka Meubel |
| Send | Kirim via WhatsApp |
| Admin | Panel Admin |
| Add | Tambah Produk |
| Edit | Edit Produk |
| Delete | Hapus |
| Publish | Terbitkan |
| Draft | Simpan sebagai Draft |
| Load more | Muat Lebih Banyak |
| Back | Kembali |

Nama produk tetap menggunakan nama yang berasal dari database.

---

# 34. User Stories

## Pengunjung

### US-01
Sebagai pengunjung, saya ingin melihat identitas Azka Meubel agar memahami brand.

### US-02
Sebagai pengunjung, saya ingin melihat kategori agar cepat menemukan jenis furnitur.

### US-03
Sebagai pengunjung, saya ingin melihat daftar produk agar dapat membandingkan pilihan.

### US-04
Sebagai pengunjung, saya ingin membuka detail produk agar dapat mengetahui informasi sebelum menghubungi penjual.

### US-05
Sebagai pengunjung, saya ingin menekan tombol WhatsApp agar dapat langsung berkonsultasi mengenai produk yang sedang saya lihat.

### US-06
Sebagai pengunjung mobile, saya ingin website tetap mudah digunakan tanpa zoom atau horizontal scrolling.

## Admin

### US-07
Sebagai admin, saya ingin login agar hanya pihak berwenang yang dapat mengelola produk.

### US-08
Sebagai admin, saya ingin menambah produk tanpa mengubah kode.

### US-09
Sebagai admin, saya ingin mengubah produk tanpa deploy ulang.

### US-10
Sebagai admin, saya ingin menghapus produk.

### US-11
Sebagai admin, saya ingin menyimpan produk sebagai draft agar belum tampil ke publik.

### US-12
Sebagai admin, saya ingin menerbitkan produk agar tampil di katalog publik.

---

# 35. Acceptance Criteria

## Website publik

- Semua halaman dapat dibuka tanpa error.
- Semua menu navigasi berfungsi.
- Semua teks publik berbahasa Indonesia.
- Produk yang tampil berasal dari database.
- Produk draft tidak muncul di publik.
- Detail produk dapat dibuka berdasarkan slug.
- Tombol WhatsApp menghasilkan pesan dengan nama dan ID produk yang benar.
- Website responsif pada desktop dan mobile.
- Tidak ada horizontal overflow.
- Foto memiliki alt text.

## Admin

- Pengguna yang belum login tidak dapat mengakses dashboard.
- Admin dapat membuat produk.
- Admin dapat mengedit produk.
- Admin dapat menghapus produk.
- Admin dapat upload gambar.
- Admin dapat memilih draft/published.
- Produk published muncul di website tanpa deploy ulang.
- Produk draft tidak muncul di website.
- RLS mencegah pengguna publik melakukan CRUD.

## Kontak

- Form dapat divalidasi.
- Submit menghasilkan URL WhatsApp yang benar.
- Tidak ada data kosong yang dikirim sebagai pesan.

---

# 36. Pengujian Wajib

## Functional testing

1. Tambah produk.
2. Edit produk.
3. Hapus produk.
4. Publish produk.
5. Draft produk.
6. Filter kategori.
7. Buka detail produk.
8. Klik WhatsApp dari detail.
9. Kirim form kontak via WhatsApp.
10. Logout admin.

## Responsive testing

Uji minimal pada:

- 320 px
- 360 px
- 375 px
- 390 px
- 414 px
- 768 px
- 1024 px
- 1280 px
- 1440 px

## Security testing

- akses `/admin` tanpa login;
- akses halaman edit tanpa login;
- percobaan insert dengan public client;
- percobaan update dengan non-admin;
- percobaan delete dengan non-admin;
- upload file invalid;
- akses produk draft melalui URL publik.

## Performance testing

- Lighthouse;
- ukuran image;
- request JavaScript;
- request halaman produk;
- loading mobile pada jaringan lambat.

---

# 37. Definition of Done

Fitur dianggap selesai apabila:

- implementasi sesuai `design-web`;
- seluruh UI publik menggunakan Bahasa Indonesia;
- desktop dan mobile telah diuji;
- CRUD produk berjalan;
- login admin berjalan;
- RLS aktif;
- gambar produk dapat diupload;
- produk published tampil di publik;
- detail produk mengambil data dinamis;
- tombol WhatsApp dinamis;
- tidak ada data placeholder bisnis yang belum diverifikasi di production;
- tidak ada horizontal scrolling;
- SEO dasar aktif;
- tidak ada secret key di browser;
- deployment Vercel berhasil;
- database Supabase terhubung;
- dokumentasi setup tersedia di README.

---

# 38. Prioritas Pengembangan

## P0 — Wajib untuk MVP

1. Setup Astro.
2. Setup Tailwind.
3. Setup Supabase.
4. Database products dan categories.
5. Supabase Auth.
6. RLS.
7. Admin CRUD produk.
8. Upload gambar.
9. Beranda.
10. Produk.
11. Detail produk.
12. About.
13. Contact.
14. WhatsApp integration.
15. Responsive desktop/mobile.
16. Deployment Vercel.

## P1 — Setelah MVP

- pencarian produk;
- sorting;
- pengelolaan kategori dari admin;
- metadata SEO per produk;
- galeri produk yang lebih lengkap;
- preview sebelum publish.

## P2 — Pengembangan berikutnya bila diperlukan

- CMS untuk konten Home/About/Contact;
- analitik pengunjung;
- integrasi Google Analytics/alternative analytics;
- wishlist;
- manajemen stok;
- katalog PDF.

Fitur P1 dan P2 tidak boleh menghambat penyelesaian MVP.

---

# 39. Deployment

## Frontend

Deploy project Astro ke Vercel.

## Database

Supabase menjadi database online.

## Storage

Supabase Storage menyimpan foto produk.

## Domain

Domain produksi:

`https://azkameubel.com`

Admin:

`https://azkameubel.com/admin`

Pastikan HTTPS aktif.

---

# 40. Alur Lengkap Penggunaan Sistem

## Pengunjung

```text
Beranda
   ↓
Jelajahi Kategori / Produk Unggulan
   ↓
Daftar Produk
   ↓
Detail Produk
   ↓
Chat via WhatsApp
   ↓
WhatsApp Azka Meubel
```

## Admin

```text
azkameubel.com/admin
        ↓
      Login
        ↓
     Dashboard
        ↓
      Produk
        ↓
 + Tambah Produk
        ↓
 Isi data + upload foto
        ↓
       Simpan
        ↓
 Publish
        ↓
Produk muncul di website publik
```

---

# 41. Keputusan Arsitektur Final

Untuk versi MVP, gunakan:

**Astro + Tailwind CSS + Supabase + Vercel + WhatsApp.**

Tidak perlu menambahkan backend server custom seperti Express/FastAPI/Laravel selama kebutuhan hanya mencakup katalog produk, login admin, CRUD, storage gambar, dan link WhatsApp.

Supabase berfungsi sebagai layanan backend/data:

- PostgreSQL;
- Authentication;
- Storage;
- API;
- RLS.

Vercel digunakan untuk hosting aplikasi frontend Astro.

---

# 42. Aturan Implementasi Visual

Implementasi harus mempertahankan:

- whitespace yang luas;
- grid editorial;
- gambar produk sebagai fokus utama;
- tipografi besar namun terkontrol;
- warna netral dan hangat;
- tombol sederhana;
- border dan shadow minimal;
- tidak menggunakan glassmorphism;
- tidak menggunakan gradient berlebihan;
- tidak menggunakan animasi berlebihan;
- tidak menggunakan card yang terlalu bulat;
- tidak menggunakan komponen dekoratif acak.

Prioritas visual:

**Foto produk → tipografi → spacing → hierarchy → interaksi.**

---

# 43. Source of Truth File Desain

Folder desain yang menjadi acuan implementasi:

```text
/design-web/
└── stitch_azka_meubel_furniture_studio/
    ├── home_azka_meubel/
    │   ├── screen.png
    │   └── code.html
    ├── products_azka_meubel/
    │   ├── screen.png
    │   └── code.html
    ├── product_detail_kanso_chair_azka_meubel/
    │   ├── screen.png
    │   └── code.html
    ├── about_azka_meubel/
    │   ├── screen.png
    │   └── code.html
    ├── contact_azka_meubel/
    │   ├── screen.png
    │   └── code.html
    └── furnexa.framer.website.png/
        └── screen.png
```

`screen.png` digunakan sebagai referensi visual.

`code.html` digunakan sebagai referensi struktur/layout hasil Stitch, bukan sebagai kode produksi final yang harus ditempel mentah ke project Astro.

---

# 44. Catatan Final

PRD ini menetapkan satu sumber kebenaran implementasi:

1. **Desain pada folder `design-web`** menentukan karakter visual dan struktur section.
2. **PRD ini** menentukan perilaku sistem, data, bahasa, responsivitas, security, dan scope.
3. **Konten bisnis nyata** harus menjadi sumber kebenaran untuk alamat, nomor WhatsApp, harga, material, sertifikasi, testimonial, statistik, dan klaim lainnya.

Dengan aturan tersebut, pengembangan tidak perlu mengulang proses desain atau melakukan revisi konseptual berulang. Perubahan setelah tahap implementasi seharusnya hanya terjadi apabila ada bug, data bisnis yang diperbarui, atau kebutuhan fungsional baru yang memang disepakati.
