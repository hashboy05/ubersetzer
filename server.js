const http = require('http');
const fs = require('fs');
const path = require('path');
const translator = require('@vitalets/google-translate-api');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/translate') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const result = await translator.translate(data.text, {
          from: data.source_lang === 'auto' ? 'auto' : data.source_lang,
          to: data.target_lang
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ translation: result.text, status: 'success' }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message, status: 'error' }));
      }
    });
  } else {
    // Serve static files (very basic)
    let filePath = './public' + (req.url === '/' ? '/login.html' : req.url);
    let extname = path.extname(filePath);
    fs.readFile(filePath, function(error, content) {
      if (error) {
        res.writeHead(404);
        res.end('Not Found');
      } else {
        let contentType = 'text/html';
        if (extname === '.js') contentType = 'application/javascript';
        else if (extname === '.css') contentType = 'text/css';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  }
});

server.listen(8080, () => {
  console.log('Server running on port 8080');
});
