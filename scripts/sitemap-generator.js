const fs = require('fs');
const path = require('path');

const DEFAULT_SITE_DOMAIN = 'https://project-team.site';

const normaliseBaseUrl = (value, fallback) => {
  const source = value || fallback;
  if (!source) {
    throw new Error('Не удалось определить домен сайта для генерации sitemap');
  }

  return source.replace(/\/$/, '');
};

const buildApiUrl = (base, pathname) => {
  const url = new URL(pathname, `${base}/`);
  return url.toString();
};

// Получение всех событий
async function fetchAllEvents(apiBaseUrl) {
  try {
    console.log('🔄 Получение списка всех событий...');
    const response = await fetch(buildApiUrl(apiBaseUrl, '/api/events'));
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ Получено событий: ${Array.isArray(data) ? data.length : (data.events ? data.events.length : 0)}`);
    
    // Адаптируем под разные форматы ответа
    if (Array.isArray(data)) {
      return data;
    } else if (data.events && Array.isArray(data.events)) {
      return data.events;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else {
      console.warn('⚠️ Неожиданный формат данных событий');
      return [];
    }
  } catch (error) {
    console.error('❌ Ошибка при получении событий:', error.message);
    return [];
  }
}

// Получение всех новостей
async function fetchAllNews(apiBaseUrl) {
  try {
    console.log('🔄 Получение списка всех новостей...');
    const response = await fetch(buildApiUrl(apiBaseUrl, '/api/news'));
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ Получено новостей: ${Array.isArray(data) ? data.length : (data.news ? data.news.length : 0)}`);
    
    // Адаптируем под разные форматы ответа
    if (Array.isArray(data)) {
      return data;
    } else if (data.news && Array.isArray(data.news)) {
      return data.news;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else {
      console.warn('⚠️ Неожиданный формат данных новостей');
      return [];
    }
  } catch (error) {
    console.error('❌ Ошибка при получении новостей:', error.message);
    return [];
  }
}

// Генерация sitemap для статических страниц (в формате Victorious)
function generateStaticSitemap(hostname) {
  const now = new Date().toISOString();
  
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Главная страница
  sitemap += `  <url>\n`;
  sitemap += `    <loc>${hostname}/</loc>\n`;
  sitemap += `    <lastmod>${now}</lastmod>\n`;
  sitemap += `    <changefreq>daily</changefreq>\n`;
  sitemap += `    <priority>1.0</priority>\n`;
  sitemap += `  </url>\n`;
  
  // Другие статические страницы
  const staticPages = [
    { path: '/contests', changefreq: 'weekly', priority: '0.8' },
    { path: '/about-us', changefreq: 'monthly', priority: '0.7' },
    { path: '/members', changefreq: 'weekly', priority: '0.6' }
  ];
  
  staticPages.forEach(page => {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${hostname}${page.path}</loc>\n`;
    sitemap += `    <lastmod>${now}</lastmod>\n`;
    sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${page.priority}</priority>\n`;
    sitemap += `  </url>\n`;
  });
  
  sitemap += '</urlset>';
  
  return sitemap;
}

// Генерация sitemap для событий (в формате Victorious)
function generateEventsSitemap(events, hostname) {
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Главная страница событий
  const now = new Date().toISOString();
  sitemap += `  <url>\n`;
  sitemap += `    <loc>${hostname}/contests</loc>\n`;
  sitemap += `    <lastmod>${now}</lastmod>\n`;
  sitemap += `  </url>\n`;
  
  events.forEach(event => {
    if (event.id) {
      const lastmod = event.updated_at || event.created_at || now;
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${hostname}/events/${event.id}</loc>\n`;
      sitemap += `    <lastmod>${new Date(lastmod).toISOString()}</lastmod>\n`;
      sitemap += `  </url>\n`;
    }
  });
  
  sitemap += '</urlset>';
  
  return sitemap;
}

// Генерация sitemap для новостей (в формате Victorious)
function generateNewsSitemap(news, hostname) {
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Главная страница новостей (если есть)
  const now = new Date().toISOString();
  sitemap += `  <url>\n`;
  sitemap += `    <loc>${hostname}/</loc>\n`;
  sitemap += `    <lastmod>${now}</lastmod>\n`;
  sitemap += `  </url>\n`;
  
  news.forEach(article => {
    if (article.id) {
      const lastmod = article.updated_at || article.created_at || now;
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${hostname}/news/${article.id}</loc>\n`;
      sitemap += `    <lastmod>${new Date(lastmod).toISOString()}</lastmod>\n`;
      sitemap += `  </url>\n`;
    }
  });
  
  sitemap += '</urlset>';
  
  return sitemap;
}

