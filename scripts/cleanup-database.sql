-- Clean up dummy/test data from the database
-- Run this in your Supabase SQL editor

-- 1. Delete all test blog posts (keep only real content)
DELETE FROM blog_posts 
WHERE title ILIKE '%test%' 
   OR title ILIKE '%dummy%' 
   OR title ILIKE '%sample%'
   OR title ILIKE '%lorem%'
   OR content ILIKE '%lorem ipsum%'
   OR excerpt ILIKE '%test%';

-- 2. Delete test comments
DELETE FROM comments 
WHERE content ILIKE '%test%' 
   OR content ILIKE '%dummy%'
   OR content ILIKE '%sample%'
   OR content ILIKE '%lorem%';

-- 3. Delete test user profiles (except admin)
DELETE FROM profiles 
WHERE email NOT LIKE '%utopaiblog@gmail.com%'
   AND (full_name ILIKE '%test%' 
        OR full_name ILIKE '%dummy%'
        OR full_name ILIKE '%sample%'
        OR email ILIKE '%test%'
        OR email ILIKE '%dummy%');

-- 4. Reset likes/saves for cleaned posts
DELETE FROM likes WHERE post_id NOT IN (SELECT id FROM blog_posts);
DELETE FROM saved_posts WHERE post_id NOT IN (SELECT id FROM blog_posts);

-- 5. Clean up any orphaned data
DELETE FROM quiz_submissions WHERE user_id NOT IN (SELECT id FROM profiles);

-- View remaining data counts
SELECT 'blog_posts' as table_name, COUNT(*) as count FROM blog_posts
UNION ALL
SELECT 'comments', COUNT(*) FROM comments  
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles
UNION ALL
SELECT 'likes', COUNT(*) FROM likes
UNION ALL
SELECT 'saved_posts', COUNT(*) FROM saved_posts;