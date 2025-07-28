-- Epic360 Gigs Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  is_freelancer BOOLEAN DEFAULT false,
  is_client BOOLEAN DEFAULT true,
  skills TEXT[],
  hourly_rate DECIMAL(10,2),
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  completed_projects INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gigs table
CREATE TABLE IF NOT EXISTS gigs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  freelancer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  price DECIMAL(10,2) NOT NULL,
  delivery_time INTEGER NOT NULL, -- in days
  tags TEXT[],
  images TEXT[],
  is_active BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  favorites INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  price DECIMAL(10,2) NOT NULL,
  delivery_time INTEGER NOT NULL, -- in days
  tags TEXT[],
  images TEXT[],
  is_active BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  favorites INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  gig_id UUID REFERENCES gigs(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  freelancer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'disputed')) DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  requirements TEXT,
  delivery_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reviewed_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, gig_id),
  UNIQUE(user_id, service_id)
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  parent_id UUID REFERENCES categories(id),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, description, icon, sort_order) VALUES
('Household Service Gigs', 'household-service', 'General home services and maintenance', '🏠', 1),
('Party Planning Gigs', 'party-planning', 'Event planning and coordination services', '🎉', 2),
('Household Repair Gigs', 'household-repair', 'Home maintenance and repair services', '🔧', 3),
('Automobile Repair Gigs', 'automobile-repair', 'Car maintenance and repair services', '🚗', 4),
('Plumbing Gigs', 'plumbing', 'Plumbing services and repairs', '💧', 5),
('Construction Gigs', 'construction', 'Building and construction work', '🏗️', 6),
('Electricity Repair Gigs', 'electricity-repair', 'Electrical services and repairs', '⚡', 7),
('IT Gigs', 'it', 'Technology and computer services', '💻', 8),
('Social Media Gigs', 'social-media', 'Digital marketing and social media management', '📱', 9),
('Teaching Gigs', 'teaching', 'Educational and tutoring services', '🎓', 10),
('Saloon Gigs', 'saloon', 'Beauty and grooming services', '✂️', 11),
('Tailoring Gigs', 'tailoring', 'Clothing alterations and custom tailoring', '👕', 12),
('Transportation Gigs', 'transportation', 'Moving, delivery, and logistics services', '🚚', 13),
('Driving Gigs', 'driving', 'Ride-sharing, chauffeur, and driving services', '🚗', 14),
('Cleaning Gigs', 'cleaning', 'Professional cleaning and sanitization services', '✨', 15),
('Landscaping Gigs', 'landscaping', 'Garden design, lawn care, and outdoor maintenance', '🌳', 16),
('DJ Gigs', 'dj', 'Music entertainment and DJ services for events', '🎵', 17),
('Photography Gigs', 'photography', 'Professional photography and videography services', '📷', 18),
('Cooking Gigs', 'cooking', 'Professional cooking, catering, and culinary services', '👨‍🍳', 19),
('Decor Gigs', 'decor', 'Interior design, decoration, and styling services', '🎨', 20);
ON CONFLICT (slug) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gigs_freelancer_id ON gigs(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_gigs_category ON gigs(category);
CREATE INDEX IF NOT EXISTS idx_gigs_is_active ON gigs(is_active);
CREATE INDEX IF NOT EXISTS idx_services_provider_id ON services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_orders_client_id ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_freelancer_id ON orders(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_messages_order_id ON messages(order_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON messages(sender_id, receiver_id);

-- Create RLS (Row Level Security) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Gigs policies
CREATE POLICY "Anyone can view active gigs" ON gigs FOR SELECT USING (is_active = true);
CREATE POLICY "Freelancers can create gigs" ON gigs FOR INSERT WITH CHECK (auth.uid() = freelancer_id);
CREATE POLICY "Freelancers can update own gigs" ON gigs FOR UPDATE USING (auth.uid() = freelancer_id);
CREATE POLICY "Freelancers can delete own gigs" ON gigs FOR DELETE USING (auth.uid() = freelancer_id);

-- Services policies
CREATE POLICY "Anyone can view active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Providers can create services" ON services FOR INSERT WITH CHECK (auth.uid() = provider_id);
CREATE POLICY "Providers can update own services" ON services FOR UPDATE USING (auth.uid() = provider_id);
CREATE POLICY "Providers can delete own services" ON services FOR DELETE USING (auth.uid() = provider_id);

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = client_id OR auth.uid() = freelancer_id);
CREATE POLICY "Clients can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Order participants can update orders" ON orders FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = freelancer_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for completed orders" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Messages policies
CREATE POLICY "Users can view messages in their orders" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Favorites policies
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gigs_updated_at BEFORE UPDATE ON gigs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 

-- Indexes for messages
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_order_id ON messages(order_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(sender_id, receiver_id, order_id);

-- RLS policies for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can read messages where they are sender or receiver
CREATE POLICY "Users can read their messages" ON messages
  FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  );

-- Users can insert messages
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
  );

-- Users can update their own messages (for marking as read)
CREATE POLICY "Users can update their messages" ON messages
  FOR UPDATE USING (
    auth.uid() = receiver_id
  );

-- Users can delete their own messages
CREATE POLICY "Users can delete their messages" ON messages
  FOR DELETE USING (
    auth.uid() = sender_id
  ); 