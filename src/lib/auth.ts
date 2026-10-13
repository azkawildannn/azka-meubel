import { supabase } from './supabase';

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
}

/**
 * IMPORTANT: This function only works on client-side (browser)
 * On server-side (SSR), it will return null because localStorage is not available
 * For proper SSR auth, we need to use cookies with @supabase/ssr
 */
export async function getSession() {
  // Check if we're on the server (no window object)
  if (typeof window === 'undefined') {
    // Server-side: return null for now
    // In production, you should implement cookie-based session
    return null;
  }

  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    throw error;
  }

  return data.session;
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    throw error;
  }

  return data.user;
}

export async function isAdmin() {
  try {
    const user = await getUser();
    
    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      return false;
    }

    return data.role === 'admin';
  } catch (error) {
    return false;
  }
}
