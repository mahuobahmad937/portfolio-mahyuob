/**
 * Screenshot Utility for fetching website previews automatically
 * Optimized with custom viewport width (1200px) to prevent side whitespace margins!
 */

export async function fetchWebsiteScreenshot(websiteUrl, onStatusUpdate = () => {}) {
  if (!websiteUrl) {
    throw new Error('يرجى إدخال رابط موقع صالح');
  }

  // Ensure protocol exists
  let formattedUrl = websiteUrl.trim();
  if (!/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = 'https://' + formattedUrl;
  }

  onStatusUpdate('جاري التقاط واجهة الموقع بدون حواف جانبية...');

  // Strategy 1: Microlink API with 1200px custom viewport width to eliminate side white bars
  try {
    const microlinkApiUrl = `https://api.microlink.io/?url=${encodeURIComponent(formattedUrl)}&screenshot=true&viewport.width=1200&viewport.height=800&viewport.deviceScaleFactor=1`;
    const response = await fetch(microlinkApiUrl, { method: 'GET' });
    if (response.ok) {
      const data = await response.json();
      if (data.status === 'success' && data.data?.screenshot?.url) {
        return {
          url: data.data.screenshot.url,
          formattedUrl,
          provider: 'Microlink Chrome API'
        };
      }
    }
  } catch (err) {
    console.warn('Microlink API attempt failed, trying WordPress Mshots...', err);
  }

  // Strategy 2: WordPress mshots with 1024x768 tight viewport
  onStatusUpdate('جاري توليد الواجهة عبر محرك WordPress...');
  const wpMshotsUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(formattedUrl)}?w=1024&h=768`;
  
  try {
    const triggerImg = new Image();
    triggerImg.src = wpMshotsUrl;
  } catch (e) {}

  await new Promise(resolve => setTimeout(resolve, 3000));
  const freshWpUrl = `${wpMshotsUrl}&v=${Date.now()}`;

  return {
    url: freshWpUrl,
    formattedUrl,
    provider: 'WordPress mshots'
  };
}

/**
 * Creates a beautiful dark-mode SVG placeholder with site name if live API is blocked
 */
export function createStyledPlaceholderSvg(domainName) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1A1A2E" />
          <stop offset="50%" stop-color="#16213E" />
          <stop offset="100%" stop-color="#0F3460" />
        </linearGradient>
        <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#E94560" />
          <stop offset="100%" stop-color="#FF6B81" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="10" stdDeviation="15" flood-color="#000" flood-opacity="0.5"/>
        </filter>
      </defs>
      
      <rect width="800" height="500" fill="url(#bg)" />
      
      <g stroke="#ffffff" stroke-opacity="0.04" stroke-width="1">
        <line x1="0" y1="100" x2="800" y2="100"/>
        <line x1="0" y1="200" x2="800" y2="200"/>
        <line x1="0" y1="300" x2="800" y2="300"/>
        <line x1="0" y1="400" x2="800" y2="400"/>
        <line x1="200" y1="0" x2="200" y2="500"/>
        <line x1="400" y1="0" x2="400" y2="500"/>
        <line x1="600" y1="0" x2="600" y2="500"/>
      </g>
      
      <rect x="80" y="80" width="640" height="340" rx="12" fill="#16213E" filter="url(#shadow)" stroke="#2A2A4A" stroke-width="2" />
      <rect x="80" y="80" width="640" height="40" rx="12" fill="#1A1A2E" />
      
      <circle cx="110" cy="100" r="5" fill="#E94560" />
      <circle cx="126" cy="100" r="5" fill="#F59E0B" />
      <circle cx="142" cy="100" r="5" fill="#10B981" />
      
      <rect x="170" y="90" width="460" height="20" rx="6" fill="#0F3460" opacity="0.8"/>
      <text x="400" y="104" font-family="sans-serif" font-size="11" fill="#94A3B8" text-anchor="middle">https://${domainName}</text>
      
      <circle cx="400" cy="230" r="45" fill="url(#accent)" opacity="0.15" />
      <path d="M380 230 L420 230 M400 210 L400 250" stroke="#E94560" stroke-width="3" stroke-linecap="round" />
      
      <text x="400" y="310" font-family="'Zain', sans-serif" font-weight="bold" font-size="28" fill="#FFFFFF" text-anchor="middle">${domainName}</text>
      <text x="400" y="340" font-family="'Zain', sans-serif" font-size="18" fill="#E94560" text-anchor="middle">معاينة التوثيق الرقمي — مهيوب</text>
    </svg>
  `;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
