-- Add rating and total_reviews fields to profiles table
-- Run this in your Supabase SQL Editor

-- Add rating and total_reviews columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- Create an index on rating for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_rating ON public.profiles(rating DESC);

-- Create an index on total_reviews for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_total_reviews ON public.profiles(total_reviews DESC);

-- Update existing profiles to have default values
UPDATE public.profiles 
SET rating = 0, total_reviews = 0 
WHERE rating IS NULL OR total_reviews IS NULL;

-- Create a function to update user rating when a review is added/updated/deleted
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the reviewee's rating and total_reviews
  UPDATE public.profiles 
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM public.reviews 
      WHERE reviewee_id = COALESCE(NEW.reviewee_id, OLD.reviewee_id)
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM public.reviews 
      WHERE reviewee_id = COALESCE(NEW.reviewee_id, OLD.reviewee_id)
    )
  WHERE id = COALESCE(NEW.reviewee_id, OLD.reviewee_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for reviews table
DROP TRIGGER IF EXISTS trigger_update_user_rating_insert ON public.reviews;
CREATE TRIGGER trigger_update_user_rating_insert
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_user_rating();

DROP TRIGGER IF EXISTS trigger_update_user_rating_update ON public.reviews;
CREATE TRIGGER trigger_update_user_rating_update
  AFTER UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_user_rating();

DROP TRIGGER IF EXISTS trigger_update_user_rating_delete ON public.reviews;
CREATE TRIGGER trigger_update_user_rating_delete
  AFTER DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_user_rating(); 