-- Enhanced Profile System for Epic360 Gigs Platform
-- This script adds comprehensive profile fields and features

-- First, let's add columns to the existing profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS website VARCHAR(255),
ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS experience_level VARCHAR(20) DEFAULT 'beginner',
ADD COLUMN IF NOT EXISTS availability VARCHAR(20) DEFAULT 'available',
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50),
ADD COLUMN IF NOT EXISTS languages TEXT[], -- Array of languages
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS portfolio_items JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS profile_visibility VARCHAR(20) DEFAULT 'public',
ADD COLUMN IF NOT EXISTS total_earnings DECIMAL(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_jobs INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS success_rate DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS response_time INTEGER DEFAULT 24, -- hours
ADD COLUMN IF NOT EXISTS last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create skills table for better skill management
CREATE TABLE IF NOT EXISTS skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_skills junction table
CREATE TABLE IF NOT EXISTS user_skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(20) DEFAULT 'intermediate', -- beginner, intermediate, expert
    years_experience INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

-- Create profile_views table for analytics
CREATE TABLE IF NOT EXISTS profile_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Insert common skills
INSERT INTO skills (name, category) VALUES
-- Programming & Development
('JavaScript', 'Programming'),
('Python', 'Programming'),
('React', 'Programming'),
('Node.js', 'Programming'),
('PHP', 'Programming'),
('Java', 'Programming'),
('C++', 'Programming'),
('HTML/CSS', 'Programming'),
('TypeScript', 'Programming'),
('Vue.js', 'Programming'),

-- Design
('Graphic Design', 'Design'),
('UI/UX Design', 'Design'),
('Logo Design', 'Design'),
('Web Design', 'Design'),
('Photoshop', 'Design'),
('Illustrator', 'Design'),
('Figma', 'Design'),
('Sketch', 'Design'),
('InDesign', 'Design'),
('After Effects', 'Design'),

-- Writing & Content
('Content Writing', 'Writing'),
('Copywriting', 'Writing'),
('Blog Writing', 'Writing'),
('Technical Writing', 'Writing'),
('Creative Writing', 'Writing'),
('Proofreading', 'Writing'),
('Translation', 'Writing'),
('SEO Writing', 'Writing'),

-- Marketing
('Digital Marketing', 'Marketing'),
('Social Media Marketing', 'Marketing'),
('SEO', 'Marketing'),
('PPC Advertising', 'Marketing'),
('Email Marketing', 'Marketing'),
('Content Marketing', 'Marketing'),
('Brand Strategy', 'Marketing'),

-- Business
('Project Management', 'Business'),
('Data Analysis', 'Business'),
('Business Strategy', 'Business'),
('Financial Planning', 'Business'),
('Customer Service', 'Business'),
('Sales', 'Business'),

-- Creative
('Photography', 'Creative'),
('Video Editing', 'Creative'),
('Music Production', 'Creative'),
('Voice Over', 'Creative'),
('Animation', 'Creative'),
('3D Modeling', 'Creative')

ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);
CREATE INDEX IF NOT EXISTS idx_profiles_hourly_rate ON profiles(hourly_rate);
CREATE INDEX IF NOT EXISTS idx_profiles_experience_level ON profiles(experience_level);
CREATE INDEX IF NOT EXISTS idx_profiles_availability ON profiles(availability);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON profiles(last_active);
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_profile_id ON profile_views(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_at ON profile_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);

-- Enable Row Level Security
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for skills (public read)
CREATE POLICY "Skills are viewable by everyone" ON skills
    FOR SELECT USING (true);

-- RLS Policies for user_skills
CREATE POLICY "Users can view all user skills" ON user_skills
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own skills" ON user_skills
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for profile_views
CREATE POLICY "Users can view their own profile views" ON profile_views
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = profile_views.profile_id 
            AND profiles.id = auth.uid()
        )
    );

CREATE POLICY "Anyone can create profile views" ON profile_views
    FOR INSERT WITH CHECK (true);

-- Create functions for profile statistics
CREATE OR REPLACE FUNCTION update_profile_stats(user_uuid UUID)
RETURNS void AS $$
BEGIN
    -- This function will be called when jobs are completed
    -- For now, it's a placeholder for future job completion integration
    UPDATE profiles 
    SET 
        last_active = NOW()
    WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user skills with details
CREATE OR REPLACE FUNCTION get_user_skills(user_uuid UUID)
RETURNS TABLE (
    skill_name VARCHAR(100),
    skill_category VARCHAR(50),
    proficiency_level VARCHAR(20),
    years_experience INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.name,
        s.category,
        us.proficiency_level,
        us.years_experience
    FROM user_skills us
    JOIN skills s ON us.skill_id = s.id
    WHERE us.user_id = user_uuid
    ORDER BY s.category, s.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add constraints for data validation
ALTER TABLE profiles 
ADD CONSTRAINT check_experience_level 
CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'expert'));

ALTER TABLE profiles 
ADD CONSTRAINT check_availability 
CHECK (availability IN ('available', 'busy', 'unavailable'));

ALTER TABLE profiles 
ADD CONSTRAINT check_profile_visibility 
CHECK (profile_visibility IN ('public', 'private', 'contacts_only'));

ALTER TABLE profiles 
ADD CONSTRAINT check_hourly_rate 
CHECK (hourly_rate >= 0 AND hourly_rate <= 10000);

ALTER TABLE profiles 
ADD CONSTRAINT check_success_rate 
CHECK (success_rate >= 0 AND success_rate <= 100);

ALTER TABLE user_skills 
ADD CONSTRAINT check_proficiency_level 
CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert'));

ALTER TABLE user_skills 
ADD CONSTRAINT check_years_experience 
CHECK (years_experience >= 0 AND years_experience <= 50);

-- Create trigger to update last_active on profile updates
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_active = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_last_active
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_last_active();

-- Grant necessary permissions
GRANT SELECT ON skills TO authenticated;
GRANT ALL ON user_skills TO authenticated;
GRANT INSERT ON profile_views TO authenticated;
GRANT SELECT ON profile_views TO authenticated;
