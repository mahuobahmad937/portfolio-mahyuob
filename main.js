/* ==========================================================================
   الموقع الشخصي - مهيوب | السكريبت والتفاعلات الديناميكية (main.js)
   ========================================================================== */

function initAll() {
  initNavbar();
  initFunnelTabs();
  initModals();
  initSmoothScroll();
  initDynamicPortfolio();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

/* ==========================================================================
   5. المعرض والتحديث التلقائي للمشاريع من Firestore (Dynamic Portfolio)
   ========================================================================== */
function initDynamicPortfolio() {
  const portfolioSections = document.querySelectorAll('.portfolio-section');
  if (portfolioSections.length === 0) return;

  const INITIAL_LIMIT = 12;

  const DEFAULT_PROJECTS = [
    {
      id: 'proj-1787611091421',
      serviceId: 'wordpress',
      title: 'مؤسسة رؤية التشييد للمقاولات',
      sector: 'موقع تعريفي',
      url: 'https://muqawalatdammam.com/',
      image: 'https://iad.microlink.io/qjk8sffln2MwN1crB6wTfTHL8DdXd-YaYk1i57D_PpSm4GQbaOjFUSXDVmiR3Fs5mvWkPUQIMXnGqrYCddqIHw.png',
      description: 'تصميم وتطوير موقع مؤسسة رؤية التشييد للمقاولات العامة بالدمام والخبر مع أداء عالي وتصفح سريع.',
      result: 'موقع تعريفي متكامل أونلاين'
    }
  ];

  async function loadAndRender() {
    let projects = DEFAULT_PROJECTS;

    // جلب المشاريع من Firestore
    try {
      const snapshot = await db.collection('projects').get();
      if (!snapshot.empty) {
        const firestoreProjects = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        if (firestoreProjects.length > 0) {
          // الترتيب حسب تاريخ الإنشاء: الأقدم أولاً (تصاعدياً)
          firestoreProjects.sort((a, b) => {
            const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
            const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
            return timeA - timeB;
          });
          projects = firestoreProjects;
        }
      }
    } catch (e) {
      console.warn('Unable to fetch projects from Firestore, using defaults:', e);
    }

    portfolioSections.forEach(section => {
      const serviceId = section.getAttribute('data-service') || 'all';
      const gridContainer = section.querySelector('.portfolio-grid');
      if (!gridContainer) return;

      const filtered = serviceId === 'all' 
        ? projects 
        : projects.filter(p => p.serviceId === serviceId);

      if (filtered.length === 0) {
        gridContainer.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
            <i class="fas fa-folder-open" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--border-hover); display: block;"></i>
            <p>لا توجد مشاريع مضافة في هذا القسم حالياً.</p>
          </div>`;
        const oldWrap = section.querySelector('.portfolio-load-more-wrap');
        if (oldWrap) oldWrap.remove();
        return;
      }

      // تطبيق حد الـ 12 مشروعاً مع زر عرض المزيد فقط في الصفحة الرئيسية (serviceId === 'all')
      // أما في صفحات الخدمات الفرعية، يتم عرض جميع مشاريع الخدمة المحددة مباشرة دون تقييد
      const isHomePage = serviceId === 'all';
      let visibleCount = isHomePage ? INITIAL_LIMIT : filtered.length;

      function renderProjects() {
        const visibleList = filtered.slice(0, visibleCount);

        gridContainer.innerHTML = visibleList.map(p => {
          let domainDisplay = 'https://site.com';
          try { domainDisplay = new URL(p.url).hostname; } catch(e) {}

          return `
          <div class="portfolio-card portfolio-card-animate" data-sector="${escapeHtml(p.sector)}">
            <div class="browser-mockup-header">
              <div class="browser-mockup-dots">
                <span class="browser-mockup-dot" style="background:#EF4444;"></span>
                <span class="browser-mockup-dot" style="background:#F59E0B;"></span>
                <span class="browser-mockup-dot" style="background:#10B981;"></span>
              </div>
              <div class="browser-mockup-url">${escapeHtml(domainDisplay)}</div>
            </div>
            <div class="portfolio-image-wrapper">
              <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" loading="lazy" class="portfolio-img" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop';">
              <span class="sector-badge"><i class="fas fa-tag"></i> ${escapeHtml(p.sector || 'عام')}</span>
            </div>
            <div class="portfolio-content">
              <h3 class="portfolio-title">${escapeHtml(p.title)}</h3>
              <p class="portfolio-desc">${escapeHtml(p.description)}</p>
              <div class="portfolio-result">
                <i class="fas fa-chart-line"></i>
                <span>${escapeHtml(p.result)}</span>
              </div>
              <div class="portfolio-actions">
                <a href="${escapeHtml(p.url)}" target="_blank" rel="nofollow noopener noreferrer" class="btn-visit">
                  زيارة الموقع <i class="fas fa-arrow-left"></i>
                </a>
              </div>
            </div>
          </div>
        `;
        }).join('');

        // إدارة زر عرض المزيد فقط إذا بقيت مشاريع غير معروضة في الصفحة الرئيسية
        let loadMoreWrap = section.querySelector('.portfolio-load-more-wrap');
        const remaining = filtered.length - visibleCount;

        if (isHomePage && remaining > 0) {
          if (!loadMoreWrap) {
            loadMoreWrap = document.createElement('div');
            loadMoreWrap.className = 'portfolio-load-more-wrap';
            const container = section.querySelector('.container') || section;
            container.appendChild(loadMoreWrap);
          }

          loadMoreWrap.innerHTML = `
            <button class="btn-load-more">
              <i class="fas fa-plus-circle"></i> عرض المزيد من الأعمال (${remaining} متبقية)
            </button>
          `;

          const btn = loadMoreWrap.querySelector('.btn-load-more');
          btn.onclick = () => {
            visibleCount += INITIAL_LIMIT;
            renderProjects();
          };
        } else {
          if (loadMoreWrap) {
            loadMoreWrap.remove();
          }
        }
      }

      renderProjects();
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initial Render
  loadAndRender();
}


/* ==========================================================================
   1. الهيدر والقائمة المتجاوبة للجوال (Hamburger Menu)
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.style.boxShadow = '0 10px 25px rgba(15, 23, 42, 0.1)';
      } else {
        header.style.boxShadow = 'var(--shadow-sm)';
      }
    });
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('show');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    // إغلاق القائمة عند النقر على أي رابط
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        if (menuToggle.querySelector('i')) {
          menuToggle.querySelector('i').classList.add('fa-bars');
          menuToggle.querySelector('i').classList.remove('fa-times');
        }
      });
    });

    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('show');
        if (menuToggle.querySelector('i')) {
          menuToggle.querySelector('i').classList.add('fa-bars');
          menuToggle.querySelector('i').classList.remove('fa-times');
        }
      }
    });
  }
}

/* ==========================================================================
   2. أقسام المراحل التسويقية (Marketing Funnel Tabs)
   ========================================================================== */
function initFunnelTabs() {
  const tabs = document.querySelectorAll('.funnel-tab');
  const panels = document.querySelectorAll('.funnel-content-panel');

  if (tabs.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const step = tab.getAttribute('data-step');

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(`step-${step}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   3. النافذة المنبثقة للشهادة (Cert Modal)
   ========================================================================== */
function initModals() {
  const certModalBtn = document.getElementById('open-cert-modal');
  const modalOverlay = document.getElementById('cert-modal');
  const modalClose = document.getElementById('close-modal');

  if (certModalBtn && modalOverlay) {
    certModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modalOverlay.classList.add('active');
    });
  }

  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   4. التمرير السلس (Smooth Scroll)
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
