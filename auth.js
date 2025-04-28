// Connect to Supabase
const { createClient } = window.supabase;
const supabase = createClient(
  'https://jiglvdqdgkvpwamthsax.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppZ2x2ZHFkZ2t2cHdhbXRoc2F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MDU2MzksImV4cCI6MjA2MTM4MTYzOX0.4o03nHx2NGcpeUssKYz24T8aLI1cS5J45vLv8T6kjpo'
);

// Register new user
async function signUp() {
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value.trim();
  const now = new Date().toISOString();

  if (!email || !password) {
    alert('Please enter both email and password.');
    return;
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: '', // Disable magic link
      data: {
        registered_at: now
      }
    }
  });

  if (signUpError) {
    alert(signUpError.message);
  } else {
    const user = signUpData.user;
    if (user) {
      await supabase.from('profiles').insert({
        id: user.id,
        email: email,
        full_name: '',
        created_at: now
      });
    }

    alert('Registration successful! Please check your email for the OTP.');
    window.location.href = 'verify.html';
  }
}

// Verify OTP after registration
async function verifyOtp() {
  const email = document.getElementById('verify-email').value.trim();
  const otp = document.getElementById('otp').value.trim();

  if (!email || !otp) {
    alert('Please enter your email and OTP.');
    return;
  }

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'email'  // Use 'email' type for OTP verification
  });

  if (error) {
    alert(error.message);
  } else {
    alert('OTP Verified! Now you can login.');
    window.location.href = 'login.html';
  }
}

// Login user normally with email and password
async function login() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  if (!email || !password) {
    alert('Please enter both email and password.');
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    alert(error.message);
  } else {
    window.location.href = 'dashboard.html';
  }
}

// Forgot Password
async function resetPassword() {
  const email = document.getElementById('forgot-email').value.trim();

  if (!email) {
    alert('Please enter your email.');
    return;
  }

  const { data, error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    alert(error.message);
  } else {
    alert('Password reset link sent to your email!');
  }
}

// Logout user
async function logout() {
  await supabase.auth.signOut();
  window.location.href = 'login.html';
}

// Show current time
function displayCurrentTime() {
  const now = new Date();
  const currentTimeEl = document.getElementById('current-datetime');
  if (currentTimeEl) {
    currentTimeEl.innerText = `Today is: ${now.toLocaleString()}`;
  }
}

// Show user info
async function showUserInfo() {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const userEmailEl = document.getElementById('user-email');
    const regTimeEl = document.getElementById('registered-time');

    if (userEmailEl) {
      userEmailEl.innerText = `Logged in as: ${user.email}`;
    }
    if (regTimeEl && user.user_metadata?.registered_at) {
      regTimeEl.innerText = `Registered on: ${new Date(user.user_metadata.registered_at).toLocaleString()}`;
    }
  } else {
    if (!window.location.href.includes('login.html') && !window.location.href.includes('index.html')) {
      window.location.href = 'login.html';
    }
  }
}

// Session auto check
(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session && window.location.pathname.includes('dashboard.html')) {
    window.location.href = 'login.html';
  }
})();
