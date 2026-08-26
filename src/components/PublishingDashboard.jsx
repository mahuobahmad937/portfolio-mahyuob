import React, { useState } from 'react';
import { INITIAL_SERVICES } from '../data/initialData';
import { generateServiceHTML } from '../utils/codeExporter';

export default function PublishingDashboard({ projects, onShowToast }) {
  const [selectedService, setSelectedService] = useState('wordpress');
  const [previewDevice, setPreviewDevice] = useState('laptop'); // 'laptop' | 'tablet' | 'mobile'

  const activeProjects = selectedService === 'all' 
    ? projects 
    : projects.filter(p => p.serviceId === selectedService);

  const generatedHtml = generateServiceHTML(projects, selectedService);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedHtml);
    onShowToast('تم نسخ كود HTML الخاص بهذه الصفحة بنجاح! يمكنك لصقه في ملف HTML الخاص بموقعك.');
  };

  const handleDownloadFile = () => {
    const blob = new Blob([generatedHtml], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `portfolio-${selectedService}-export.html`;
    link.click();
    onShowToast('تم تحميل كود HTML كملف جاهز بنجاح!');
  };

  return (
    <div className="exporter-panel">
      {/* Exporter Header & Toolbar */}
      <div className="exporter-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-code-branch" style={{ color: 'var(--accent)' }}></i>
              لوحة تصدير الكود والنشر المباشر
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              اختر الخدمة وتفقد المعاينة المباشرة ثم انسخ كود HTML جاهزاً للدمج في موقعك
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          {/* Service Selector */}
          <select
            className="select-filter"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            style={{ fontWeight: 'bold' }}
          >
            {INITIAL_SERVICES.map(s => (
              <option key={s.id} value={s.id}>خدمة {s.name}</option>
            ))}
            <option value="all">جميع الخدمات الثلاث معاَ (All Services)</option>
          </select>

          {/* Export Action Buttons */}
          <button className="btn-primary" onClick={handleCopyCode}>
            <i className="fas fa-copy"></i> تصدير بيانات الصفحة (نسخ HTML)
          </button>

          <button className="btn-secondary" onClick={handleDownloadFile} title="تحميل كملف HTML">
            <i className="fas fa-file-download"></i> تحميل HTML
          </button>
        </div>
      </div>

      {/* Live Preview Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h4 style={{ fontSize: '1.25rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fas fa-eye" style={{ color: 'var(--cyan)' }}></i>
            معاينة مباشرة لكيف ستظهر البطاقات في الموقع
          </h4>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            يتم التحديث الآلي مع أي تعديل أو إضافة جديدة ({activeProjects.length} مشاريع)
          </span>
        </div>

        {/* Device Switcher */}
        <div className="device-switcher">
          <button
            className={`device-btn ${previewDevice === 'laptop' ? 'active' : ''}`}
            onClick={() => setPreviewDevice('laptop')}
          >
            <i className="fas fa-desktop"></i> لابتوب (Desktop)
          </button>

          <button
            className={`device-btn ${previewDevice === 'tablet' ? 'active' : ''}`}
            onClick={() => setPreviewDevice('tablet')}
          >
            <i className="fas fa-tablet-alt"></i> تابلت (Tablet)
          </button>

          <button
            className={`device-btn ${previewDevice === 'mobile' ? 'active' : ''}`}
            onClick={() => setPreviewDevice('mobile')}
          >
            <i className="fas fa-mobile-alt"></i> جوال (Mobile)
          </button>
        </div>
      </div>

      {/* Responsive Live Preview Device Frame */}
      <div className="preview-container-wrapper">
        <div className={`preview-frame ${previewDevice}`}>
          <div className="preview-browser-bar">
            <div className="browser-dots">
              <div className="browser-dot" style={{ background: '#E94560' }}></div>
              <div className="browser-dot" style={{ background: '#F59E0B' }}></div>
              <div className="browser-dot" style={{ background: '#10B981' }}></div>
            </div>
            <div className="browser-url">
              https://almoliky.com/{selectedService === 'all' ? 'portfolio' : selectedService}.html
            </div>
          </div>

          {/* Rendered Live Cards Container inside frame */}
          <div style={{ padding: '2rem 1.5rem', background: '#1A1A2E', minHeight: '350px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.95rem', letterSpacing: '1px' }}>
                <i className="fas fa-briefcase"></i> المشاريع المنجزة
              </span>
              <h2 style={{ fontSize: '1.75rem', color: 'white', marginTop: '0.25rem' }}>
                {selectedService === 'wordpress' && 'معرض مواقع ووردبريس المخصصة'}
                {selectedService === 'ai' && 'معرض مواقع وتطبيقات الذكاء الاصطناعي'}
                {selectedService === 'google-ads' && 'نتائج حملات إعلانات جوجل الاحترافية'}
                {selectedService === 'all' && 'معرض كافة الأعمال والمشاريع'}
              </h2>
            </div>

            {activeProjects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                <i className="fas fa-folder-open" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
                لا توجد مشاريع مضافة في هذه الخدمة حالياً. يمكنك إضافة مشروع جديد من تبويب الخدمة.
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: previewDevice === 'mobile' ? '1fr' : previewDevice === 'tablet' ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.25rem'
              }}>
                {activeProjects.map((p) => (
                  <div key={p.id} className="portfolio-card" style={{ background: '#16213E', borderColor: '#2A2A4A' }}>
                    <div className="portfolio-image-wrapper" style={{ height: '170px' }}>
                      <img src={p.image} alt={p.title} className="portfolio-img" />
                      <span className="sector-badge"><i className="fas fa-tag"></i> {p.sector}</span>
                    </div>
                    <div className="portfolio-content" style={{ padding: '1rem' }}>
                      <h4 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '0.4rem' }}>{p.title}</h4>
                      <p style={{ color: '#94A3B8', fontSize: '0.92rem', marginBottom: '0.75rem' }}>{p.description}</p>
                      <div className="portfolio-result" style={{ fontSize: '0.95rem', padding: '0.4rem 0.75rem' }}>
                        <i className="fas fa-chart-line"></i>
                        <span>{p.result}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Generated HTML Code Snippet Display Box */}
      <div className="code-box-wrapper">
        <div className="code-box-header">
          <span><i className="fas fa-code"></i> كود HTML التلقائي المولد جاهز للنسخ</span>
          <button className="btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.95rem' }} onClick={handleCopyCode}>
            <i className="fas fa-copy"></i> نسخ الكود
          </button>
        </div>
        <pre className="code-content">
          {generatedHtml}
        </pre>
      </div>
    </div>
  );
}
