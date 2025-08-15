-- Quiz Scores and Leaderboards Database Schema
-- Create tables for persistent quiz data

-- Quiz attempts table to store individual quiz completions
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    quiz_type VARCHAR(50) NOT NULL, -- 'ai-fundamentals', 'ai-intermediate', 'ai-ethics'
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 40), -- Max 40 questions
    percentage DECIMAL(5,2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
    time_taken INTEGER NOT NULL, -- Time in seconds
    questions_asked INTEGER NOT NULL DEFAULT 10,
    correct_answers INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Additional metadata
    answers_data JSONB, -- Store detailed answers for analysis
    quiz_version VARCHAR(20) DEFAULT '1.0'
);

-- Quiz leaderboards view for easy querying
CREATE OR REPLACE VIEW quiz_leaderboards AS
SELECT 
    qa.id,
    qa.user_id,
    p.full_name as player_name,
    p.avatar_url,
    qa.quiz_type,
    qa.score,
    qa.percentage,
    qa.time_taken,
    qa.correct_answers,
    qa.questions_asked,
    qa.created_at,
    -- Rank within quiz type
    ROW_NUMBER() OVER (PARTITION BY qa.quiz_type ORDER BY qa.percentage DESC, qa.time_taken ASC) as rank_in_type,
    -- Overall rank
    ROW_NUMBER() OVER (ORDER BY qa.percentage DESC, qa.time_taken ASC) as overall_rank
FROM quiz_attempts qa
LEFT JOIN profiles p ON qa.user_id = p.id
WHERE qa.percentage IS NOT NULL
ORDER BY qa.percentage DESC, qa.time_taken ASC;

-- Quiz statistics view for dashboard
CREATE OR REPLACE VIEW quiz_statistics AS
SELECT 
    quiz_type,
    COUNT(*) as total_attempts,
    COUNT(DISTINCT user_id) as unique_players,
    AVG(percentage) as avg_percentage,
    MAX(percentage) as best_percentage,
    AVG(time_taken) as avg_time_taken,
    MIN(time_taken) as fastest_time,
    AVG(correct_answers::DECIMAL / questions_asked * 100) as avg_accuracy
FROM quiz_attempts
GROUP BY quiz_type;

-- Global quiz statistics
CREATE OR REPLACE VIEW global_quiz_statistics AS
SELECT 
    COUNT(*) as total_completions,
    COUNT(DISTINCT user_id) as unique_users,
    AVG(percentage) as average_score,
    COUNT(DISTINCT quiz_type) as topic_count,
    MAX(created_at) as last_attempt
FROM quiz_attempts;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_type ON quiz_attempts(quiz_type);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_created_at ON quiz_attempts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_percentage ON quiz_attempts(percentage DESC);

-- RLS (Row Level Security) policies
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Users can read all quiz attempts for leaderboards
CREATE POLICY "Users can view all quiz attempts" ON quiz_attempts
    FOR SELECT USING (true);

-- Users can only insert their own quiz attempts
CREATE POLICY "Users can insert own quiz attempts" ON quiz_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own quiz attempts
CREATE POLICY "Users can update own quiz attempts" ON quiz_attempts
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own quiz attempts
CREATE POLICY "Users can delete own quiz attempts" ON quiz_attempts
    FOR DELETE USING (auth.uid() = user_id);