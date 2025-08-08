const fs = require('fs');
const path = require('path');

// Получение всех событий
async function fetchAllEvents() {
  try {
    console.log('🔄 Получение списка всех событий...');
    const response = await fetch('http://gstouteam.dpdns.org:5555/api/events');
    
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
async function fetchAllNews() {
  try {
    console.log('🔄 Получение списка всех новостей...');
    const response = await fetch('http://gstouteam.dpdns.org:5555/api/news');
    
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

// Генерация sitemap для статических страниц
function generateStaticSitemap(hostname) {
  const staticRoutes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/contests', priority: '0.8', changefreq: 'weekly' },
    { path: '/about-us', priority: '0.7', changefreq: 'monthly' },
    { path: '/members', priority: '0.6', changefreq: 'weekly' }
  ];

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<?xml-stylesheet type="text/xsl" href="' + hostname + '/sitemaps_xsl.xsl"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  staticRoutes.forEach(route => {
    const urlPath = route.path === '/' ? '' : route.path;
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${hostname}${urlPath}</loc>\n`;
    sitemap += `    <changefreq>${route.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${route.priority}</priority>\n`;
    sitemap += `  </url>\n`;
  });
  
  sitemap += '</urlset>';
  
  return sitemap;
}

// Генерация sitemap для событий
function generateEventsSitemap(events, hostname) {
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<?xml-stylesheet type="text/xsl" href="' + hostname + '/sitemaps_xsl.xsl"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  events.forEach(event => {
    if (event.id) {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${hostname}/events/${event.id}</loc>\n`;
      sitemap += `    <changefreq>weekly</changefreq>\n`;
      sitemap += `    <priority>0.8</priority>\n`;
      sitemap += `  </url>\n`;
    }
  });
  
  sitemap += '</urlset>';
  
  return sitemap;
}

// Генерация sitemap для новостей
function generateNewsSitemap(news, hostname) {
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<?xml-stylesheet type="text/xsl" href="' + hostname + '/sitemaps_xsl.xsl"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  news.forEach(article => {
    if (article.id) {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${hostname}/news/${article.id}</loc>\n`;
      sitemap += `    <changefreq>weekly</changefreq>\n`;
      sitemap += `    <priority>0.7</priority>\n`;
      sitemap += `  </url>\n`;
    }
  });
  
  sitemap += '</urlset>';
  
  return sitemap;
}

// Генерация sitemap index
function generateSitemapIndex(hostname) {
  const now = new Date().toISOString();
  
  let sitemapIndex = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemapIndex += '<?xml-stylesheet type="text/xsl" href="' + hostname + '/sitemaps_xsl.xsl"?>\n';
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
async function generateSitemap() {
  const hostname = 'http://gstouteam.dpdns.org'; // ЗАМЕНИТЕ НА ВАШ РЕАЛЬНЫЙ ДОМЕН
  
  console.log('🚀 Начинаем генерацию sitemap в формате Victorious...');
  console.log(`🌐 Домен: ${hostname}`);
  
  try {
    // Получаем данные
    const events = await fetchAllEvents();
    const news = await fetchAllNews();
    
    // Создаем директорию если её нет
    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Генерируем отдельные sitemap файлы
    const staticSitemap = generateStaticSitemap(hostname);
    const eventsSitemap = generateEventsSitemap(events, hostname);
    const newsSitemap = generateNewsSitemap(news, hostname);
    const sitemapIndex = generateSitemapIndex(hostname);
    
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
    console.log(`🔗 Основной sitemap: ${hostname}/sitemap.xml`);
    
    // Статистика
    console.log(`\n📈 Статистика:`);
    console.log(`   📄 Статических страниц: 4`);
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
  --help, -h    Показать помощь
  --domain      Указать домен (например: --domain http://mysite.ru)

Примеры:
  node sitemap-generator.js
  node sitemap-generator.js --domain https://ваш-сайт.рф
    `);
    process.exit(0);
  }
  
  // Проверяем, передан ли домен через аргументы
  const domainIndex = args.indexOf('--domain');
  if (domainIndex !== -1 && args[domainIndex + 1]) {
    process.env.SITE_DOMAIN = args[domainIndex + 1];
  }
  
  generateSitemap();
}

module.exports = { generateSitemap };