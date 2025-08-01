-- Add Services Table
-- Run this in your Supabase SQL Editor

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
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

-- Enable Row Level Security for services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for services
CREATE POLICY "Anyone can view active services" ON public.services 
    FOR SELECT USING (is_active = true);

CREATE POLICY "Providers can create services" ON public.services 
    FOR INSERT WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Providers can update own services" ON public.services 
    FOR UPDATE USING (auth.uid() = provider_id);

CREATE POLICY "Providers can delete own services" ON public.services 
    FOR DELETE USING (auth.uid() = provider_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_provider_id ON public.services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON public.services(is_active);

-- Create trigger for updated_at
CREATE TRIGGER update_services_updated_at 
    BEFORE UPDATE ON public.services 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Update orders table to support both gigs and services
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES public.services(id) ON DELETE SET NULL;

-- Update the existing orders table constraint to allow either gig_id or service_id
-- First, drop the existing NOT NULL constraint on gig_id
ALTER TABLE public.orders 
ALTER COLUMN gig_id DROP NOT NULL;

-- Add a check constraint to ensure either gig_id or service_id is provided
ALTER TABLE public.orders 
ADD CONSTRAINT check_gig_or_service 
CHECK (gig_id IS NOT NULL OR service_id IS NOT NULL);

-- Update favorites table to support services
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    gig_id UUID REFERENCES public.gigs(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, gig_id),
    UNIQUE(user_id, service_id)
);

-- Enable RLS for favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for favorites
CREATE POLICY "Users can view own favorites" ON public.favorites 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites" ON public.favorites 
    FOR ALL USING (auth.uid() = user_id); 