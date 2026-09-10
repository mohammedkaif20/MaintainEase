// home.js – Loads live stats with animated counters
// Uses the public /api/complaints/stats endpoint — works without login

const API = '/api/complaints/stats'; // Relative path — works on any deployment

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

async function loadStats() {
  try {
    const response = await fetch(API);
    if (!response.ok) return;

    const data = await response.json();

    animateCounter(document.getElementById('stat-total'),      data.total);
    animateCounter(document.getElementById('stat-pending'),    data.pending);
    animateCounter(document.getElementById('stat-assigned'),   data.assigned);
    animateCounter(document.getElementById('stat-inprogress'), data.inProgress);
    animateCounter(document.getElementById('stat-completed'),  data.completed);

  } catch (err) {
    console.error('Could not load stats:', err.message);
  }
}

loadStats();
