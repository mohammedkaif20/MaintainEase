// admin-dashboard.js – Stats with counters + bar chart + recent complaints table

const API = '/api/complaints';

function animateCounter(el, target) {
  let count = 0;
  if (target === 0) { el.textContent = 0; return; }
  const step = Math.max(1, Math.floor(target / 30));
  const timer = setInterval(function () {
    count = Math.min(count + step, target);
    el.textContent = count;
    if (count >= target) clearInterval(timer);
  }, 40);
}

function renderChart(pending, assigned, inProgress, completed) {
  const container = document.getElementById('chart-bars');
  if (!container) return;

  const max = Math.max(pending, assigned, inProgress, completed, 1);
  const bars = [
    { label: 'Pending',     value: pending,    color: 'linear-gradient(180deg,#f59e0b,#f97316)' },
    { label: 'Assigned',    value: assigned,   color: 'linear-gradient(180deg,#06b6d4,#3b82f6)' },
    { label: 'In Progress', value: inProgress, color: 'linear-gradient(180deg,#8b5cf6,#ec4899)' },
    { label: 'Completed',   value: completed,  color: 'linear-gradient(180deg,#10b981,#06b6d4)' }
  ];

  container.innerHTML = '';

  bars.forEach(function (bar) {
    const heightPct = Math.round((bar.value / max) * 100);
    const group = document.createElement('div');
    group.className = 'chart-bar-group';
    group.innerHTML = `
      <span class="chart-bar-val">${bar.value}</span>
      <div class="chart-bar" style="height:${heightPct}%;background:${bar.color};"></div>
      <span class="chart-bar-label">${bar.label}</span>
    `;
    container.appendChild(group);
  });
}

async function loadDashboard() {
  try {
    const response = await fetch(API);
    const complaints = await response.json();

    const total      = complaints.length;
    const pending    = complaints.filter(c => c.status === 'Pending').length;
    const assigned   = complaints.filter(c => c.status === 'Assigned').length;
    const inProgress = complaints.filter(c => c.status === 'In Progress').length;
    const completed  = complaints.filter(c => c.status === 'Completed').length;

    // Animate counters
    animateCounter(document.getElementById('stat-total'),      total);
    animateCounter(document.getElementById('stat-pending'),    pending);
    animateCounter(document.getElementById('stat-assigned'),   assigned);
    animateCounter(document.getElementById('stat-inprogress'), inProgress);
    animateCounter(document.getElementById('stat-completed'),  completed);

    // Render chart
    renderChart(pending, assigned, inProgress, completed);

    // Recent complaints (latest 7)
    const recent = complaints.slice(0, 7);
    const tbody = document.getElementById('recent-tbody');
    tbody.innerHTML = '';

    if (recent.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-dim);padding:32px;">No complaints yet.</td></tr>';
      return;
    }

    recent.forEach(function (c) {
      const statusClass = c.status.replace(' ', '').toLowerCase();
      const date = new Date(c.createdAt).toLocaleDateString('en-IN');
      tbody.innerHTML += `
        <tr>
          <td style="color:var(--text);">${c.residentName}</td>
          <td><span style="background:var(--bg-card2);padding:3px 10px;border-radius:6px;font-size:0.8rem;">${c.apartmentNumber}</span></td>
          <td style="color:var(--text);">${c.title}</td>
          <td>${c.category}</td>
          <td><span class="priority-${c.priority.toLowerCase()}">${c.priority}</span></td>
          <td><span class="badge badge-${statusClass}">${c.status}</span></td>
          <td style="color:var(--text-dim);font-size:0.82rem;">${date}</td>
        </tr>
      `;
    });

  } catch (err) {
    console.log('Dashboard error:', err.message);
  }
}

loadDashboard();
