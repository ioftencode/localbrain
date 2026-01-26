const express = require('express');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const PORT = process.env.PORT || process.env.APP_PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const DIST_DIR = path.join(__dirname, '.next/standalone');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve Next.js static files
app.use('/_next/static', express.static(path.join(__dirname, '.next/static')));

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Serve the app - catch-all route for SPA
app.use((req, res) => {
  const filePath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Not found');
  }
});

app.listen(PORT, HOST, () => {
  const localIP = getLocalIP();
  console.log(`\n╔════════════════════════════════════════╗`);
  console.log(`║  Daily Log - Web App Running           ║`);
  console.log(`╚════════════════════════════════════════╝`);
  console.log(`\n📱 Local:   http://localhost:${PORT}`);
  console.log(`🌐 Network: http://${localIP}:${PORT}`);
  console.log(`🌐 Network: http://${localIP}:${PORT}`);
  console.log(`\n💡 To install on desktop:`);
  console.log(`   1. Open http://localhost:${PORT}`);
  console.log(`   2. Click the Install button (address bar)`);
  console.log(`   3. Or use: Settings → Advanced → Create shortcut\n`);
});