function getRuntimeConfig(overrides = {}) {
  const siteDomain = normaliseBaseUrl(
    overrides.siteDomain || process.env.SITE_DOMAIN,
    DEFAULT_SITE_DOMAIN
  );

  const apiBaseUrl = normaliseBaseUrl(
    overrides.apiBaseUrl || process.env.API_BASE_URL || process.env.SITE_API_DOMAIN,
    siteDomain
  );

  return { siteDomain, apiBaseUrl };
}

// Генерация sitemap index (в формате Victorious)
function generateSitemapIndex(hostname) {
  const now = new Date().toISOString();
  
  let sitemapIndex = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemapIndex += '<sitemapindex xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ';
  sitemapIndex += 'xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/siteindex.xsd" ';
  sitemapIndex += 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  sitemapIndex += `<sitemap>\n`;
  sitemapIndex += `  <loc>${hostname}/page-sitemap.xml</loc>\n`;
  sitemapIndex += `  <lastmod>${now}</lastmod>\n`;
  sitemapIndex += `</sitemap>\n`;
  
  sitemapIndex += `<sitemap>\n`;
  sitemapIndex += `  <loc>${hostname}/events-sitemap.xml</loc>\n`;
  sitemapIndex += `  <lastmod>${now}</lastmod>\n`;
  sitemapIndex += `</sitemap>\n`;
  
  sitemapIndex += `<sitemap>\n`;
  sitemapIndex += `  <loc>${hostname}/news-sitemap.xml</loc>\n`;
  sitemapIndex += `  <lastmod>${now}</lastmod>\n`;
  sitemapIndex += `</sitemap>\n`;
  
  sitemapIndex += '</sitemapindex>';
  
  return sitemapIndex;
}

// Основная функция генерации
async function generateSitemap(options = {}) {
  const { siteDomain, apiBaseUrl } = getRuntimeConfig(options);

  console.log('🚀 Начинаем генерацию sitemap в формате Victorious...');
  console.log(`🌐 Домен сайта: ${siteDomain}`);
  console.log(`🔌 API источник: ${apiBaseUrl}`);

  try {
    // Получаем данные
    const events = await fetchAllEvents(apiBaseUrl);
    const news = await fetchAllNews(apiBaseUrl);
    
    // Создаем директорию если её нет
    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Генерируем отдельные sitemap файлы
    const staticSitemap = generateStaticSitemap(siteDomain);
    const eventsSitemap = generateEventsSitemap(events, siteDomain);
    const newsSitemap = generateNewsSitemap(news, siteDomain);
    const sitemapIndex = generateSitemapIndex(siteDomain);
    
    // Сохраняем файлы
    const files = [
      { name: 'sitemap.xml', content: sitemapIndex },
      { name: 'page-sitemap.xml', content: staticSitemap },
      { name: 'events-sitemap.xml', content: eventsSitemap },
      { name: 'news-sitemap.xml', content: newsSitemap }
    ];
    
    files.forEach(file => {
      const outputPath = path.join(publicDir, file.name);
      fs.writeFileSync(outputPath, file.content);
      console.log(`✅ Создан файл: ${file.name}`);
    });
    
    console.log('\n✅ Все sitemap файлы успешно сгенерированы!');
    console.log(`📁 Файлы сохранены в: ${publicDir}`);
    console.log(`🔗 Основной sitemap: ${siteDomain}/sitemap.xml`);
    
    // Статистика
    console.log(`\n📈 Статистика:`);
    console.log(`   📄 Статических страниц: 4 (включая главную)`);
    console.log(`   🔄 Событий: ${events.length}`);
    console.log(`   📰 Новостей: ${news.length}`);
    console.log(`   📂 Всего файлов: ${files.length}`);
    
  } catch (error) {
    console.error('\n❌ Критическая ошибка при генерации sitemap:', error);
    process.exit(1);
  }
}

// Обработка аргументов командной строки
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Использование: node sitemap-generator.js [опции]

Опции:
  --help, -h          Показать помощь
  --domain <url>      Указать домен сайта (например: --domain https://project-team.site)
  --api <url>         Задать базовый URL API для получения событий и новостей

Примеры:
  node sitemap-generator.js
  node sitemap-generator.js --domain https://ваш-сайт.рф
    `);
    process.exit(0);
  }
  
  // Проверяем, передан ли домен через аргументы
  const cliOptions = {};

  const domainIndex = args.indexOf('--domain');
  if (domainIndex !== -1 && args[domainIndex + 1]) {
    cliOptions.siteDomain = args[domainIndex + 1];
  }

  const apiIndex = args.indexOf('--api');
  if (apiIndex !== -1 && args[apiIndex + 1]) {
    cliOptions.apiBaseUrl = args[apiIndex + 1];
  }

  generateSitemap(cliOptions);
}

module.exports = { generateSitemap };
