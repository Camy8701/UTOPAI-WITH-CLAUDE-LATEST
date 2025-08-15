// Manual Auth Fix Script - Run in Browser Console
// Copy and paste this entire script into your browser console

console.log('🔄 Starting manual auth fix...');

async function fixAuth() {
  try {
    // 1. Clear localStorage
    localStorage.clear();
    console.log('✅ Cleared localStorage');
    
    // 2. Clear sessionStorage  
    sessionStorage.clear();
    console.log('✅ Cleared sessionStorage');
    
    // 3. Clear all cookies
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      
      // Clear the cookie for different path/domain combinations
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=localhost`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.localhost`;
    });
    console.log('✅ Cleared all cookies');
    
    // 4. If Supabase client is available, sign out
    if (typeof window.supabase !== 'undefined') {
      await window.supabase.auth.signOut();
      console.log('✅ Signed out from Supabase');
    }
    
    console.log('✅ Auth fix complete! Reloading page...');
    
    // 5. Reload the page after a brief delay
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
    
  } catch (error) {
    console.error('❌ Fix error:', error);
  }
}

// Run the fix
fixAuth();