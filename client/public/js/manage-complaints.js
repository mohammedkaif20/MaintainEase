// manage-complaints.js – Shows complaints with dual filter (status + category)

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

let allComplaints = [];

const tbody          = document.getElementById('complaints-tbody');
const filterStatus   = document.getElementById('filter-status');
const filterCategory = document.getElementById('filter-category');
const resultCount    = document.getElementById('result-count');

loadComplaints();

filterStatus.addEventListener('change', renderTable);
filterCategory.addEventListener('change', renderTable);

async function loadComplaints() {
  try {
    const response = await fetch(API, {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    if (response.status === 401 || response.status === 403) {
      window.location.href = '/views/login.html';
      return;
    }

    allComplaints = await response.json();
    renderTable();
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;color:var(--rose);padding:40px;"><i class="fa-solid fa-triangle-exclamation"></i> Could not connect to server.</td></tr>';
  }
}

function renderTable() {
  const selStatus   = filterStatus.value;
  const selCategory = filterCategory.value;

  let filtered = allComplaints;

  if (selStatus   !== 'All') filtered = filtered.filter(c => c.status   === selStatus);
  if (selCategory !== 'All') filtered = filtered.filter(c => c.category === selCategory);

  resultCount.textContent = filtered.length + ' complaint(s) found';
  tbody.innerHTML = '';

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;color:var(--text-dim);padding:48px;"><i class="fa-solid fa-inbox" style="font-size:1.5rem;display:block;margin-bottom:8px;opacity:0.4;"></i> No complaints found.</td></tr>';
    return;
  }

  filtered.forEach(function (c, index) {
    const statusClass = c.status.replace(' ', '').toLowerCase();
    const date = new Date(c.createdAt).toLocaleDateString('en-IN');
    tbody.innerHTML += `
      <tr>
        <td style="color:var(--text-dim);font-size:0.8rem;">${index + 1}</td>
        <td style="color:var(--text);font-weight:500;">${c.residentName}</td>
        <td><span style="background:var(--bg-card2);border:1px solid var(--border2);padding:3px 10px;border-radius:6px;font-size:0.78rem;">${c.apartmentNumber}</span></td>
        <td style="color:var(--text);max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${c.title}</td>
        <td>${c.category}</td>
        <td><span class="priority-${c.priority.toLowerCase()}">${c.priority}</span></td>
        <td style="color:${c.technician === 'Not Assigned' ? 'var(--text-dim)' : 'var(--text)'};">${c.technician}</td>
        <td><span class="badge badge-${statusClass}">${c.status}</span></td>
        <td style="color:var(--text-dim);font-size:0.8rem;">${date}</td>
        <td>
          <div style="display:flex;gap:6px;">
            <a href="/views/update-complaint.html?id=${c._id}" class="btn btn-sm btn-primary"><i class="fa-solid fa-pen"></i></a>
            <button class="btn btn-sm btn-danger" onclick="deleteComplaint('${c._id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `;
  });
}

window.deleteComplaint = async function deleteComplaint(id) {
  if (!confirm('Are you sure you want to delete this complaint? This cannot be undone.')) return;

  try {
    const response = await fetch(API + '/' + id, {
      method:  'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });

    if (response.status === 401 || response.status === 403) {
      window.location.href = '/views/login.html';
      return;
    }

    allComplaints = allComplaints.filter(c => c._id !== id);
    renderTable();
  } catch (err) {
    alert('Could not delete. Please try again.');
  }
};
