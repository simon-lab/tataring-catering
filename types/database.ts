export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface PackageVariant {
  id: string;
  name: string;
  tagline: string;
  price_per_portion: number;
  contents: string[];
  is_popular?: boolean;
}

export type Database = {
  public: {
    Tables: {
      packages: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          category: string;
          price_per_portion: number;
          min_portion: number;
          max_portion: number;
          contents: Json | null;
          variants: Json | null;
          images: string[] | null;
          badge: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["packages"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["packages"]["Insert"]>;
      };
      addons: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          is_active: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["addons"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["addons"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_name: string;
          customer_phone: string;
          customer_email: string | null;
          event_type: string | null;
          event_date: string | null;
          event_time: string | null;
          package_id: string | null;
          portion_count: number | null;
          addons: Json | null;
          delivery_address: string | null;
          notes: string | null;
          estimated_total: number | null;
          status: string;
          admin_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      testimonials: {
        Row: {
          id: string;
          customer_name: string;
          customer_photo: string | null;
          event_type: string | null;
          rating: number | null;
          review: string;
          is_published: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["testimonials"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>;
      };
      gallery: {
        Row: {
          id: string;
          image_url: string;
          caption: string | null;
          event_type: string | null;
          event_date: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["gallery"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["gallery"]["Insert"]>;
      };
      menu_stories: {
        Row: {
          id: string;
          slug: string;
          title: string;
          hero_image: string | null;
          excerpt: string | null;
          body: string | null;
          is_published: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["menu_stories"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["menu_stories"]["Insert"]>;
      };
      availability: {
        Row: {
          id: string;
          date: string;
          max_slots: number;
          booked_slots: number;
          is_blocked: boolean;
          block_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["availability"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["availability"]["Insert"]>;
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          category: string;
          thumbnail: string | null;
          excerpt: string | null;
          body: string;
          author_name: string | null;
          author_photo: string | null;
          read_time_minutes: number | null;
          meta_title: string | null;
          meta_description: string | null;
          og_image: string | null;
          is_published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["blog_posts"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
      };
      site_config: {
        Row: { key: string; value: string };
        Insert: { key: string; value: string };
        Update: { value?: string };
      };
    };
  };
};

// Convenience types
export type Package = Database["public"]["Tables"]["packages"]["Row"];
export type Addon = Database["public"]["Tables"]["addons"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];
export type GalleryItem = Database["public"]["Tables"]["gallery"]["Row"];
export type MenuStory = Database["public"]["Tables"]["menu_stories"]["Row"];
export type Availability = Database["public"]["Tables"]["availability"]["Row"];
export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
