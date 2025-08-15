export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          google_id: string | null
          quiz_points: number
          total_quiz_attempts: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          google_id?: string | null
          quiz_points?: number
          total_quiz_attempts?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          google_id?: string | null
          quiz_points?: number
          total_quiz_attempts?: number
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          content: string
          excerpt: string | null
          slug: string
          author_id: string
          category: string
          content_type: string
          section: string
          published: boolean
          featured: boolean
          like_count: number
          comment_count: number
          view_count: number
          thumbnail_url: string | null
          audio_url: string | null
          video_url: string | null
          read_time: string | null
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          content: string
          excerpt?: string | null
          slug: string
          author_id: string
          category: string
          content_type: string
          section: string
          published?: boolean
          featured?: boolean
          like_count?: number
          comment_count?: number
          view_count?: number
          thumbnail_url?: string | null
          audio_url?: string | null
          video_url?: string | null
          read_time?: string | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          content?: string
          excerpt?: string | null
          slug?: string
          author_id?: string
          category?: string
          content_type?: string
          section?: string
          published?: boolean
          featured?: boolean
          like_count?: number
          comment_count?: number
          view_count?: number
          thumbnail_url?: string | null
          audio_url?: string | null
          video_url?: string | null
          read_time?: string | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          content: string
          parent_id: string | null
          like_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          content: string
          parent_id?: string | null
          like_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          content?: string
          parent_id?: string | null
          like_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          post_id: string | null
          comment_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id?: string | null
          comment_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string | null
          comment_id?: string | null
          created_at?: string
        }
      }
      saved_posts: {
        Row: {
          id: string
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          created_at?: string
        }
      }
      quiz_attempts: {
        Row: {
          id: string
          user_id: string
          quiz_id: string
          score: number
          total_questions: number
          time_taken: number
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          quiz_id: string
          score: number
          total_questions: number
          time_taken: number
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          quiz_id?: string
          score?: number
          total_questions?: number
          time_taken?: number
          completed_at?: string
          created_at?: string
        }
      }
      leaderboards: {
        Row: {
          id: string
          user_id: string
          quiz_type: string
          total_score: number
          best_score: number
          total_attempts: number
          rank: number
          last_updated: string
        }
        Insert: {
          id?: string
          user_id: string
          quiz_type: string
          total_score?: number
          best_score?: number
          total_attempts?: number
          rank?: number
          last_updated?: string
        }
        Update: {
          id?: string
          user_id?: string
          quiz_type?: string
          total_score?: number
          best_score?: number
          total_attempts?: number
          rank?: number
          last_updated?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}