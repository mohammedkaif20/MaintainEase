// complaint-form.js - Handles resident complaint submission

const API = 'http://localhost:3000/api/complaints';
const form = document.getElementById('complaint-form');
const msgBox = document.getElementById('form-message');

form.addEventListener('submit', async function (e) {
  e.preventDefault(); // stop page from refreshing

  // Collect form values
  const data = {
    residentName:    document.getElementById('residentName').value.trim(),
    apartmentNumber: document.getElementById('apartmentNumber').value.trim(),
    title:           document.getElementById('title').value.trim(),
    category:        document.getElementById('category').value,
    priority:        document.getElementById('priority').value,
    description:     document.getElementById('description').value.trim()
  };

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
  submitBtn.disabled = true;

  try {
    const response = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      showMessage('✅ Complaint submitted successfully!', 'success');
      form.reset();
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
  msgBox.innerHTML = text;
  msgBox.className = 'form-message ' + type;
}
