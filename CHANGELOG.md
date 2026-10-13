# Changelog

All notable changes to AZKA MEUBEL project.

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
