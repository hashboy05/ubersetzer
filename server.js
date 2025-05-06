const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config();  // Load environment variables

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
};

const server = http.createServer((req, res) => {
  // Extract Session Token from Cookie (if available)
  const cookies = req.headers.cookie ? req.headers.cookie.split(';').map(c => c.trim()).reduce((acc, cookie) => {
      const [key, value] = cookie.split('=').map(decodeURIComponent);
      acc[key] = value;
      return acc;
  }, {}) : {};
  const sessionToken = cookies.sessionToken;

  // Redirect root URL based on sessionToken presence
  if (req.url === '/') {
    if (sessionToken) {
      // Existing user with sessionToken -> redirect to main_menu.html
      res.writeHead(302, { 'Location': '/main_menu.html' });
      res.end();
      return;
    } else {
      // New user or no sessionToken -> redirect to login.html
      res.writeHead(302, { 'Location': '/login.html' });
      res.end();
      return;
    }
  }

  // Protected Route Check for main_menu.html
  if (req.url === '/main_menu.html' && !sessionToken) {
    res.writeHead(302, { 'Location': '/login.html' });
    res.end();
    return;
  }

  // Serve static files (very basic)
  let filePath = './public' + req.url;
  let extname = path.extname(filePath);

  fs.readFile(filePath, function(error, content) {
    if (error) {
      res.writeHead(404);
      res.end('Not Found');
    } else {
      let contentType = 'text/html';
      if (extname === '.js') contentType = 'application/javascript';
      else if (extname === '.css') contentType = 'text/css';

      // For login.html, inject Firebase config (simple string replacement)
      if (req.url === '/login.html' || req.url === '/signup.html' || req.url === '/main_menu.html' || req.url === '/settings.html' || req.url === '/history.html') {
          let configString = JSON.stringify(firebaseConfig);
          content = content.toString().replace(
              'const firebaseConfig = __FIREBASE_CONFIG__;',
              `const firebaseConfig = ${configString};`
          );
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(8080, () => {
  console.log('Server running on port 8080');
});
