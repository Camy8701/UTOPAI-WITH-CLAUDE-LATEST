-- Add audio_url column to blog_posts table for uploaded audio files
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN blog_posts.audio_url IS 'URL to uploaded audio file for the "Listen" functionality';