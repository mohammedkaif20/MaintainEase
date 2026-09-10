// complaint-form.js - Handles resident complaint submission

const API = '/api/complaints';

/* ---- Auth guard: redirect to login if not authenticated ---- */
const token = localStorage.getItem('me_token');
if (!token) {
  window.location.href = '/views/login.html';
}

/* ---- Pre-fill resident info from localStorage (read-only) ---- */
window.addEventListener('DOMContentLoaded', function () {
  const name = localStorage.getItem('me_name');
  const apt  = localStorage.getItem('me_apt');

  const nameInput = document.getElementById('residentName');
  const aptInput  = document.getElementById('apartmentNumber');

  if (name && nameInput) {
    nameInput.value    = name;
    nameInput.readOnly = true;
    nameInput.style.opacity = '0.7';
    nameInput.title = 'Your name is taken from your account';
  }
  if (apt && aptInput) {
    aptInput.value    = apt;
    aptInput.readOnly = true;
    aptInput.style.opacity = '0.7';
    aptInput.title = 'Your apartment is taken from your account';
  }
});

/* ---- Form submission ---- */
const form   = document.getElementById('complaint-form');
const msgBox = document.getElementById('form-message');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  // Only send safe complaint fields — identity is derived by the backend from the JWT
  const data = {
    title:       document.getElementById('title').value.trim(),
    category:    document.getElementById('category').value,
    priority:    document.getElementById('priority').value,
    description: document.getElementById('description').value.trim()
  };

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
  submitBtn.disabled = true;

  try {
    const response = await fetch(API, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.status === 401) {
      // Token expired — redirect to login
      localStorage.removeItem('me_token');
      localStorage.removeItem('me_role');
      localStorage.removeItem('me_name');
      localStorage.removeItem('me_apt');
      window.location.href = '/views/login.html';
      return;
    }

    if (response.ok) {
      showMessage('✅ Complaint submitted successfully!', 'success');
      // Reset only complaint fields, not the pre-filled resident info
      document.getElementById('title').value       = '';
      document.getElementById('category').value    = '';
      document.getElementById('priority').value    = 'Medium';
      document.getElementById('description').value = '';
    } else {
      showMessage('❌ Error: ' + result.message, 'error');
    }

  } catch (err) {
    showMessage('❌ Could not connect to server. Make sure the server is running.', 'error');
  }

  submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Complaint';
  submitBtn.disabled = false;
});

function showMessage(text, type) {
  msgBox.innerHTML  = text;
  msgBox.className  = 'form-message ' + type;
}
