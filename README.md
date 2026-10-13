# AZKA MEUBEL - Website Katalog Furnitur

Website katalog furnitur profesional untuk AZKA MEUBEL dengan fitur admin CRUD dan integrasi WhatsApp.

## 🎯 Fitur

### Website Publik
- **Beranda** - Hero, kategori, produk unggulan ✅
- **Tentang Kami** - Filosofi brand dan keahlian ✅
- **Produk** - Katalog lengkap dengan filter kategori ✅
- **Detail Produk** - Galeri, spesifikasi, dan CTA WhatsApp ✅
- **Kontak** - Form kontak yang langsung ke WhatsApp ✅

### Area Admin
- **Login** - Autentikasi Supabase ✅
- **Dashboard** - Statistik dan aksi cepat ✅
- **CRUD Produk** - Tambah, edit, hapus produk ✅
- **Upload Gambar** - File upload ke Supabase Storage ✅
- **Publikasi** - Draft/Published status ✅
- **Image Management** - Preview dan validasi ✅

### Fitur Teknis
- **Responsive** - Desktop, tablet, mobile ✅
- **SSR** - Server-side rendering dengan Astro ✅
- **Dynamic Data** - Produk dari Supabase PostgreSQL ✅
- **WhatsApp Integration** - Pesan otomatis dengan detail produk ✅
- **RLS** - Row Level Security untuk keamanan ✅
- **Storage Security** - Admin-only upload policies ✅
- **SEO Ready** - Meta tags dan semantic HTML ✅
- **File Upload** - Direct upload ke Supabase Storage ✅

## 🛠 Tech Stack

- **Frontend**: Astro
- **Styling**: CSS (design system custom)
- **Backend**: Supabase
  - PostgreSQL
  - Auth
  - Storage
  - RLS Policies
- **Deployment**: Vercel
- **Messaging**: WhatsApp (wa.me)

## 📦 Installation

### 1. Clone / Setup Project

Project sudah siap di `C:\azka-meubel`

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

#### A. Buat Project Supabase

