import React from 'react';
import { INITIAL_SERVICES } from '../data/initialData';

export default function ServiceTabs({ activeTab, setActiveTab, projects }) {
  return (
    <nav className="tabs-header">
      <div className="tabs-nav">
        {INITIAL_SERVICES.map((service) => {
          const count = projects.filter(p => p.serviceId === service.id).length;
          const isActive = activeTab === service.id;
          return (
            <button
              key={service.id}
              className={`tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(service.id)}
            >
              <i className={`fab ${service.icon} fas ${service.icon}`}></i>
              <span>{service.name}</span>
              <span className="tab-badge">{count}</span>
            </button>
          );
        })}

        <button
          className={`tab-btn ${activeTab === 'publish' ? 'active' : ''}`}
          style={activeTab === 'publish' ? {} : { border: '1px dashed var(--accent)', color: 'var(--accent)' }}
          onClick={() => setActiveTab('publish')}
        >
          <i className="fas fa-rocket"></i>
          <span>لوحة النشر والتصدير (HTML)</span>
        </button>
      </div>
    </nav>
  );
}
