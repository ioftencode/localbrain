const express = require('express');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '.next/static'), { prefix: '/_next/static' }));

// Health check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve app files
const outDir = path.join(__dirname, 'out');

if (fs.existsSync(outDir)) {
  app.use(express.static(outDir));
}

// Default route handler
app.use((req, res) => {
  const indexPath = path.join(outDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// Get local network IP
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

// Start server
app.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP();
  console.log(`\n╔════════════════════════════════════════╗`);
  console.log(`║  📝 Daily Log - Local PWA Server       ║`);
  console.log(`╚════════════════════════════════════════╝`);
  console.log(`\n🌐 Access at: http://localhost:${PORT}`);
  console.log(`   Network:    http://${localIP}:${PORT}`);
  console.log(`\n✨ Features:`);
  console.log(`   • Works offline after first load`);
  console.log(`   • All data saved locally in browser`);
  console.log(`   • Install as desktop app\n`);
  console.log(`📱 To install on desktop:`);
  console.log(`   1. Open in Chrome/Edge browser`);
  console.log(`   2. Look for 'Install' button in address bar`);
  console.log(`   3. Or Menu → More tools → Create shortcut\n`);
});
