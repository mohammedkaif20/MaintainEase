// update-complaint.js - Loads complaint details and handles the update form

const API   = '/api/complaints';
const token = localStorage.getItem('me_token');

/* ---- Auth guard: redirect non-admins immediately ---- */
(function () {
  const role = localStorage.getItem('me_role');
  if (!token || role !== 'admin') {
    window.location.href = '/views/login.html';
  }
})();

/* ---- Show admin name + wire sidebar logout ---- */
window.addEventListener('DOMContentLoaded', function () {
  const name = localStorage.getItem('me_name');
  const nameEl = document.getElementById('admin-name-display');
  if (nameEl && name) nameEl.textContent = name;

  const logoutBtn = document.getElementById('sidebar-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem('me_token');
      localStorage.removeItem('me_role');
      localStorage.removeItem('me_name');
      localStorage.removeItem('me_apt');
      window.location.href = '/views/login.html';
    });
  }
});

const msgBox = document.getElementById('update-message');

// Get complaint ID from URL: e.g. /update-complaint.html?id=abc123
const urlParams   = new URLSearchParams(window.location.search);
const complaintId = urlParams.get('id');

// Load complaint details when page opens
loadComplaint();

async function loadComplaint() {
  if (!complaintId) {
    document.getElementById('complaint-info').innerHTML = '<p style="color:var(--rose);"><i class="fa-solid fa-triangle-exclamation"></i> No complaint ID provided. <a href="/views/manage-complaints.html" style="color:var(--blue);">Go back to list</a></p>';
    return;
  }

  try {
    const response = await fetch(API + '/' + complaintId, {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    if (response.status === 401 || response.status === 403) {
      window.location.href = '/views/login.html';
      return;
    }

    const c = await response.json();

    // Show complaint info (read-only)
    document.getElementById('complaint-info').innerHTML = `
      <p><strong>Resident:</strong> ${c.residentName} &nbsp;|&nbsp; <strong>Apartment:</strong> ${c.apartmentNumber}</p>
      <p><strong>Title:</strong> ${c.title}</p>
      <p><strong>Category:</strong> ${c.category} &nbsp;|&nbsp; <strong>Priority:</strong> ${c.priority}</p>
      <p><strong>Description:</strong> ${c.description}</p>
      <p><strong>Filed On:</strong> ${new Date(c.createdAt).toLocaleDateString()}</p>
    `;

    // Pre-fill update form with current values
    document.getElementById('technician').value = c.technician || '';
    document.getElementById('status').value     = c.status;
    document.getElementById('remarks').value    = c.remarks || '';

  } catch (err) {
    document.getElementById('complaint-info').innerHTML = '<p style="color:var(--rose);">Could not load complaint.</p>';
  }
}

// Handle update form submission
document.getElementById('update-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  if (!complaintId) {
    showMessage('<i class="fa-solid fa-triangle-exclamation"></i> No complaint selected. Please go back and click Update on a complaint.', 'error');
    return;
  }

  const data = {
    technician: document.getElementById('technician').value.trim(),
    status:     document.getElementById('status').value,
    remarks:    document.getElementById('remarks').value.trim()
  };

  const btn = document.getElementById('update-btn');
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
  btn.disabled  = true;

  try {
    const response = await fetch(API + '/' + complaintId, {
      method:  'PUT',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(data)
    });

    if (response.status === 401 || response.status === 403) {
      window.location.href = '/views/login.html';
      return;
    }

    const result = await response.json();

    if (response.ok) {
      showMessage('✅ Complaint updated successfully!', 'success');
    } else {
      showMessage('❌ Error: ' + result.message, 'error');
    }

  } catch (err) {
    showMessage('❌ Could not connect to server.', 'error');
  }

  btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Changes';
  btn.disabled  = false;
});

function showMessage(text, type) {
  msgBox.innerHTML  = text;
  msgBox.className  = 'form-message ' + type;
}
