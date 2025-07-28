-- Enable RLS (Row Level Security)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    is_freelancer BOOLEAN DEFAULT FALSE,
    is_client BOOLEAN DEFAULT TRUE,
    skills TEXT[],
    hourly_rate DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create gigs table
CREATE TABLE IF NOT EXISTS public.gigs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    freelancer_id UUID REFERENCES public.profiles(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    price DECIMAL(10,2) NOT NULL,
    delivery_time INTEGER NOT NULL, -- in days
    tags TEXT[],
    images TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    gig_id UUID REFERENCES public.gigs(id) NOT NULL,
    client_id UUID REFERENCES public.profiles(id) NOT NULL,
    freelancer_id UUID REFERENCES public.profiles(id) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    total_amount DECIMAL(10,2) NOT NULL,
    requirements TEXT,
    delivery_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) NOT NULL,
    reviewer_id UUID REFERENCES public.profiles(id) NOT NULL,
    reviewee_id UUID REFERENCES public.profiles(id) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for gigs
CREATE POLICY "Anyone can view active gigs" ON public.gigs FOR SELECT USING (is_active = true);
CREATE POLICY "Freelancers can manage own gigs" ON public.gigs FOR ALL USING (auth.uid() = freelancer_id);

-- Create RLS policies for orders
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = client_id OR auth.uid() = freelancer_id);
CREATE POLICY "Clients can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Create RLS policies for messages
CREATE POLICY "Order participants can view messages" ON public.messages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = messages.order_id 
        AND (orders.client_id = auth.uid() OR orders.freelancer_id = auth.uid())
    )
);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
