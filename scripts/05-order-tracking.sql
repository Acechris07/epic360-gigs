-- Order Tracking System
-- Run this in your Supabase SQL Editor

-- Add completed_date column to orders table if it doesn't exist
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS completed_date TIMESTAMP WITH TIME ZONE;

-- Create order_updates table for tracking status changes and messages
CREATE TABLE IF NOT EXISTS public.order_updates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'disputed')),
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_milestones table for tracking project milestones
CREATE TABLE IF NOT EXISTS public.order_milestones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_files table for tracking deliverables and attachments
CREATE TABLE IF NOT EXISTS public.order_files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    description TEXT,
    is_deliverable BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.order_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_files ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for order_updates
CREATE POLICY "Order participants can view updates" ON public.order_updates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_updates.order_id 
            AND (orders.client_id = auth.uid() OR orders.freelancer_id = auth.uid())
        )
    );

CREATE POLICY "Order participants can create updates" ON public.order_updates
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_updates.order_id 
            AND (orders.client_id = auth.uid() OR orders.freelancer_id = auth.uid())
        )
    );

-- Create RLS policies for order_milestones
CREATE POLICY "Order participants can view milestones" ON public.order_milestones
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_milestones.order_id 
            AND (orders.client_id = auth.uid() OR orders.freelancer_id = auth.uid())
        )
    );

CREATE POLICY "Freelancers can manage milestones" ON public.order_milestones
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_milestones.order_id 
            AND orders.freelancer_id = auth.uid()
        )
    );

-- Create RLS policies for order_files
CREATE POLICY "Order participants can view files" ON public.order_files
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_files.order_id 
            AND (orders.client_id = auth.uid() OR orders.freelancer_id = auth.uid())
        )
    );

CREATE POLICY "Order participants can upload files" ON public.order_files
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_files.order_id 
            AND (orders.client_id = auth.uid() OR orders.freelancer_id = auth.uid())
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_order_updates_order_id ON public.order_updates(order_id);
CREATE INDEX IF NOT EXISTS idx_order_updates_created_at ON public.order_updates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_milestones_order_id ON public.order_milestones(order_id);
CREATE INDEX IF NOT EXISTS idx_order_files_order_id ON public.order_files(order_id);
CREATE INDEX IF NOT EXISTS idx_order_files_user_id ON public.order_files(user_id);

-- Create a function to automatically create initial order update when order is created
CREATE OR REPLACE FUNCTION create_initial_order_update()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.order_updates (order_id, user_id, status, message)
    VALUES (NEW.id, NEW.client_id, 'pending', 'Order created');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic initial order update
DROP TRIGGER IF EXISTS trigger_create_initial_order_update ON public.orders;
CREATE TRIGGER trigger_create_initial_order_update
    AFTER INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION create_initial_order_update();

-- Create a function to update order milestone completion
CREATE OR REPLACE FUNCTION update_milestone_completion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_completed = TRUE AND OLD.is_completed = FALSE THEN
        NEW.completed_date = NOW();
    ELSIF NEW.is_completed = FALSE THEN
        NEW.completed_date = NULL;
    END IF;
    
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for milestone completion updates
DROP TRIGGER IF EXISTS trigger_update_milestone_completion ON public.order_milestones;
CREATE TRIGGER trigger_update_milestone_completion
    BEFORE UPDATE ON public.order_milestones
    FOR EACH ROW
    EXECUTE FUNCTION update_milestone_completion(); 