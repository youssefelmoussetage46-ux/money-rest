import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
  initialize: () => () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  initialize: () => {
    // Check if environment variables are set (without exposing values)
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      set({ user: null, loading: false });
      return () => {};
    }

    // Create a timeout promise
    const timeoutPromise = new Promise<{ data: { session: any }; error: any }>((_, reject) => {
      setTimeout(() => {
        reject(new Error('[Auth] Supabase getSession timeout'));
      }, 5000);
    });

    const settle = (user: User | null) => {
      set({ user, loading: false });
    };

    // Check the current session with timeout
    Promise.race([
      supabase.auth.getSession(),
      timeoutPromise
    ])
    .then(({ data: { session }, error }) => {
      if (error) {
        settle(null);
        return;
      }

      settle(session?.user ?? null);
    })
    .catch(() => {
      settle(null);
    });

    // Listen for authentication changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      settle(session?.user ?? null);
    });

    // Return cleanup function
    return () => {
      subscription.unsubscribe();
    };
  },

  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    set({
      user: data.user ?? null,
    });

    return { error: null };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    set({
      user: data.user ?? null,
    });
    // Clear demo mode flag on real login
    localStorage.removeItem('demo-mode');

    return { error: null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
    // Clear demo mode flag on logout
    localStorage.removeItem('demo-mode');
  },

  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    return { error };
  },

  updatePassword: async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    return { error };
  },
}));