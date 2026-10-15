# Changelog

All notable changes to AZKA MEUBEL project.

---

## [1.4.0] - 2026-10-15

### 🔍 Product Catalog Enhancement - Search & Category Update

**Added search functionality and updated product categories (Pintu, Custom, Lainnya)**

#### New Features:
✅ **Product Search**:
- Search bar above category filters
- Searches across: product name, code, description, category
- Case-insensitive matching
- Preserves category context when searching
- Clear button to remove search query
- Mobile-responsive design

✅ **Category Updates**:
- **Added**: Pintu (pintu)
- **Added**: Custom (custom)
- **Added**: Lainnya (lainnya) - virtual category for uncategorized products
- **Removed**: Kamar Tidur (kamar-tidur) - kept in database for existing products
- **Removed**: Ruang Kerja (ruang-kerja) - kept in database for existing products

#### Category Logic:
- **Lainnya** displays products NOT in main categories (kursi, sofa, meja, lemari, pintu, custom)
- Existing products with old categories (kamar-tidur, ruang-kerja) appear in "Lainnya"
- No data loss - old categories remain in database
- Admin can update product categories to new options

#### Search + Filter Integration:
- Search works with category filters
- URL structure: `/products?category=meja&q=jati`
- Switching categories preserves search query
- Empty states distinguish between "no results" and "no products"

#### Updated Files:
- `src/pages/products/index.astro` - Added search UI and updated filter list
- `src/lib/products.ts` - Added search and "lainnya" logic
- `supabase/migrations/003_update_categories.sql` - New categories (Pintu, Custom)

#### Admin Integration:
- Categories dropdown automatically reflects database categories
- Admin can assign products to Pintu and Custom
- Old categories still editable until admin updates them
- No manual admin file changes needed

#### URL Examples:
- `/products` - All products
- `/products?category=kursi` - Kursi category
- `/products?category=pintu` - Pintu category
- `/products?category=custom` - Custom category
- `/products?category=lainnya` - Other categories
- `/products?q=meja` - Search "meja" in all products
- `/products?category=kursi&q=jati` - Search "jati" in Kursi category

#### Verification:
- ✅ Build successful: 0 errors
- ✅ No trailing whitespace
- ✅ Production audit: 0 vulnerabilities
- ✅ TypeScript types: Valid
- ✅ Filter bar wraps properly on tablet (922px)
- ✅ Search bar responsive on mobile
- ✅ Empty states updated with context

#### Responsive Design:
- Desktop: Single-row filters + full search bar
- Tablet (922px): Wrapped filters + search bar
- Mobile: Stacked filters + full-width search
- Grid maintained: 3 columns desktop, 2 columns mobile

#### Migration Instructions:
1. Run migration: `003_update_categories.sql` (adds Pintu, Custom to database)
2. No manual data migration needed
3. Admin can update old products to new categories as needed
4. Products with old categories automatically appear in "Lainnya"

---

## [1.3.0] - 2026-10-13

### 🔒 Major Security & Runtime Update - Astro 7 + Node.js 24

**Fixed critical vulnerabilities and upgraded to Astro 7 with Node.js 24 runtime**

#### Security Fixes:
✅ **Production Dependencies: 0 vulnerabilities** (100% resolved)
- Fixed CVE-2026-54298: XSS via unescaped spread attributes (critical)
- Fixed CVE-2026-96889: librsvg vulnerability in sharp
- Fixed CVE-2026-33327, CVE-2026-33328: libvips vulnerabilities
- Fixed esbuild arbitrary file read on Windows
- Fixed GHSA-9wv6-86v2-598j: path-to-regexp DoS via override to v6.3.0

✅ Dev Dependencies: 7 vulnerabilities (Tailwind CSS 3.x - not in production bundle)

