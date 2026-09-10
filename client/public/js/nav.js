/* =====================================================
   nav.js – Shared navbar auth logic
   Loaded on every public page (not admin sidebar pages).
   - Hides Admin nav link for non-admins / logged-out users
   - Replaces Login button with user name + Logout when signed in
   ===================================================== */

(function () {
  var token = localStorage.getItem('me_token');
  var role  = localStorage.getItem('me_role');
  var name  = localStorage.getItem('me_name');

  /* ---- Hide Admin link for non-admins ---- */
  var adminLinks = document.querySelectorAll('.nav-admin-link');
  adminLinks.forEach(function (link) {
    if (role !== 'admin') {
      var li = link.closest('li');
      if (li) li.style.display = 'none';
    }
  });

  /* ---- Replace Login li with name + Logout when signed in ---- */
  var loginLi = document.getElementById('nav-login-li');
  if (loginLi && token && name) {
    loginLi.style.display = 'flex';
    loginLi.style.alignItems = 'center';
    loginLi.style.gap = '8px';
    loginLi.innerHTML =
      '<span style="color:var(--text-muted);font-size:0.85rem;padding:7px 10px;display:flex;align-items:center;gap:6px;">' +
        '<i class="fa-solid fa-circle-user"></i>' + escapeHtml(name) +
      '</span>' +
      '<a href="#" id="nav-logout-btn" class="btn btn-outline" style="padding:7px 18px;font-size:0.85rem;">' +
        '<i class="fa-solid fa-right-from-bracket"></i> Logout' +
      '</a>';

    document.getElementById('nav-logout-btn').addEventListener('click', function (e) {
      e.preventDefault();
      doLogout();
    });
  }

  /* ---- Logout helper ---- */
  function doLogout() {
    localStorage.removeItem('me_token');
    localStorage.removeItem('me_role');
    localStorage.removeItem('me_name');
    localStorage.removeItem('me_apt');
    window.location.href = '/views/login.html';
  }

  /* ---- Escape HTML to prevent XSS in name display ---- */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
})();
