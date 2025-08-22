// Placeholder file for old Supabase imports
// This file prevents build errors from cached imports

export const createAPIClient = () => {
  throw new Error('Supabase has been replaced with Firebase - please update your imports')
}

export const createServerClient = () => {
  throw new Error('Supabase has been replaced with Firebase - please update your imports')
}

export default {
  createAPIClient,
  createServerClient
}