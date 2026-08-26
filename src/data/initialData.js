export const INITIAL_SERVICES = [
  { id: 'wordpress', name: 'مواقع ووردبريس', icon: 'fa-wordpress', description: 'تطوير مواقع وتطبيقات ووردبريس مخصصة، سريعة وآمنة' },
  { id: 'ai', name: 'مواقع الذكاء الاصطناعي', icon: 'fa-robot', description: 'بناء مواقع ذكية مدعومة بشات بوت تفاعلي وأتمتة الـ AI' },
  { id: 'google-ads', name: 'إعلانات جوجل', icon: 'fa-google', description: 'إدارة حملات Google Ads بعائد استثمار استثنائي (ROAS)' }
];

export const SECTORS_LIST = [
  'موقع تعريفي',
  'موقع إعلاني / صفحة هبوط',
  'التجارة الإلكترونية',
  'العقارات والاستثمار',
  'الأغذية والمشروبات',
  'الصحة والجمال',
  'التعليم والتدريب',
  'الخدمات الاستشارية والقانونية',
  'التقنية والحلول البرمجية',
  'السياحة والسفر',
  'السيارات والخدمات اللوجستية',
  'حلي ومجوهرات'
];

export const INITIAL_PROJECTS = [
  // 1. مواقع ووردبريس (WordPress Projects)
  {
    id: 'wp-1',
    serviceId: 'wordpress',
    title: 'متجر أصالة للقهوة والمختصة',
    sector: 'التجارة الإلكترونية',
    url: 'https://asala-coffee.com',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop',
    description: 'تطوير متجر ووردبريس مخصص بالكامل مع متجر WooCommerce، نظام تحسين سرعة وسلات متروكة.',
    result: '+340% زيادات في المبيعات الشهرية',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'wp-2',
    serviceId: 'wordpress',
    title: 'منصة أبعاد العقارية',
    sector: 'العقارات والاستثمار',
    url: 'https://abaad-realestate.com',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
    description: 'موقع ووردبريس تعريفي مع محرك بحث مخصص للممتلكات وتكامل مع خرائط جوجل والواتساب.',
    result: 'سرعة التحميل 99/100 على Mobile',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'wp-3',
    serviceId: 'wordpress',
    title: 'أكاديمية طموح للتدريب القيادي',
    sector: 'التعليم والتدريب',
    url: 'https://tomoh-academy.org',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
    description: 'بناء بوابة تعليمية متكاملة بـ LearnDash ونظام شهادات آلي ودفع إلكتروني سلس.',
    result: 'انضمام 4,200+ طالب خلال أول شهرين',
    updatedAt: new Date().toISOString()
  },

  // 2. مواقع الذكاء الاصطناعي (AI Projects)
  {
    id: 'ai-1',
    serviceId: 'ai',
    title: 'مساعد سياحي ذكي Smart Travel',
    sector: 'السياحة والسفر',
    url: 'https://smart-travel-ai.com',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop',
    description: 'منصة تخطيط رحلات مخصصة مدعومة بالـ GPT-4 لتوليد برامج سياحية شخصية خلال 5 ثوانٍ.',
    result: 'تخفيض تكلفة دعم العملاء بنسبة 70%',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ai-2',
    serviceId: 'ai',
    title: 'شات بوت عيادات الشفاء الذكي',
    sector: 'الصحة والجمال',
    url: 'https://shifa-clinic-ai.com',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
    description: 'موقع طبي تفاعلي مزود بمساعد ذكي لحجز المواعيد وتحليل استفسارات المرضى الأولية تلقائياً.',
    result: 'حجز 850+ موعد آلياً شهرياً',
    updatedAt: new Date().toISOString()
  },

  // 3. إعلانات جوجل (Google Ads Projects)
  {
    id: 'ga-1',
    serviceId: 'google-ads',
    title: 'حملة إعلانات Google Search لمكتب الاستشارات',
    sector: 'الخدمات الاستشارية والقانونية',
    url: 'https://alroya-legal.com',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    description: 'استراتيجية إعادة استهداف وحملات كلمات مفتاحية فائقة الدقة لزيادة عملاء الاستشارات.',
    result: 'عائد استثمار إعلاني ROAS 5.4x',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ga-2',
    serviceId: 'google-ads',
    title: 'حملة Google Shopping لمتجر العطور الفاخرة',
    sector: 'حلي ومجوهرات',
    url: 'https://lux-perfumes.com',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop',
    description: 'إدارة حملات تسوق PMax وتخصيص الميزانيات التكيفي للحصول على أعلى معدل تحويل.',
    result: '+180,000\$ مبيعات في البلاك فرايدي',
    updatedAt: new Date().toISOString()
  }
];
