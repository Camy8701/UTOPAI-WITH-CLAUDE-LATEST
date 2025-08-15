// Browser console test script for session fix
async function testSessionFix() {
  console.log('=== TESTING SESSION FIX ===');
  
  // First, check current cookies
  console.log('Current cookies:', document.cookie);
  
  // Test the simple auth endpoint
  console.log('\n1. Testing current auth status...');
  try {
    const authResponse = await fetch('/api/test-simple-auth', {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    const authData = await authResponse.json();
    console.log('Current auth status:', authData);
  } catch (error) {
    console.error('Auth test failed:', error);
  }
  
  // Try session refresh
  console.log('\n2. Attempting session refresh...');
  try {
    const refreshResponse = await fetch('/api/auth/refresh-session', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    const refreshData = await refreshResponse.json();
    console.log('Session refresh result:', refreshData);
    
    if (refreshData.success) {
      console.log('✅ Session refresh successful!');
      
      // Test auth again after refresh
      console.log('\n3. Testing auth status after refresh...');
      const authResponse2 = await fetch('/api/test-simple-auth', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      const authData2 = await authResponse2.json();
      console.log('Auth status after refresh:', authData2);
      
      // Test a like operation to see if it works now
      console.log('\n4. Testing like operation...');
      const likeResponse = await fetch('/api/likes', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: 'test' })
      });
      const likeData = await likeResponse.json();
      console.log('Like test result:', likeData);
      
    } else {
      console.log('❌ Session refresh failed:', refreshData.error);
      console.log('You may need to sign out and sign in again.');
    }
  } catch (error) {
    console.error('Session refresh failed:', error);
  }
}

// Run the test
testSessionFix();