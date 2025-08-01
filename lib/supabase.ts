import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if environment variables are set and valid
const isSupabaseConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'your_supabase_project_url_here' &&
  supabaseAnonKey !== 'your_supabase_anon_key_here' &&
  !supabaseUrl.includes('placeholder');

let supabase: any;

if (!isSupabaseConfigured) {
  console.warn('Supabase not configured. Using mock client for development.');
  // Create a mock client for development
  supabase = {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signUp: async () => ({ data: { user: null }, error: null }),
      signIn: async () => ({ data: { user: null }, error: null }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ error: null }),
      resend: async () => ({ error: null }),
      admin: {
        listUsers: async () => ({ data: { users: [] }, error: null }),
      },
    },
    from: () => ({
      select: () => ({
        eq: () => ({ single: async () => ({ data: null, error: null }) }),
      }),
      insert: async () => ({ error: null }),
      update: async () => ({ error: null }),
      delete: async () => ({ error: null }),
    }),
  };
} else {
  // Only validate URL format when we're actually using the real client
  try {
    new URL(supabaseUrl);
  } catch (error) {
    console.error('Invalid NEXT_PUBLIC_SUPABASE_URL format:', supabaseUrl);
    throw new Error('Invalid NEXT_PUBLIC_SUPABASE_URL format');
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          location: string | null;
          is_freelancer: boolean;
          is_client: boolean;
          skills: string[] | null;
          hourly_rate: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          is_freelancer?: boolean;
          is_client?: boolean;
          skills?: string[] | null;
          hourly_rate?: number | null;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          is_freelancer?: boolean;
          is_client?: boolean;
          skills?: string[] | null;
          hourly_rate?: number | null;
        };
      };
      gigs: {
        Row: {
          id: string;
          freelancer_id: string;
          title: string;
          description: string;
          category: string;
          subcategory: string | null;
          price: number;
          delivery_time: number;
          tags: string[] | null;
          images: string[] | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      services: {
        Row: {
          id: string;
          provider_id: string;
          title: string;
          description: string;
          category: string;
          subcategory: string | null;
          price: number;
          delivery_time: number;
          tags: string[] | null;
          images: string[] | null;
          is_active: boolean;
          views: number;
          favorites: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          provider_id: string;
          title: string;
          description: string;
          category: string;
          subcategory?: string | null;
          price: number;
          delivery_time: number;
          tags?: string[] | null;
          images?: string[] | null;
          is_active?: boolean;
          views?: number;
          favorites?: number;
        };
        Update: {
          title?: string;
          description?: string;
          category?: string;
          subcategory?: string | null;
          price?: number;
          delivery_time?: number;
          tags?: string[] | null;
          images?: string[] | null;
          is_active?: boolean;
          views?: number;
          favorites?: number;
        };
      };
      orders: {
        Row: {
          id: string;
          gig_id: string | null;
          service_id: string | null;
          client_id: string;
          freelancer_id: string;
          status:
            | 'pending'
            | 'in_progress'
            | 'completed'
            | 'cancelled'
            | 'disputed';
          total_amount: number;
          requirements: string | null;
          delivery_date: string | null;
          completed_date: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};
