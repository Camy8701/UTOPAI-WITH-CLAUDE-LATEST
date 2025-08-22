// Placeholder file for old Supabase imports
// This file prevents build errors from cached imports

export const createClientComponentClient = () => {
  throw new Error('Supabase has been replaced with Firebase - please update your imports')
}

export const createServerComponentClient = () => {
  throw new Error('Supabase has been replaced with Firebase - please update your imports')  
}

export default {
  createClientComponentClient,
  createServerComponentClient
}