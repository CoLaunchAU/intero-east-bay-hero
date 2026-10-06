(() => {
  const header = document.querySelector('.site-header');
  const triggers = [...document.querySelectorAll('.nav-trigger')];
  const menuButton = document.querySelector('.menu-button');
  const backdrop = document.querySelector('.menu-backdrop');
  const menuPanel = document.querySelector('.menu-panel');
  const closeButton = document.querySelector('.menu-close');
  let previousOverflow = '';

  function closeDropdowns() {
    triggers.forEach(trigger => {
      trigger.setAttribute('aria-expanded', 'false');
      document.getElementById(trigger.getAttribute('aria-controls')).hidden = true;
    });
  }
  function openDropdown(trigger) {
    const active = trigger.getAttribute('aria-expanded') === 'true';
    closeDropdowns();
    if (!active) {
      trigger.setAttribute('aria-expanded', 'true');
      document.getElementById(trigger.getAttribute('aria-controls')).hidden = false;
    }
  }
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => openDropdown(trigger));
    trigger.closest('.nav-item').addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeDropdowns();
        trigger.focus();
      }
      if (event.key === 'ArrowDown' && event.target === trigger) {
        event.preventDefault();
        closeDropdowns();
        trigger.setAttribute('aria-expanded', 'true');
        const panel = document.getElementById(trigger.getAttribute('aria-controls'));
        panel.hidden = false;
        panel.querySelector('a')?.focus();
      }
    });
  });
  document.addEventListener('pointerdown', event => {
    if (!header.contains(event.target)) closeDropdowns();
  });

  function showMenu() {
    closeDropdowns();
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    backdrop.hidden = false;
    menuButton.setAttribute('aria-expanded', 'true');
    closeButton.focus();
  }
  function hideMenu() {
    backdrop.hidden = true;
    document.body.style.overflow = previousOverflow;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.focus();
  }
  menuButton.addEventListener('click', showMenu);
  closeButton.addEventListener('click', hideMenu);
  backdrop.addEventListener('click', event => {
    if (event.target === backdrop) hideMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (!backdrop.hidden) hideMenu();
      else closeDropdowns();
    }
    if (event.key !== 'Tab' || backdrop.hidden) return;
    const focusable = [...menuPanel.querySelectorAll('a, button')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
