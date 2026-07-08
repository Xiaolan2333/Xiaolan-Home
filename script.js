document.addEventListener('DOMContentLoaded', () => {
  const config = SITE_CONFIG;

  // ===== Set Title & Favicon =====
  if (config.title) document.title = config.title;
  const favicon = document.getElementById('favicon');
  if (favicon && config.favicon) favicon.href = config.favicon;

  // ===== Set Background =====
  const bgImg = document.querySelector('.bg-image');
  if (bgImg && config.background) bgImg.src = config.background;

  // ===== Set Avatar & Name =====
  const avatarImg = document.querySelector('.avatar img');
  const nameEl = document.querySelector('.name');
  const taglineEl = document.querySelector('.tagline');
  if (avatarImg && config.avatar) avatarImg.src = config.avatar;
  if (nameEl) nameEl.textContent = config.name;
  if (taglineEl) taglineEl.textContent = config.tagline;

  // ===== Avatar 8-Click Spin =====
  const avatarEl = document.getElementById('avatar');
  let clickCount = 0;
  let clickTimer = null;

  if (avatarEl) {
    avatarEl.addEventListener('click', () => {
      clickCount++;
      if (clickTimer) clearTimeout(clickTimer);

      if (clickCount >= 4) {
        clickCount = 0;
        avatarEl.classList.remove('spin');
        void avatarEl.offsetWidth;
        avatarEl.classList.add('spin');
        setTimeout(() => avatarEl.classList.remove('spin'), 600);
      } else {
        clickTimer = setTimeout(() => { clickCount = 0; }, 300);
      }
    });
  }

  // ===== Render Sections =====
  const sectionsContainer = document.getElementById('sections');
  if (sectionsContainer && config.sections) {
    sectionsContainer.innerHTML = config.sections.map(section => {
      const title = section.title || '';
      let content = '';

      switch (section.type) {
        case 'contact':
          content = renderContacts(section.items || []);
          break;
        case 'sites':
          content = renderSites(section.items || []);
          break;
        case 'tech':
          content = renderTech(section.items || []);
          break;
        case 'custom':
          content = section.html || '';
          break;
        default:
          content = '';
      }

      return `
        <section class="section scroll-reveal">
          <div class="section-title">${title}</div>
          ${content}
        </section>`;
    }).join('');
  }

  // ===== Render Footer =====
  const footerEl = document.querySelector('.footer p');
  if (footerEl && config.footer) footerEl.innerHTML = config.footer;

  // ===== Scroll Reveal =====
  const sections = document.querySelectorAll('.scroll-reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.15 });
  sections.forEach(s => observer.observe(s));

  // ===== Back to Top =====
  const backBtn = document.querySelector('.back-to-top');
  window.addEventListener('scroll', () => {
    backBtn.classList.toggle('show', window.scrollY > 400);
  });

  // ===== Live Clock =====
  const clock = document.getElementById('live-time');
  function updateTime() {
    clock.textContent = new Date().toLocaleString('zh-CN', { hour12: false });
  }
  updateTime();
  setInterval(updateTime, 1000);

  // ===== Custom Cursor =====
  const cursor = document.getElementById('cursor');
  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mouseover', e => {
      if (e.target.closest('a, button, [onclick], .contact-item, .site-item, .tech-tag, .avatar, .avatar-menu-item')) {
        cursor.classList.add('hover');
      }
    });

    document.addEventListener('mouseout', e => {
      if (e.target.closest('a, button, [onclick], .contact-item, .site-item, .tech-tag, .avatar, .avatar-menu-item')) {
        cursor.classList.remove('hover');
      }
    });
  }
});

// ===== Render Functions =====
function renderContacts(items) {
  if (!items || !items.length) return '';
  return `<div class="contact-grid">${items.map(c => {
    const tag = c.link ? 'a' : 'div';
    const href = c.link
      ? `href="${c.link}"${c.link.startsWith('http') ? ' target="_blank"' : ''}`
      : `onclick="copyToClipboard('${c.value}')"`;
    const iconContent = c.iconSvg
      ? c.iconSvg
      : (c.icon && c.icon.startsWith('http') ? `<img src="${c.icon}" alt="">` : (c.icon || ''));
    return `
      <${tag} class="contact-item hover-lift" ${href}>
        <div class="icon">${iconContent}</div>
        <div class="info">
          <div class="label">${c.label || ''}</div>
          <div class="value">${c.value || ''}</div>
        </div>
      </${tag}>`;
  }).join('')}</div>`;
}

function renderSites(items) {
  if (!items || !items.length) return '';
  return `<div class="site-list">${items.map(s => {
    const iconContent = s.iconSvg ? s.iconSvg : (s.icon || '');
    return `
      <a class="site-item hover-lift" href="${s.link}" target="_blank">
        <div class="site-icon">${iconContent}</div>
        <div class="site-info">
          <div class="site-name">${s.name}</div>
          <div class="site-desc">${s.desc}</div>
        </div>
        <span class="site-tag ${s.tagColor}">${s.tag}</span>
      </a>`;
  }).join('')}</div>`;
}

function renderTech(items) {
  if (!items || !items.length) return '';
  return `<div class="tech-cloud">${items.map(t =>
    `<span class="tech-tag">${t}</span>`
  ).join('')}</div>`;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('已复制到剪贴板！');
  }).catch(() => {});
}
