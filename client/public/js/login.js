/* =============================================
   login.js – Frontend auth logic for MaintainEase
   Handles: role switching, tab switching,
            password visibility, strength meter,
            login & register API calls
   ============================================= */

let currentRole = 'resident';

/* ---- Role Selector ---- */
function setRole(role) {
  currentRole = role;
  document.getElementById('role-resident').classList.toggle('active', role === 'resident');
  document.getElementById('role-admin').classList.toggle('active', role === 'admin');

  if (role === 'admin') {
    document.getElementById('login-sub').textContent   = 'Sign in to your admin account';
    document.getElementById('login-title').innerHTML   = '<i class="fa-solid fa-shield-halved"></i> Admin Sign In';
  } else {
    document.getElementById('login-sub').textContent   = 'Sign in to your resident account';
    document.getElementById('login-title').innerHTML   = '<i class="fa-solid fa-right-to-bracket"></i> Welcome back';
  }
}

/* ---- Tab Switcher ---- */
function switchTab(tab) {
  const loginForm    = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const tabLogin     = document.getElementById('tab-login');
  const tabRegister  = document.getElementById('tab-register');
  const roleSel      = document.getElementById('role-selector-wrap');

  clearMessage('login-message');
  clearMessage('register-message');

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    // Show role selector for login — admins need to choose their role
    if (roleSel) roleSel.style.display = '';
  } else {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    tabLogin.classList.remove('active');
    tabRegister.classList.add('active');
    // Hide role selector on register — all accounts are created as residents
    if (roleSel) roleSel.style.display = 'none';
    // Reset title/sub for register form
    document.getElementById('register-sub').textContent   = 'Register as a new resident';
    document.getElementById('register-title').innerHTML   = '<i class="fa-solid fa-user-plus"></i> Create Account';
    const aptGroup = document.getElementById('reg-apt-group');
    const aptInput = document.getElementById('reg-apt');
    if (aptGroup) aptGroup.style.display = '';
    if (aptInput) aptInput.setAttribute('required', '');
  }
}

/* ---- Password Visibility Toggle ---- */
function togglePw(inputId, btn) {
  const input = document.getElementById(inputId);
  const icon  = btn.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'fa-solid fa-eye-slash';
  } else {
    input.type = 'password';
    icon.className = 'fa-solid fa-eye';
  }
}

/* ---- Password Strength Meter ---- */
document.getElementById('reg-password').addEventListener('input', function () {
  const val  = this.value;
  const bar  = document.getElementById('pw-bar');
  const lbl  = document.getElementById('pw-label');

  let score = 0;
  if (val.length >= 6)                    score++;
  if (val.length >= 10)                   score++;
  if (/[A-Z]/.test(val))                  score++;
  if (/[0-9]/.test(val))                  score++;
  if (/[^A-Za-z0-9]/.test(val))           score++;

  const levels = [
    { width: '0%',   color: 'transparent', label: '' },
    { width: '25%',  color: '#ef4444',     label: 'Weak',   labelColor: '#ef4444' },
    { width: '50%',  color: '#f59e0b',     label: 'Fair',   labelColor: '#f59e0b' },
    { width: '75%',  color: '#3b82f6',     label: 'Good',   labelColor: '#3b82f6' },
    { width: '90%',  color: '#8b5cf6',     label: 'Strong', labelColor: '#8b5cf6' },
    { width: '100%', color: '#10b981',     label: 'Great!', labelColor: '#10b981' },
  ];

  const lvl = levels[Math.min(score, 5)];
  bar.style.width      = val.length === 0 ? '0%' : lvl.width;
  bar.style.background = lvl.color;
  lbl.textContent      = val.length === 0 ? '' : lvl.label;
  lbl.style.color      = lvl.labelColor || '';
});

/* ---- Helpers ---- */
function showMessage(id, text, type) {
  const el = document.getElementById(id);
  el.className = `form-message ${type}`;
  el.innerHTML = `<i class="fa-solid fa-${type === 'success' ? 'circle-check' : 'circle-xmark'}"></i> ${text}`;
}

function clearMessage(id) {
  const el = document.getElementById(id);
  el.className = 'form-message hidden';
  el.innerHTML = '';
}

function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  btn.classList.toggle('btn-loading', loading);
}

/* ---- LOGIN Submit ---- */
document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  clearMessage('login-message');
  setLoading('login-btn', true);

  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  try {
    const res  = await fetch('/api/auth/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password, role: currentRole }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Login failed');

    // Store token and user info in localStorage
    localStorage.setItem('me_token', data.token);
    localStorage.setItem('me_role',  data.user.role);
    localStorage.setItem('me_name',  data.user.name);
    localStorage.setItem('me_apt',   data.user.apartmentNumber || '');

    showMessage('login-message', 'Login successful! Redirecting…', 'success');

    // Redirect based on role
    setTimeout(() => {
      if (data.user.role === 'admin') {
        window.location.href = '/views/admin-dashboard.html';
      } else {
        window.location.href = '/';
      }
    }, 900);

  } catch (err) {
    showMessage('login-message', err.message, 'error');
  } finally {
    setLoading('login-btn', false);
  }
});

/* ---- REGISTER Submit ---- */
document.getElementById('register-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  clearMessage('register-message');
  setLoading('register-btn', true);

  const name     = document.getElementById('reg-name').value.trim();
  const email    = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const apt      = document.getElementById('reg-apt').value.trim();

  if (password.length < 6) {
    showMessage('register-message', 'Password must be at least 6 characters.', 'error');
    setLoading('register-btn', false);
    return;
  }

  // Always register as resident — backend also enforces this
  const body = { name, email, password, role: 'resident', apartmentNumber: apt };

  try {
    const res  = await fetch('/api/auth/register', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Registration failed');

    showMessage('register-message', 'Account created! Signing you in…', 'success');

    // Auto-login after register
    localStorage.setItem('me_token', data.token);
    localStorage.setItem('me_role',  data.user.role);
    localStorage.setItem('me_name',  data.user.name);
    localStorage.setItem('me_apt',   data.user.apartmentNumber || '');

    setTimeout(() => {
      window.location.href = '/';
    }, 1000);

  } catch (err) {
    showMessage('register-message', err.message, 'error');
  } finally {
    setLoading('register-btn', false);
  }
});
