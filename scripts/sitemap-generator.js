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

// Статические маршруты из вашего приложения
const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/contests', priority: '0.8', changefreq: 'weekly' },
  { path: '/about-us', priority: '0.7', changefreq: 'monthly' },
  { path: '/members', priority: '0.6', changefreq: 'weekly' }
];

// Генерация динамических маршрутов
async function generateDynamicRoutes() {
  console.log('🔄 Начинаем получение динамических данных...');
  
  try {
    // Получаем события
    const events = await fetchAllEvents();
    const eventRoutes = events
      .filter(event => event.id) // Фильтруем события с ID
      .map(event => ({
        path: `/events/${event.id}`,
        priority: '0.8',
        changefreq: 'weekly'
      }));

    // Получаем новости
    const news = await fetchAllNews();
    const newsRoutes = news
      .filter(article => article.id) // Фильтруем новости с ID
      .map(article => ({
        path: `/news/${article.id}`,
        priority: '0.7',
        changefreq: 'weekly'
      }));

    console.log(`📊 Сформировано маршрутов для событий: ${eventRoutes.length}`);
    console.log(`📊 Сформировано маршрутов для новостей: ${newsRoutes.length}`);

    return [...eventRoutes, ...newsRoutes];
  } catch (error) {
    console.error('❌ Ошибка при формировании динамических маршрутов:', error);
    return [];
  }
}

// Генерация sitemap
async function generateSitemap() {
  const hostname = 'http://gstouteam.dpdns.org';
  
  console.log('🚀 Начинаем генерацию sitemap...');
  console.log(`🌐 Домен: ${hostname}`);
  
  try {
    // Получаем динамические маршруты
    const dynamicRoutes = await generateDynamicRoutes();
    
    // Объединяем все маршруты
    const allRoutes = [...staticRoutes, ...dynamicRoutes];
    
    // Создаем XML
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    allRoutes.forEach((route, index) => {
      const urlPath = route.path === '/' ? '' : route.path;
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${hostname}${urlPath}</loc>\n`;
      sitemap += `    <changefreq>${route.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${route.priority}</priority>\n`;
      sitemap += `  </url>\n`;
      
      // Прогресс каждые 20 элементов
      if ((index + 1) % 20 === 0 || index === allRoutes.length - 1) {
        console.log(`📈 Обработано: ${index + 1}/${allRoutes.length} страниц`);
      }
    });
    
    sitemap += '</urlset>';
    
    // Создаем директорию если её нет
    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Сохраняем файл
    const outputPath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(outputPath, sitemap);
    
    console.log('\n✅ Sitemap успешно сгенерирован!');
    console.log(`📁 Путь: ${outputPath}`);
    console.log(`🔗 URL: ${hostname}/sitemap.xml`);
    console.log(`📊 Всего страниц: ${allRoutes.length}`);
    
    // Детальная статистика
    const staticCount = staticRoutes.length;
    const dynamicCount = dynamicRoutes.length;
    console.log(`\n📈 Статистика:`);
    console.log(`   📄 Статических страниц: ${staticCount}`);
    console.log(`   🔄 Динамических страниц: ${dynamicCount}`);
    console.log(`   🌐 Общее количество: ${allRoutes.length}`);
    
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
  --verbose     Подробный вывод
  --domain      Указать домен (например: --domain http://mysite.ru)

Примеры:
  node sitemap-generator.js
  node sitemap-generator.js --domain http://mysite.ru
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