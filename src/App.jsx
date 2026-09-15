import React, { useState, useEffect } from 'react';
import { INITIAL_PROJECTS, INITIAL_SERVICES, SECTORS_LIST } from './data/initialData';
import { generateServiceHTML } from './utils/codeExporter';
import Header from './components/Header';
import ServiceTabs from './components/ServiceTabs';
import ProjectCard from './components/ProjectCard';
import ProjectFormModal from './components/ProjectFormModal';
import PublishingDashboard from './components/PublishingDashboard';
import Toast from './components/Toast';

const LOCAL_STORAGE_KEY = 'mahyoub_portfolio_projects_v1';

export default function App() {
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load projects from localStorage:', e);
    }
    return INITIAL_PROJECTS;
  });

  const [activeTab, setActiveTab] = useState('wordpress'); // 'wordpress' | 'ai' | 'google-ads' | 'publish'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [toastMessage, setToastMessage] = useState(null);

  // Save to localStorage on any state change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [projects]);

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  // Filter projects by current active tab, search, and sector
  const currentServiceProjects = projects.filter(p => {
    if (p.serviceId !== activeTab) return false;
    if (selectedSector !== 'all' && p.sector !== selectedSector) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = p.title?.toLowerCase().includes(q);
      const descMatch = p.description?.toLowerCase().includes(q);
      const sectorMatch = p.sector?.toLowerCase().includes(q);
      const resultMatch = p.result?.toLowerCase().includes(q);
      return titleMatch || descMatch || sectorMatch || resultMatch;
    }
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = (savedProject) => {
    if (editingProject) {
      setProjects(prev => prev.map(p => p.id === savedProject.id ? savedProject : p));
      showToast(`تم تعديل بيانات المشروع "${savedProject.title}" بنجاح`);
    } else {
      setProjects(prev => [...prev, savedProject]);
      showToast(`تمت إضافة المشروع الجديد "${savedProject.title}" بنجاح المعرض`);
    }
    setIsModalOpen(false);
  };

  const handleDeleteProject = (id) => {
    const target = projects.find(p => p.id === id);
    if (window.confirm(`هل أنت تأكد من إغلاق وحذف المشروع "${target?.title || ''}"؟`)) {
      setProjects(prev => prev.filter(p => p.id !== id));
      showToast('تم حذف المشروع بنجاح من القائمة');
    }
  };

  const handleCopyCardHtml = (project) => {
    const singleCardHtml = `
<!-- بطاقة مشروع: ${project.title} -->
<div class="portfolio-card" data-sector="${project.sector}">
  <div class="portfolio-image-wrapper">
    <img src="${project.image}" alt="${project.title}" loading="lazy" class="portfolio-img">
    <span class="sector-badge"><i class="fas fa-tag"></i> ${project.sector}</span>
  </div>
  <div class="portfolio-content">
    <h3 class="portfolio-title">${project.title}</h3>
    <p class="portfolio-desc">${project.description}</p>
    <div class="portfolio-result">
      <i class="fas fa-chart-line"></i>
      <span>${project.result}</span>
    </div>
    <div class="portfolio-actions">
      <a href="${project.url}" target="_blank" rel="nofollow noopener noreferrer" class="btn-visit">
        زيارة الموقع <i class="fas fa-external-link-alt"></i>
      </a>
    </div>
  </div>
</div>`.trim();

    navigator.clipboard.writeText(singleCardHtml);
    showToast(`تم نسخ كود HTML الخاص بالمشروع "${project.title}"`);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mahyoub_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('تم تصدير ملف النسخة الاحتياطية JSON بنجاح');
  };

  const handleImportJson = (importedProjects) => {
    setProjects(importedProjects);
    showToast('تم استيراد المشاريع بنجاح وتحديث البيانات');
  };

  const handleResetDefaults = () => {
    if (window.confirm('هل تريد استعادة البيانات الافتراضية الأولية؟ سيتم مسح أي تعديلات يدوية.')) {
      setProjects(INITIAL_PROJECTS);
      showToast('تمت استعادة البيانات الافتراضية الأولية');
    }
  };

  const currentServiceObj = INITIAL_SERVICES.find(s => s.id === activeTab);

  return (
    <div className="app-container">
      {/* Header */}
      <Header
        projects={projects}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onResetDefaults={handleResetDefaults}
      />

      {/* Tabs */}
      <ServiceTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projects={projects}
      />

      {/* Service Tab View OR Publishing View */}
      {activeTab === 'publish' ? (
        <PublishingDashboard
          projects={projects}
          onShowToast={showToast}
        />
      ) : (
        <main>
          {/* Action Bar */}
          <div className="service-bar">
            <div className="service-title-area">
              <h2>
                <i className={`fab ${currentServiceObj?.icon} fas ${currentServiceObj?.icon}`} style={{ color: 'var(--accent)' }}></i>
                <span>{currentServiceObj?.name}</span>
              </h2>
              <p>{currentServiceObj?.description}</p>
            </div>

            <div className="filter-actions">
              {/* Search */}
              <div className="search-input-wrapper">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  className="search-input"
                  placeholder="بحث في المشاريع..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Sector Filter */}
              <select
                className="select-filter"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
              >
                <option value="all">جميع القطاعات</option>
                {SECTORS_LIST.map(sec => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>

              {/* Add Project Button */}
              <button className="btn-primary" onClick={handleOpenAddModal}>
                <i className="fas fa-plus-circle"></i> إضافة مشروع جديد
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          {currentServiceProjects.length === 0 ? (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px border var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '4rem 2rem',
              textAlign: 'center',
              color: 'var(--text-muted)'
            }}>
              <i className="fas fa-folder-open" style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--border-color)', display: 'block' }}></i>
              <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>لا توجد مشاريع مطابقة</h3>
              <p>لم يتم العثور على مشاريع في هذا القسم. اضغط على زر "إضافة مشروع جديد" لإضافة أول مشروعك.</p>
            </div>
          ) : (
            <div className="projects-grid">
              {currentServiceProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteProject}
                  onCopyCardHtml={handleCopyCardHtml}
                />
              ))}
            </div>
          )}
        </main>
      )}

      {/* Add / Edit Form Modal */}
      {isModalOpen && (
        <ProjectFormModal
          project={editingProject}
          initialServiceId={activeTab === 'publish' ? 'wordpress' : activeTab}
          onSave={handleSaveProject}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