#### Major Upgrades:
✅ **Astro**: `5.18.2` → `7.3.8` (latest stable)
- Fixed all XSS vulnerabilities
- Fixed host header SSRF
- Fixed authorization bypass issues
- Fixed remote code execution via AVIF optimization

✅ **@astrojs/vercel**: `8.2.11` → `11.0.14` (latest stable)
- Enhanced routing security
- Better runtime compatibility

✅ **@astrojs/check**: `0.9.0` → `0.9.10`

✅ **path-to-regexp**: `6.1.0` → `6.3.0` (via npm overrides)
- Resolved DoS vulnerability while maintaining v6 compatibility
- Build verified without redirect pattern errors

✅ **Node.js**: `22` → `24`
- `.nvmrc`: Updated to 24
- `package.json`: engines.node → `>=24.0.0`
- Vercel runtime will use Node.js 24.x

#### Tailwind Migration:
✅ Migrated from **@astrojs/tailwind** integration to **native Vite + PostCSS**:
- Removed deprecated `@astrojs/tailwind` (incompatible with Astro 7)
- Configured Tailwind 3 via Vite CSS pipeline
- Added PostCSS config with autoprefixer
- All custom design preserved (colors, spacing, fonts, utilities)

#### Configuration Changes:
- `astro.config.mjs`: Removed Tailwind integration, added Vite CSS config
- `postcss.config.cjs`: Added for Tailwind processing
- `package.json`: Added npm overrides for path-to-regexp
- Disabled Vercel web analytics and speed insights (not used)

#### Verification:
- ✅ Build successful: 0 errors
- ✅ All routes working (15 pages)
- ✅ Server rendering maintained
- ✅ Supabase integration working
- ✅ Tailwind classes preserved
- ✅ **Production audit: 0 vulnerabilities** ⭐
- ✅ path-to-regexp: 6.3.0 (overridden, compatible)
- ✅ Redirect patterns: Working correctly

#### Dependency Tree (Production):
```
azka-meubel@1.0.0
├── @astrojs/check@0.9.10
├── @astrojs/vercel@11.0.14
│   └── @vercel/routing-utils@6.6.0
│       └── path-to-regexp@6.3.0 (overridden)
├── @supabase/supabase-js@2.45.0
├── astro@7.3.8
└── typescript@5.6.0
```

#### Files Changed:
- `.nvmrc`
- `package.json` (overrides added)
- `package-lock.json`
- `astro.config.mjs`
- `postcss.config.cjs` (new)
- `CHANGELOG.md`

#### Breaking Changes Handled:
- Tailwind integration API change (migrated to Vite)
- Astro adapter API updates (applied)
- path-to-regexp syntax compatibility (override to v6.3.0)
- No visual or functional changes to website

---

## [1.2.0] - 2026-10-13

### 🚀 Deployment Fix - Vercel Runtime Compatibility

**Fixed first deployment failure by upgrading Astro and adapter to support Node.js 22.x runtime**

#### Problem:
- First Vercel deployment failed with "Invalid function runtime: nodejs18.x"
- Build was successful but Vercel rejected serverless functions
- Project was using outdated Astro 4 and adapter v7

#### Solution:
✅ Upgraded to latest stable versions:
- Astro: `4.15.0` → `5.18.2`
- @astrojs/vercel: `7.8.0` → `8.2.11`
- Node.js requirement: `>=18.0.0` → `>=22.0.0`

✅ Updated adapter import (deprecated warning fixed):
- From: `@astrojs/vercel/serverless`
- To: `@astrojs/vercel`

✅ Configuration updated:
- `.nvmrc`: `18` → `22`
- `package.json`: engines.node → `>=22.0.0`
- `astro.config.mjs`: Updated adapter import

#### Verification:
- ✅ Runtime output: **nodejs22.x** (confirmed in `.vc-config.json`)
- ✅ Build successful: 0 errors
- ✅ No deprecation warnings
- ✅ All features preserved (admin, products, Supabase integration)

