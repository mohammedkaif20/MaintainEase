// complaint-history.js – Search complaints by apartment number

const API = 'http://localhost:3000/api/complaints';
const searchBtn = document.getElementById('search-btn');
const input     = document.getElementById('apartment-input');
const listDiv   = document.getElementById('complaints-list');

searchBtn.addEventListener('click', searchComplaints);
input.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') searchComplaints();
});

async function searchComplaints() {
  const aptNumber = input.value.trim();

  if (!aptNumber) {
    listDiv.innerHTML = '<div class="no-results"><i class="fa-solid fa-building"></i>Please enter your apartment number.</div>';
    return;
  }

  listDiv.innerHTML = '<div class="no-results"><i class="fa-solid fa-spinner fa-spin"></i> Searching...</div>';

  try {
    const response = await fetch(API);
    const all = await response.json();

    const results = all.filter(c =>
      c.apartmentNumber.toLowerCase() === aptNumber.toLowerCase()
    );

    if (results.length === 0) {
      listDiv.innerHTML = `<div class="no-results"><i class="fa-solid fa-inbox"></i>No complaints found for apartment <strong>${aptNumber}</strong>.</div>`;
      return;
    }

    let html = `<p style="margin-bottom:20px;color:var(--text-muted);font-size:0.9rem;"><i class="fa-solid fa-circle-check" style="color:var(--emerald);margin-right:6px;"></i> Found <strong>${results.length}</strong> complaint(s) for Apartment <strong>${aptNumber}</strong></p>`;

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
