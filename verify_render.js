const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = 8099;
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  
  const filePath = path.join(__dirname, reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    console.log(`404 Not Found: ${req.url} -> ${filePath}`);
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--hide-scrollbars']
  });

  const urls = [
    { name: 'remote', url: 'https://greg-hahn.github.io/imperial-brady-design-system/ui_kits/microsite/index.html' },
    { name: 'local_root', url: `http://localhost:${PORT}/index.html` },
    { name: 'local_nested', url: `http://localhost:${PORT}/ui_kits/microsite/index.html` }
  ];

  for (const { name, url } of urls) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });

    const errors = [];
    page.on('console', msg => console.log(`[${name} console]`, msg.type(), msg.text()));
    page.on('pageerror', err => {
      console.log(`[${name} ERROR]`, err.message);
      errors.push(err.message);
    });
    page.on('requestfailed', req => {
      console.log(`[${name} FAILED REQ]`, req.url(), req.failure()?.errorText);
    });

    console.log(`Loading ${url} ...`);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1000));

    const shotPath = path.join(__dirname, 'test_screenshots', `${name}_full.png`);
    await page.screenshot({ path: shotPath, fullPage: true });
    console.log(`Saved screenshot: ${shotPath}`);

    await page.close();
  }

  await browser.close();
  server.close();
  console.log('Done test verification.');
});