#### Files Changed:
- `.nvmrc`
- `package.json`
- `package-lock.json`
- `astro.config.mjs`

#### Deployment Readiness:
- ✅ Compatible with Vercel's latest runtime requirements
- ✅ Server rendering mode maintained
- ✅ All integrations (Tailwind, Supabase) working
- ✅ Ready for production deployment

---

## [1.1.0] - 2026-10-09

### ✅ Verified - Supabase API Key Configuration

**Project sudah menggunakan Supabase API key terbaru sesuai konvensi**

#### Configuration Status:
- ✅ Menggunakan `PUBLIC_SUPABASE_PUBLISHABLE_KEY` (bukan `ANON_KEY`)
- ✅ Semua referensi sudah konsisten di seluruh project
- ✅ Mengikuti konvensi Supabase terbaru (publishable keys diawali `sb_publishable_`)
- ✅ Build production berhasil (0 errors)

#### Files Updated:
- ✅ `src/lib/supabase.ts` - Client initialization
- ✅ `.env.example` - Environment template
- ✅ `README.md` - Main documentation
- ✅ `SETUP_GUIDE.md` - Setup instructions
- ✅ `TESTING_CHECKLIST.md` - Testing guide
- ✅ `FINAL_REPORT.md` - Project report
- ✅ `prd.md` - PRD reference

#### Required Environment Variables:

```env
PUBLIC_SUPABASE_URL=https://xxx.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxx
PUBLIC_WHATSAPP_NUMBER=628123456789
```

#### How to Get Publishable Key:
1. Go to Supabase Dashboard → Settings → API
2. Find "Project API keys" section
3. Copy the **publishable key** (starts with `sb_publishable_`)
4. Add to your `.env` file

#### Verification:
- ✅ Build successful: `npm run build` (0 errors)
- ✅ All imports updated
- ✅ Documentation updated
- ✅ Backward compatible (Supabase SDK accepts both formats)

---

## [1.0.0] - 2026-10-08

### 🎉 Initial Release

**Complete implementation of AZKA MEUBEL furniture catalog website**

#### Features Implemented:

**Public Website (5 pages)**:
- ✅ Homepage with hero, categories, featured products
- ✅ About page with brand story
- ✅ Products listing with category filter
- ✅ Product detail with gallery and WhatsApp CTA
- ✅ Contact form with WhatsApp integration

**Admin Panel (5 pages)**:
- ✅ Login with Supabase Auth
- ✅ Dashboard with statistics
- ✅ Product list with CRUD operations
- ✅ Add product form with file upload
- ✅ Edit product form

**Backend & Database**:
- ✅ PostgreSQL schema (3 tables)
- ✅ Row Level Security (RLS) policies
- ✅ Supabase Storage integration
- ✅ Storage security policies
- ✅ 2 migration files ready

**Features**:
- ✅ File upload to Supabase Storage
- ✅ Image validation (type, size, preview)
- ✅ WhatsApp dynamic messages
- ✅ Draft/Published workflow
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ SEO optimization
- ✅ Accessibility ready
- ✅ Custom design system

**Documentation**:
- ✅ README.md - Main documentation
- ✅ SETUP_GUIDE.md - Step-by-step setup
- ✅ TESTING_CHECKLIST.md - 250+ test cases
- ✅ FINAL_REPORT.md - Complete implementation report

**Tech Stack**:
- Astro 4.15.0 (SSR)
- Supabase (PostgreSQL, Auth, Storage)
- TypeScript (strict mode)
- Vercel Serverless
- Custom CSS design system

**Build Status**: ✅ Production ready (0 errors)

---

## Notes

### Versioning
- **Major**: Breaking changes
- **Minor**: New features, backward compatible
- **Patch**: Bug fixes

### Support
- For setup issues, see `SETUP_GUIDE.md`
- For testing, see `TESTING_CHECKLIST.md`
- For troubleshooting, see `README.md`
