/**
 * campuscare-session.js
 * ─────────────────────────────────────────────────────
 * Add <script src="campuscare-session.js"></script>
 * as the FIRST thing inside <body> in index.html
 * ─────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── 1. Auth guard — redirect to login if no session ── */
  var raw = localStorage.getItem('cc_user');
  if (!raw) {
    window.location.replace('login.html');
    return;
  }

  var user;
  try { user = JSON.parse(raw); }
  catch (e) {
    localStorage.removeItem('cc_user');
    window.location.replace('login.html');
    return;
  }

  /* ── 2. Apply session data when DOM is ready ── */
  function applySession() {

    /* Welcome message */
    var welcome = document.querySelector('.welcome-msg');
    if (welcome) {
      welcome.textContent = 'Welcome ' + (user.firstName || user.fullName) + '! We\'re glad you\'re back 👋';
    }

    /* Sidebar profile — initials */
    var sidebarAvatar = document.querySelector('.sidebar-profile-avatar');
    if (sidebarAvatar) sidebarAvatar.textContent = user.initials || '??';

    /* Sidebar profile — name */
    var sidebarName = document.querySelector('.sidebar-profile-name');
    if (sidebarName) sidebarName.textContent = user.displayName || user.fullName;

    /* Profile dropdown — avatar initials or photo */
    var dropdownAvatar = document.querySelector('.profile-dropdown-avatar');
    if (dropdownAvatar) {
      if (user.avatarUrl) {
        /* Replace initials circle with actual photo */
        dropdownAvatar.style.padding = '0';
        dropdownAvatar.style.overflow = 'hidden';
        dropdownAvatar.innerHTML = '<img src="' + user.avatarUrl + '" alt="' + user.fullName + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">';
      } else {
        dropdownAvatar.textContent = user.initials || '??';
      }
    }

    /* Profile dropdown — full name */
    var dropdownName = document.querySelector('.profile-dropdown-name');
    if (dropdownName) dropdownName.textContent = user.fullName;

    /* Profile dropdown — email as meta */
    var dropdownMeta = document.querySelector('.profile-dropdown-meta');
    if (dropdownMeta) dropdownMeta.textContent = user.email;

    /* Topbar avatar */
    var topbarImg = document.querySelector('.user-account img');
    if (topbarImg) {
      if (user.avatarUrl) {
        topbarImg.src = user.avatarUrl;
        topbarImg.alt = user.fullName;
      } else {
        /* No MS photo set — replace with initials circle */
        var circle = document.createElement('div');
        circle.style.cssText = [
          'width:100%;height:100%;',
          'border-radius:50%;',
          'background:var(--color-primary);',
          'color:#fff;',
          'display:flex;align-items:center;justify-content:center;',
          'font-size:0.7rem;font-weight:600;',
          'cursor:pointer;',
          'border:1px solid var(--color-border-glass);',
          'box-shadow:var(--shadow-avatar);',
          'user-select:none;letter-spacing:0.02em;'
        ].join('');
        circle.textContent = user.initials || '??';
        topbarImg.replaceWith(circle);
      }
    }

    /* ── 3. Logout handler ── */
    /* Attach to any element containing "Log out" text */
    document.querySelectorAll('.dropdown-item').forEach(function (item) {
      var title = item.querySelector('.dropdown-item-title');
      if (title && title.textContent.trim().toLowerCase() === 'log out') {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function (e) {
          e.stopPropagation();
          signOut();
        });
      }
    });
  }

  /* ── Sign out: clear session + MSAL cache, go to login ── */
  function signOut() {
    /* Clear our session */
    localStorage.removeItem('cc_user');

    /* Also clear MSAL's cached tokens so MS doesn't auto-login */
    Object.keys(localStorage).forEach(function (key) {
      if (key.startsWith('msal.') || key.startsWith('msal|')) {
        localStorage.removeItem(key);
      }
    });

    window.location.href = 'login.html';
  }

  /* Run when DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applySession);
  } else {
    applySession();
  }

})();
