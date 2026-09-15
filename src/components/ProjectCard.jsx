import React from 'react';

export default function ProjectCard({ project, onEdit, onDelete, onCopyCardHtml }) {
  let domainDisplay = 'https://site.com';
  try { domainDisplay = new URL(project.url).hostname; } catch(e) {}

  return (
    <div className="portfolio-card">
      <div className="browser-mockup-header">
        <div className="browser-mockup-dots">
          <span className="browser-mockup-dot" style={{ background: '#EF4444' }}></span>
          <span className="browser-mockup-dot" style={{ background: '#F59E0B' }}></span>
          <span className="browser-mockup-dot" style={{ background: '#10B981' }}></span>
        </div>
        <div className="browser-mockup-url">{domainDisplay}</div>
      </div>
      <div className="portfolio-image-wrapper">
        <img
          src={project.image || 'https://via.placeholder.com/800x500/1A1A2E/E94560?text=Mahyoub+Portfolio'}
          alt={project.title}
          className="portfolio-img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop';
          }}
        />
        <span className="sector-badge">
          <i className="fas fa-layer-group"></i> {project.sector || 'عام'}
        </span>
      </div>

      <div className="portfolio-content">
        <h3 className="portfolio-title">{project.title}</h3>
        <p className="portfolio-desc">{project.description}</p>

        <div className="portfolio-result">
          <i className="fas fa-chart-line"></i>
          <span>{project.result}</span>
        </div>

        <div className="portfolio-card-actions">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="btn-visit"
            >
              زيارة الموقع <i className="fas fa-arrow-left" style={{ fontSize: '0.85rem' }}></i>
            </a>
          )}

          <div style={{ display: 'flex', gap: '0.4rem', marginRight: 'auto' }}>
            <button
              className="action-icon-btn"
              onClick={() => onCopyCardHtml(project)}
              title="نسخ كود HTML للبطاقة"
            >
              <i className="fas fa-code"></i>
            </button>

            <button
              className="action-icon-btn"
              onClick={() => onEdit(project)}
              title="تعديل بيانات المشروع"
            >
              <i className="fas fa-pen"></i>
            </button>

            <button
              className="action-icon-btn"
              style={{ color: '#FCA5A5' }}
              onClick={() => onDelete(project.id)}
              title="حذف المشروع"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
