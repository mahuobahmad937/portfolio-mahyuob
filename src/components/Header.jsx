import React, { useRef } from 'react';

export default function Header({ projects, onExportJson, onImportJson, onResetDefaults }) {
  const fileInputRef = useRef(null);

  const wpCount = projects.filter(p => p.serviceId === 'wordpress').length;
  const aiCount = projects.filter(p => p.serviceId === 'ai').length;
  const adsCount = projects.filter(p => p.serviceId === 'google-ads').length;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          if (Array.isArray(importedData)) {
            onImportJson(importedData);
          } else {
            alert('ملف JSON غير صالح');
          }
        } catch (err) {
          alert('خطأ أثناء قراءة ملف النسخة الاحتياطية');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <header style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="dashboard-header">
        <div className="brand-info">
          <div className="brand-icon">
            <i className="fas fa-chart-pie"></i>
          </div>
          <div className="brand-titles">
            <h1>
              لوحة تحكم مهيوب
              <span style={{ fontSize: '0.9rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: 'var(--accent)', color: 'white' }}>React Admin</span>
            </h1>
            <p>إدارة معارض الأعمال والتسويق الرقمي وتوليد أكواد التصدير للموقع</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="save-status-badge">
            <i className="fas fa-save"></i>
            <span>حفظ تلقائي (localStorage)</span>
          </div>

          <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.95rem' }} onClick={onExportJson} title="تصدير ملف نسخة احتياطية JSON">
            <i className="fas fa-download"></i> تصدير JSON
          </button>

          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" style={{ display: 'none' }} />
          <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.95rem' }} onClick={() => fileInputRef.current?.click()} title="استيراد نسخة احتياطية JSON">
            <i className="fas fa-upload"></i> استيراد JSON
          </button>

          <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.95rem', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#FCA5A5' }} onClick={onResetDefaults} title="إعادة تعيين المشاريع للافتراضي">
            <i className="fas fa-undo"></i> استعادة الافتراضي
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-value">{projects.length}</div>
            <div className="stat-label">إجمالي المشاريع المكتملة</div>
          </div>
          <div className="stat-icon" style={{ background: 'var(--accent-glow)', color: 'var(--accent)' }}>
            <i className="fas fa-briefcase"></i>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-value">{wpCount}</div>
            <div className="stat-label">مواقع ووردبريس</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(0, 180, 216, 0.15)', color: 'var(--cyan)' }}>
            <i className="fab fa-wordpress"></i>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-value">{aiCount}</div>
            <div className="stat-label">مواقع الذكاء الاصطناعي</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--amber)' }}>
            <i className="fas fa-robot"></i>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-value">{adsCount}</div>
            <div className="stat-label">حملات إعلانات جوجل</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald)' }}>
            <i className="fab fa-google"></i>
          </div>
        </div>
      </div>
    </header>
  );
}
