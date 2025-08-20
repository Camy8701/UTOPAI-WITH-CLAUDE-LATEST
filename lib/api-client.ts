import { supabase } from './supabase'

// Utility for making authenticated API requests from client-side
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  try {
    // Get current session token for authorization
    const { data: { session } } = await supabase.auth.getSession()
    
    const defaultOptions: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token ? { 
          'authorization': `Bearer ${session.access_token}` 
        } : {}),
        ...options.headers,
      },
      ...options,
    }

    console.log('API Request to:', endpoint, {
      method: options.method || 'GET',
      credentials: defaultOptions.credentials,
      headers: defaultOptions.headers
    })

    const response = await fetch(endpoint, defaultOptions)
    
    console.log('API Response:', {
      endpoint,
      status: response.status,
      ok: response.ok,
      statusText: response.statusText
    })
    
    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch (jsonError) {
        errorData = { 
          error: `Request failed with status ${response.status}: ${response.statusText}`,
          status: response.status,
          statusText: response.statusText
        }
      }
      console.error('API Error:', errorData)
      throw new Error(errorData.error || `Request failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log('API Success:', { endpoint, data })
    return data
    
  } catch (error) {
    console.error('Fetch Error:', error)
    // Check if it's a network error or server unavailable
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to server. Please check your internet connection.')
    }
    throw error
  }
}

// Specific API functions
export const likesAPI = {
  async getLikeStatus(postId?: string, commentId?: string) {
    const params = new URLSearchParams()
    if (postId) params.append('post_id', postId)
    if (commentId) params.append('comment_id', commentId)
    
    return apiRequest(`/api/likes?${params}`)
  },

  async toggleLike(postId?: string, commentId?: string, action: 'like' | 'unlike' | 'toggle' = 'toggle') {
    return apiRequest('/api/likes', {
      method: 'POST',
      body: JSON.stringify({
        post_id: postId || null,
        comment_id: commentId || null,
        action
      })
    })
  }
}

export const commentsAPI = {
  async getComments(postId: string) {
    return apiRequest(`/api/comments?post_id=${postId}`)
  },

  async createComment(postId: string, content: string, parentId?: string) {
    return apiRequest('/api/comments', {
      method: 'POST',
      body: JSON.stringify({
        post_id: postId,
        content,
        parent_id: parentId || null
      })
    })
  },

  async updateComment(commentId: string, content: string) {
    return apiRequest(`/api/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ content })
    })
  },

  async deleteComment(commentId: string) {
    return apiRequest(`/api/comments/${commentId}`, {
      method: 'DELETE'
    })
  }
}

export const savedPostsAPI = {
  async getSavedPosts(page = 1, limit = 10) {
    return apiRequest(`/api/saved-posts?page=${page}&limit=${limit}`)
  },

  async toggleSave(postId: string, action: 'save' | 'unsave' | 'toggle' = 'toggle') {
    return apiRequest('/api/saved-posts', {
      method: 'POST',
      body: JSON.stringify({
        post_id: postId,
        action
      })
    })
  }
}

export const userStatsAPI = {
  async getUserStats() {
    return apiRequest('/api/user-stats')
  }
}