1. Buka [supabase.com](https://supabase.com)
2. Buat project baru
3. Catat URL dan ANON KEY

#### B. Jalankan Migration

1. Buka SQL Editor di Supabase Dashboard
2. Copy isi file `supabase/migrations/001_initial_schema.sql`
3. Execute SQL

Migration akan membuat:
- Tabel `profiles`, `categories`, `products`
- RLS policies
- Default categories
- Indexes

#### C. Buat Admin User

1. Buka Authentication di Supabase Dashboard
2. Buat user baru dengan email & password
3. Catat User ID
4. Di SQL Editor, jalankan:

```sql
INSERT INTO profiles (id, email, role)
VALUES ('USER_ID_DARI_AUTH', 'admin@email.com', 'admin');
```

#### D. Setup Storage

1. Buka Storage di Supabase Dashboard
2. Buat bucket baru: `product-images`
3. Set bucket sebagai **Public**
4. Jalankan migration storage policies:
   - Buka SQL Editor
   - Copy isi `supabase/migrations/002_storage_policies.sql`
   - Execute SQL

Policies akan:
- Allow public read
- Allow admin upload/update/delete only

### 4. Environment Variables

Buat file `.env` di root project:

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
PUBLIC_WHATSAPP_NUMBER=628123456789
```

Ganti dengan nilai sebenarnya:
- **PUBLIC_SUPABASE_URL**: URL project Supabase
- **PUBLIC_SUPABASE_PUBLISHABLE_KEY**: Publishable/public key dari Supabase (diawali `sb_publishable_`)
- **PUBLIC_WHATSAPP_NUMBER**: Nomor WhatsApp (format: 628xxx tanpa +)

### 5. Development

```bash
npm run dev
```

Website akan berjalan di `http://localhost:4321`

## 🚀 Deployment

### Vercel

1. Push code ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Set Framework Preset: **Astro**
4. Tambahkan Environment Variables:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `PUBLIC_WHATSAPP_NUMBER`
5. Deploy

Domain default: `your-project.vercel.app`

Custom domain dapat ditambahkan di Vercel settings.

## 📁 Struktur Project

```
azka-meubel/
├── prd.md                      # Product Requirements Document
├── design-web/                 # Referensi desain visual
├── src/
│   ├── components/             # Komponen reusable
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── ProductCard.astro
│   ├── layouts/                # Layout template
│   │   ├── BaseLayout.astro
│   │   └── AdminLayout.astro
│   ├── lib/                    # Business logic
│   │   ├── supabase.ts        # Supabase client
│   │   ├── products.ts        # Product functions
│   │   ├── auth.ts            # Auth functions
│   │   └── whatsapp.ts        # WhatsApp helpers
│   ├── pages/                  # Routes
│   │   ├── index.astro        # Beranda
│   │   ├── about.astro        # Tentang Kami
│   │   ├── contact.astro      # Kontak
│   │   ├── products/
│   │   │   ├── index.astro    # List produk
│   │   │   └── [slug].astro   # Detail produk
│   │   └── admin/
│   │       ├── index.astro    # Login/Dashboard
│   │       └── products/
│   │           ├── index.astro    # List admin
│   │           ├── new.astro      # Tambah (TODO)
│   │           └── [id]/edit.astro # Edit (TODO)
│   ├── styles/
│   │   └── global.css          # Global styles
│   └── types/
│       └── index.ts            # TypeScript types
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── public/                     # Static assets
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 🗄 Database Schema

### products

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| product_code | TEXT | ID produk (unique) |
| name | TEXT | Nama produk |
| slug | TEXT | URL slug (unique) |
| category_id | UUID | Foreign key ke categories |
| short_description | TEXT | Deskripsi singkat |
| description | TEXT | Deskripsi lengkap |
| price | NUMERIC | Harga |
| show_price | BOOLEAN | Tampilkan harga? |
| material | TEXT | Material produk |
| finish | TEXT | Finishing |
| dimensions | TEXT | Dimensi |
| main_image | TEXT | URL gambar utama |
| gallery | JSONB | Array URL gambar tambahan |
| status | TEXT | draft/published |
| created_at | TIMESTAMPTZ | Waktu dibuat |
| updated_at | TIMESTAMPTZ | Waktu diupdate |

### categories

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Nama kategori |
| slug | TEXT | URL slug (unique) |
| description | TEXT | Deskripsi |
| image | TEXT | URL gambar |
| is_active | BOOLEAN | Aktif? |
| created_at | TIMESTAMPTZ | Waktu dibuat |

### profiles

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | User ID (dari auth.users) |
| email | TEXT | Email |
| role | TEXT | Role (admin) |
| created_at | TIMESTAMPTZ | Waktu dibuat |

## 🔒 Security

### RLS Policies

**Public Access:**
- SELECT products WHERE status = 'published'
- SELECT categories WHERE is_active = true

**Admin Access:**
- Full CRUD products
- Full CRUD categories

### Environment Security

- ❌ **JANGAN** commit file `.env`
- ❌ **JANGAN** expose `SUPABASE_SERVICE_ROLE_KEY`
- ✅ Gunakan hanya `PUBLIC_SUPABASE_PUBLISHABLE_KEY` di client

## 📱 WhatsApp Integration

### Format Pesan Produk

```
Halo Azka Meubel, saya tertarik dengan produk [NAMA PRODUK] (ID Produk: [ID PRODUK]). Saya ingin menanyakan ketersediaan dan detail produk.
```

### Format Pesan Kontak

```
Halo Azka Meubel, saya [NAMA]. Nomor WhatsApp saya [NOMOR]. Saya ingin menanyakan: [PESAN]
```

Nomor WhatsApp diambil dari `PUBLIC_WHATSAPP_NUMBER`.

## 🎨 Design Guidelines

Desain mengikuti referensi di folder `design-web/`:
- Minimalis & editorial
- Typography: Newsreader (serif) + Hanken Grotesk (sans)
- Colors: Neutral warm (beige, brown, black)
- Layout: Spacious dengan fokus pada fotografi
- Responsive: Mobile-first

## 🧪 Testing Checklist

### Frontend
- [ ] Beranda load dengan benar
- [ ] Produk list tampil dari database
- [ ] Filter kategori bekerja
- [ ] Detail produk dapat dibuka
- [ ] WhatsApp button berfungsi
- [ ] Form kontak submit ke WhatsApp
- [ ] Responsive di mobile
- [ ] Responsive di tablet
- [ ] Responsive di desktop

### Admin
- [ ] Login dengan email/password
- [ ] Dashboard tampil statistik
- [ ] List produk tampil semua
- [ ] Tambah produk (TODO)
- [ ] Edit produk (TODO)
- [ ] Delete produk dengan konfirmasi
- [ ] Draft tidak muncul di publik
- [ ] Published langsung muncul di publik
- [ ] Logout berhasil

### Security
- [ ] RLS aktif
- [ ] Non-admin tidak bisa CRUD
- [ ] Draft tidak dapat diakses via URL publik
- [ ] Admin route redirect ke login jika belum auth

## 📝 TODO

### High Priority
✅ Halaman `/admin/products/new` - SELESAI
✅ Halaman `/admin/products/[id]/edit` - SELESAI
✅ Upload image ke Supabase Storage - SELESAI
✅ Slug generator otomatis - SELESAI
✅ Image validation - SELESAI

### Medium Priority
- [ ] Pagination/load more di halaman produk
- [ ] Search produk
- [ ] Filter by price range
- [ ] Categories CRUD admin

### Nice to Have
- [ ] Image optimization
- [ ] Product gallery lightbox
- [ ] Admin activity log
- [ ] Bulk actions
- [ ] Export data

## 🐛 Troubleshooting

### Build Error

```bash
npm run build
```

Jika ada TypeScript error, periksa:
- Import path benar
- Types sudah defined
- Supabase client tersedia

### Supabase Connection Error

Periksa:
- `.env` file ada dan benar
- `PUBLIC_SUPABASE_URL` dan `PUBLIC_SUPABASE_PUBLISHABLE_KEY` valid
- Network connection

### RLS Policy Error

Jika admin tidak bisa CRUD:
- Periksa user sudah ada di `profiles` table
- Periksa `role` = 'admin'
- Periksa RLS policies sudah di-execute

### Images Not Loading

Periksa:
- Supabase Storage bucket `product-images` sudah dibuat
- Bucket sudah set sebagai **Public**
- URL gambar valid

## 📚 Resources

- [Astro Docs](https://docs.astro.build)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [PRD](./prd.md)
- [Design Reference](./design-web/)

## 📄 License

Private project untuk AZKA MEUBEL.

## 👥 Contact

Untuk pertanyaan teknis, hubungi developer.

---

**Built with ❤️ using Astro + Supabase**
