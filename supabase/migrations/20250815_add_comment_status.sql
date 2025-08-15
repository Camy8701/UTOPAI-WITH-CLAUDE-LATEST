-- Add status column to comments table for moderation
ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected'));

-- Set default status to 'pending' for new comments (requiring moderation)
ALTER TABLE comments 
ALTER COLUMN status SET DEFAULT 'pending';

-- Create index for better performance when filtering by status
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);

-- Create index for admin queries (status + created_at)
CREATE INDEX IF NOT EXISTS idx_comments_moderation ON comments(status, created_at DESC);

-- Add comment to explain the column
COMMENT ON COLUMN comments.status IS 'Comment moderation status: approved (visible), pending (awaiting review), rejected (hidden)';