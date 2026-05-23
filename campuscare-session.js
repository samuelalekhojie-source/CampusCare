/**
 * campuscare-session.js
 * Place <script src="campuscare-session.js"></script> as the
 * VERY FIRST thing inside <body> in index.html
 */
(function () {
  'use strict';

  /* 1. Auth guard */
  var raw = localStorage.getItem('cc_user');
  if (!raw) { window.location.replace('login.html'); return; }

  var user;
  try { user = JSON.parse(raw); }
  catch (e) { localStorage.removeItem('cc_user'); window.location.replace('login.html'); return; }

  /* 2. Apply to DOM */
  function applySession() {

    /* Welcome message */
    var welcome = document.querySelector('.welcome-msg');
    if (welcome) {
      welcome.textContent = 'Welcome ' + (user.firstName || user.fullName) + '! We\'re glad you\'re back 👋';
    }

    /* Sidebar — initials + name */
    var sidebarAvatar = document.querySelector('.sidebar-profile-avatar');
    if (sidebarAvatar) {
      if (user.avatarUrl) {
        sidebarAvatar.style.cssText += 'padding:0;overflow:hidden;';
        sidebarAvatar.innerHTML = '<img src="' + user.avatarUrl + '" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">';
      } else {
        sidebarAvatar.textContent = user.initials || '??';
      }
    }

    var sidebarName = document.querySelector('.sidebar-profile-name');
    if (sidebarName) sidebarName.textContent = user.displayName || user.fullName;

    /* Profile dropdown avatar */
    var dropdownAvatar = document.querySelector('.profile-dropdown-avatar');
    if (dropdownAvatar) {
      if (user.avatarUrl) {
        dropdownAvatar.style.cssText += 'padding:0;overflow:hidden;border:2px solid var(--color-primary);';
        dropdownAvatar.innerHTML = '<img src="' + user.avatarUrl + '" alt="' + user.fullName + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">';
      } else {
        dropdownAvatar.textContent = user.initials || '??';
      }
    }

    /* Profile dropdown — name + email */
    var dropdownName = document.querySelector('.profile-dropdown-name');
    if (dropdownName) dropdownName.textContent = user.fullName;

    var dropdownMeta = document.querySelector('.profile-dropdown-meta');
    if (dropdownMeta) dropdownMeta.textContent = user.email;

    /* Topbar avatar */
    var topbarImg = document.querySelector('.user-account img');
    if (topbarImg) {
      if (user.avatarUrl) {
        topbarImg.src = user.avatarUrl;
        topbarImg.alt = user.fullName;
      } else {
        /* No photo — show initials circle */
        var circle = document.createElement('div');
        circle.style.cssText = 'width:100%;height:100%;border-radius:50%;background:var(--color-primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.68rem;font-weight:600;cursor:pointer;border:1px solid var(--color-border-glass);box-shadow:var(--shadow-avatar);user-select:none;letter-spacing:0.03em;';
        circle.textContent = user.initials || '??';
        topbarImg.replaceWith(circle);
      }
    }

    /* 3. Logout */
    document.querySelectorAll('.dropdown-item').forEach(function (item) {
      var title = item.querySelector('.dropdown-item-title');
      if (title && title.textContent.trim().toLowerCase() === 'log out') {
        item.addEventListener('click', function (e) {
          e.stopPropagation();
          localStorage.removeItem('cc_user');
          /* Revoke Google session too so it doesn't auto-sign back in */
          if (window.google && window.google.accounts && window.google.accounts.id) {
            google.accounts.id.disableAutoSelect();
          }
          window.location.href = 'login.html';
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applySession);
  } else {
    applySession();
  }
})();
