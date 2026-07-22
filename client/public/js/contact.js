// contact.js - Handles the contact form (client-side only, shows a thank-you message)

const form = document.getElementById('contact-form');
const msgBox = document.getElementById('contact-message-status');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('contact-name').value.trim();

  // Show a thank-you message (no backend needed for contact form)
  msgBox.textContent = '✅ Thank you, ' + name + '! Your message has been received. We will get back to you soon.';
  msgBox.className = 'form-message success';

  form.reset();
});
