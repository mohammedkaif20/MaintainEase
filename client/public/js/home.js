// home.js – Loads live stats with animated counters

const API = 'http://localhost:3000/api/complaints';

// Animate a number from 0 to target
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
    const complaints = await response.json();

    const total      = complaints.length;
    const pending    = complaints.filter(c => c.status === 'Pending').length;
    const assigned   = complaints.filter(c => c.status === 'Assigned').length;
    const inProgress = complaints.filter(c => c.status === 'In Progress').length;
    const completed  = complaints.filter(c => c.status === 'Completed').length;

    animateCounter(document.getElementById('stat-total'),      total);
    animateCounter(document.getElementById('stat-pending'),    pending);
    animateCounter(document.getElementById('stat-assigned'),   assigned);
    animateCounter(document.getElementById('stat-inprogress'), inProgress);
    animateCounter(document.getElementById('stat-completed'),  completed);

  } catch (err) {
    console.log('Could not load stats:', err.message);
  }
}

loadStats();
