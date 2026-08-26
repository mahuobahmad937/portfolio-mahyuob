import React, { useState, useEffect } from 'react';
import { INITIAL_SERVICES, SECTORS_LIST } from '../data/initialData';
import { fetchWebsiteScreenshot } from '../utils/screenshot';

export default function ProjectFormModal({ project, initialServiceId, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    sector: SECTORS_LIST[0],
    result: '',
    image: '',
    serviceId: initialServiceId || 'wordpress'
  });

  const [isFetchingScreenshot, setIsFetchingScreenshot] = useState(false);
  const [screenshotStatus, setScreenshotStatus] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        url: project.url || '',
        sector: project.sector || SECTORS_LIST[0],
        result: project.result || '',
        image: project.image || '',
        serviceId: project.serviceId || initialServiceId || 'wordpress'
      });
    } else {
      setFormData(prev => ({
        ...prev,
        serviceId: initialServiceId || 'wordpress'
      }));
    }
  }, [project, initialServiceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFetchScreenshot = async () => {
    if (!formData.url) {
      alert('يرجى إدخال رابط الموقع أولاً لسحب لقطة الشاشة');
      return;
    }
    setIsFetchingScreenshot(true);
    setScreenshotStatus('جاري الاتصال بمحرك التقاط الصور تلقائياً...');

    try {
      const result = await fetchWebsiteScreenshot(formData.url, (msg) => setScreenshotStatus(msg));
      setFormData(prev => ({
        ...prev,
        image: result.url,
        url: result.formattedUrl || prev.url
      }));
      setScreenshotStatus(`تم سحب واجهة الموقع بنجاح (${result.provider})`);
    } catch (err) {
      setScreenshotStatus('تعذر التقاط الشاشة المباشرة، يرجى رفع صورة يدوياً أو اختيار صورة جاهزة');
    } finally {
      setIsFetchingScreenshot(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميجابايت');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
        setScreenshotStatus('تم رفع الصورة يدوياً بنجاح');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('يرجى إدخال اسم المشروع');
      return;
    }
    if (!formData.description.trim()) {
      alert('يرجى إدخال وصف قصير للمشروع');
      return;
    }
    if (!formData.result.trim()) {
      alert('يرجى إدخال النتيجة المحققة (مثال: +200% زيادة المبيعات)');
      return;
    }

    onSave({
      ...formData,
      id: project ? project.id : `proj-${Date.now()}`,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            <i className={project ? "fas fa-edit" : "fas fa-plus-circle"} style={{ color: 'var(--accent)' }}></i>
            <span>{project ? 'تعديل بيانات المشروع' : 'إضافة مشروع جديد للمعرض'}</span>
          </h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* الخدمة */}
          <div className="form-group">
            <label className="form-label"><i className="fas fa-list-ul"></i> الخدمة التابعة لها</label>
            <select
              name="serviceId"
              className="form-select"
              value={formData.serviceId}
              onChange={handleChange}
            >
              {INITIAL_SERVICES.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* رابط الموقع + زر سحب لقطة الشاشة */}
          <div className="form-group">
            <label className="form-label"><i className="fas fa-globe"></i> رابط الموقع الالكترونى</label>
            <div className="screenshot-fetch-row">
              <input
                type="text"
                name="url"
                className="form-input"
                placeholder="https://example.com"
                value={formData.url}
                onChange={handleChange}
              />
              <button
                type="button"
                className="btn-fetch-screenshot"
                onClick={handleFetchScreenshot}
                disabled={isFetchingScreenshot}
              >
                {isFetchingScreenshot ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> جاري السحب...
                  </>
                ) : (
                  <>
                    <i className="fas fa-camera"></i> سحب اللقطة تلقائياً
                  </>
                )}
              </button>
            </div>
            {screenshotStatus && (
              <small style={{ color: screenshotStatus.includes('بنجاح') ? '#34D399' : '#FCA5A5', fontSize: '0.9rem' }}>
                {screenshotStatus}
              </small>
            )}
          </div>

          {/* رفع صورة يدوياً أو رابط الصورة */}
          <div className="form-group">
            <label className="form-label"><i className="fas fa-image"></i> صورة المعاينة</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                name="image"
                className="form-input"
                placeholder="رابط الصورة المباشر أو اسحب عبر API أعلاه"
                value={formData.image}
                onChange={handleChange}
              />
              <label className="btn-secondary" style={{ padding: '0.7rem 1rem', fontSize: '0.95rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <i className="fas fa-upload"></i> رفع ملف
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
            </div>

            {formData.image && (
              <div className="image-preview-box">
                <img src={formData.image} alt="المعاينة" />
              </div>
            )}
          </div>

          {/* اسم المشروع */}
          <div className="form-group">
            <label className="form-label"><i className="fas fa-heading"></i> اسم المشروع</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="مثال: متجر أصالة للقهوة والمختصة"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* القطاع */}
          <div className="form-group">
            <label className="form-label"><i className="fas fa-layer-group"></i> القطاع / المجال</label>
            <select
              name="sector"
              className="form-select"
              value={formData.sector}
              onChange={handleChange}
            >
              {SECTORS_LIST.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          {/* النتيجة المحققة */}
          <div className="form-group">
            <label className="form-label"><i className="fas fa-trophy"></i> النتيجة المحققة (Key Result Metric)</label>
            <input
              type="text"
              name="result"
              className="form-input"
              placeholder="مثال: +340% زيادات في المبيعات الشهرية"
              value={formData.result}
              onChange={handleChange}
              required
            />
          </div>

          {/* وصف قصير */}
          <div className="form-group">
            <label className="form-label"><i className="fas fa-align-right"></i> وصف قصير للمشروع</label>
            <textarea
              name="description"
              className="form-textarea"
              rows={3}
              placeholder="اشرح في سطرين ما تم إنجازه في هذا المشروع وكيف ساعد العملاء..."
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              إلغاء
            </button>
            <button type="submit" className="btn-primary">
              <i className="fas fa-save"></i> {project ? 'حفظ التعديلات' : 'إضافة المشروع'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
