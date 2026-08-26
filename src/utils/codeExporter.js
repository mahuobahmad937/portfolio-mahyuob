/**
 * Code Exporter Utility
 * Generates ready-to-use clean HTML portfolio section code for each service.
 */

export function generateServiceHTML(projects, serviceId = 'all', serviceTitle = '') {
  const filteredProjects = serviceId === 'all' 
    ? projects 
    : projects.filter(p => p.serviceId === serviceId);

  const titleText = serviceTitle || getServiceDefaultTitle(serviceId);

  const cardsHtml = filteredProjects.map(project => {
    let domainDisplay = 'https://site.com';
    try { domainDisplay = new URL(project.url).hostname; } catch(e) {}

    return `
    <!-- بطاقة مشروع: ${escapeHtml(project.title)} -->
    <div class="portfolio-card" data-sector="${escapeHtml(project.sector)}">
      <div class="browser-mockup-header">
        <div class="browser-mockup-dots">
          <span class="browser-mockup-dot" style="background:#EF4444;"></span>
          <span class="browser-mockup-dot" style="background:#F59E0B;"></span>
          <span class="browser-mockup-dot" style="background:#10B981;"></span>
        </div>
        <div class="browser-mockup-url">${escapeHtml(domainDisplay)}</div>
      </div>
      <div class="portfolio-image-wrapper">
        <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" loading="lazy" class="portfolio-img">
        <span class="sector-badge"><i class="fas fa-tag"></i> ${escapeHtml(project.sector)}</span>
      </div>
      <div class="portfolio-content">
        <h3 class="portfolio-title">${escapeHtml(project.title)}</h3>
        <p class="portfolio-desc">${escapeHtml(project.description)}</p>
        
        <div class="portfolio-result">
          <i class="fas fa-chart-line"></i>
          <span>${escapeHtml(project.result)}</span>
        </div>
        
        <div class="portfolio-actions">
          <a href="${escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer" class="btn-visit">
            زيارة الموقع <i class="fas fa-arrow-left"></i>
          </a>
        </div>
      </div>
    </div>`;
  }).join('\n');

  const fullSectionHtml = `
<!-- ========================================================================== -->
<!-- قسم المعرض والمشاريع المنجزة - تصدير من لوحة تحكم مهيوب -->
<!-- ========================================================================== -->
<section class="portfolio-section" id="portfolio">
  <div class="container">
    <div class="section-header text-center">
      <span class="section-badge"><i class="fas fa-briefcase"></i> المشاريع المنجزة</span>
      <h2 class="section-title">${titleText}</h2>
      <p class="section-subtitle">نماذج حقيقية من مشاريع نجحنا في تطويرها وتحقيق نتائج ملموسة فيها</p>
    </div>

    <div class="portfolio-grid">
${cardsHtml}
    </div>
  </div>
</section>
<!-- نهاية قسم المعرض -->
`.trim();

  return fullSectionHtml;
}

function getServiceDefaultTitle(serviceId) {
  switch (serviceId) {
    case 'wordpress':
      return 'معرض مواقع ووردبريس المخصصة';
    case 'ai':
      return 'معرض مواقع وتطبيقات الذكاء الاصطناعي';
    case 'google-ads':
      return 'نتائج حملات إعلانات جوجل الاحترافية';
    default:
      return 'معرض المشاريع والأعمال المنجزة';
  }
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
