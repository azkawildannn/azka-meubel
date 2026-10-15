import { supabase } from './supabase';
import type { Product } from '../types';

export async function getPublishedProducts(categorySlug?: string, searchQuery?: string, limit?: number) {
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  let products = data as Product[];

  // Filter by category slug if provided
  if (categorySlug && categorySlug !== 'lainnya' && products) {
    products = products.filter(product => 
      product.category?.slug === categorySlug
    );
  }

  // Handle "lainnya" category - products not in main categories
  if (categorySlug === 'lainnya' && products) {
    const mainCategories = ['kursi', 'sofa', 'meja', 'lemari', 'pintu', 'custom'];
    products = products.filter(product =>
      !product.category?.slug || !mainCategories.includes(product.category.slug)
    );
  }

  // Filter by search query if provided
  if (searchQuery && products) {
    const query = searchQuery.toLowerCase().trim();
    products = products.filter(product => {
      const searchableFields = [
        product.name?.toLowerCase() || '',
        product.product_code?.toLowerCase() || '',
        product.short_description?.toLowerCase() || '',
        product.description?.toLowerCase() || '',
        product.category?.name?.toLowerCase() || ''
      ];

      return searchableFields.some(field => field.includes(query));
    });
  }

  return products;
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data as Product;
}

export async function getFeaturedProducts(limit = 6) {
  return getPublishedProducts(undefined, undefined, limit);
}

export async function getRelatedProducts(categoryId: string, currentProductId: string, limit = 3) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('category_id', categoryId)
    .eq('status', 'published')
    .neq('id', currentProductId)
    .limit(limit);

  if (error) {
    console.error('Error fetching related products:', error);
    return [];
  }

  return data as Product[];
}

export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all products:', error);
    return [];
  }

  return data as Product[];
}

export async function createProduct(product: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Product;
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  // Get current session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Anda harus login untuk memperbarui produk');
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .maybeSingle();

  if (!profile || profile.role !== 'admin') {
    throw new Error('Anda tidak memiliki izin untuk memperbarui produk');
  }

  // Perform update
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Update product error:', error);
    
    // Check for specific errors
    if (error.code === '23505') {
      if (error.message.includes('slug')) {
        throw new Error('Slug sudah digunakan oleh produk lain');
      }
      if (error.message.includes('product_code')) {
        throw new Error('Kode produk sudah digunakan');
      }
    }
    
    throw new Error(error.message || 'Gagal memperbarui produk');
  }

  if (!data) {
    throw new Error('Produk tidak ditemukan atau tidak dapat diperbarui');
  }

  return data as Product;
}

export async function deleteProduct(id: string) {
  // Get current session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Anda harus login untuk menghapus produk');
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .maybeSingle();

  if (!profile || profile.role !== 'admin') {
    throw new Error('Anda tidak memiliki izin untuk menghapus produk');
  }

  // Perform delete
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Delete product error:', error);
    throw new Error(error.message || 'Gagal menghapus produk');
  }

  return true;
}
