// complaint-history.js – Shows the authenticated user's own complaints

const API   = '/api/complaints/my';
const token = localStorage.getItem('me_token');

/* ---- Auth guard ---- */
if (!token) {
  window.location.href = '/views/login.html';
}

const listDiv = document.getElementById('complaints-list');

/* ---- Load complaints on page open ---- */
loadMyComplaints();

async function loadMyComplaints() {
  listDiv.innerHTML = '<div class="no-results"><i class="fa-solid fa-spinner fa-spin"></i> Loading your complaints...</div>';

  try {
    const response = await fetch(API, {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    // Token expired or invalid — send back to login
    if (response.status === 401) {
      localStorage.removeItem('me_token');
      localStorage.removeItem('me_role');
      localStorage.removeItem('me_name');
      localStorage.removeItem('me_apt');
      window.location.href = '/views/login.html';
      return;
    }

    if (!response.ok) {
      listDiv.innerHTML = '<div class="no-results"><i class="fa-solid fa-triangle-exclamation"></i> Could not load complaints.</div>';
      return;
    }

    const results = await response.json();

    if (results.length === 0) {
      listDiv.innerHTML = '<div class="no-results"><i class="fa-solid fa-inbox"></i> You have not submitted any complaints yet. <a href="/views/complaint-form.html" style="color:var(--blue);margin-left:6px;">Report an issue</a></div>';
      return;
    }

    let html = '<p style="margin-bottom:20px;color:var(--text-muted);font-size:0.9rem;"><i class="fa-solid fa-circle-check" style="color:var(--emerald);margin-right:6px;"></i> You have <strong>' + results.length + '</strong> complaint(s) on record.</p>';

    results.forEach(function (c) {
      const statusClass = c.status.replace(' ', '').toLowerCase();
      const date = new Date(c.createdAt).toLocaleDateString('en-IN');

      html += `
        <div class="complaint-card status-${statusClass}">
          <div class="complaint-card-header">
            <h3><i class="fa-solid fa-wrench" style="color:var(--blue);margin-right:8px;"></i>${c.title}</h3>
            <span class="badge badge-${statusClass}">${c.status}</span>
          </div>
          <div class="complaint-card-meta">
            <span><i class="fa-solid fa-tag"></i> ${c.category}</span>
            <span><i class="fa-solid fa-signal"></i> <span class="priority-${c.priority.toLowerCase()}">${c.priority}</span></span>
            <span><i class="fa-solid fa-helmet-safety"></i> ${c.technician}</span>
            <span><i class="fa-solid fa-calendar"></i> ${date}</span>
          </div>
          <p style="color:var(--text-muted);font-size:0.88rem;margin-top:10px;line-height:1.6;">${c.description}</p>
          ${c.remarks ? `<p style="margin-top:8px;font-size:0.85rem;color:var(--cyan);"><i class="fa-solid fa-comment-dots"></i> <strong>Remarks:</strong> ${c.remarks}</p>` : ''}
        </div>
      `;
    });

    listDiv.innerHTML = html;

  } catch (err) {
    listDiv.innerHTML = '<div class="no-results"><i class="fa-solid fa-triangle-exclamation"></i> Could not connect to server.</div>';
  }
}
