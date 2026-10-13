export interface Product {
  id: string;
  product_code: string;
  name: string;
  slug: string;
  category_id: string;
  category?: Category;
  short_description?: string | null;
  description?: string | null;
  price?: number | null;
  show_price: boolean;
  material?: string | null;
  finish?: string | null;
  dimensions?: string | null;
  main_image: string;
  gallery?: string[] | null;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  is_active: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  role: 'admin';
  created_at: string;
}
