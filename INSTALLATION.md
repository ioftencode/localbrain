# Daily Log - Desktop Installation Guide

## 🚀 Your PWA is Ready!

The Local PWA Server is now running at **http://localhost:3000**

---

## 📱 **Option 1: Install as Desktop App (Chrome/Edge)**

### Step 1: Open in Browser
```
1. Open Chrome, Edge, or Brave browser
2. Go to: http://localhost:3000
3. Wait for the app to fully load
```

### Step 2: Install the App

**Chrome/Chromium:**
- Look for the **Install button** in the address bar (looks like ⬇️ icon)
- Click it and select "Install"
- Or: Menu (⋮) → More tools → **Create shortcut**
- Check "Open as window"

**Microsoft Edge:**
- Click the **Install button** in the address bar
- Or: Settings (⋮) → Apps → **Install this site as an app**

**Firefox:**
- Menu (≡) → More → **Install Daily Log**

### Step 3: Launch
- The app will appear on your Desktop as **"Daily Log"**
- Click to launch it like a regular desktop app
- It runs offline after first load!

---

## 🖥️ **Option 2: Command-Line Installation**

### Start the Server Automatically

**Windows - Create a Batch File:**

Create `start-daily-log.bat` in your project folder:

```batch
@echo off
cd /d "%~dp0"
echo Starting Daily Log server...
echo.
echo Opening http://localhost:3000 in your browser...
timeout /t 2
start http://localhost:3000
node local-server.js
pause
```

Double-click the batch file to start!

**Windows - Create PowerShell Shortcut:**

Create `start-daily-log.ps1`:

```powershell
Push-Location $PSScriptRoot
Write-Host "Starting Daily Log..."
Start-Process "http://localhost:3000"
node local-server.js
```

---

## 💾 **Data Storage**

All your data is saved **locally** in your browser's IndexedDB:
- ✅ No cloud sync
- ✅ No data loss (even if you close the browser)
- ✅ Complete privacy
- ✅ Works offline

---

## 📊 **Backup & Restore**

### Export Your Data
```javascript
// In browser console:
await StorageService.exportAllData()
// Download starts automatically
```

### Restore from Backup
```javascript
// Use the Import function in the app
// Or paste backup file to reimport
```

---

## 🔧 **Server Commands**

**Start Server:**
```bash
npm run build       # Build the app
node local-server.js  # Start server at localhost:3000
```

**Development Mode:**
```bash
npm run dev        # Auto-reload during development
```

**Stop Server:**
```
Press Ctrl+C in terminal
```

---

## 🌍 **Network Access**

After starting, you can access from any device on your network:

- **Local Machine:** http://localhost:3000
- **Other Computers:** http://192.168.x.x:3000 (IP shown when server starts)
- **Mobile:** Open the network URL in your phone's browser

---

## ✨ **Features**

✅ **Progressive Web App (PWA)**
✅ **Offline Support**
✅ **Desktop Installation**
✅ **Local-First Data Storage**
✅ **Auto-Save (1.5s debounce)**
✅ **Keyboard Shortcuts (⌘+N for new task)**
✅ **Calendar Navigation**
✅ **Task Categories with Colors**
✅ **Daily Notes**
✅ **Task Management**

---

## 🐛 **Troubleshooting**

**Issue: Port 3000 already in use**
```bash
# Use a different port
PORT=3001 node local-server.js
```

**Issue: App won't install**
- Make sure you're using Chrome, Edge, or Brave
- Refresh the page completely
- Clear browser cache if needed

**Issue: Data not saving**
- Check browser's IndexedDB is enabled
- Open DevTools → Application → IndexedDB → DailyLogDB
- Verify you're not in Incognito mode

**Issue: Offline not working**
- Load the app at least once online
- Service Worker needs to cache files first
- Wait 30 seconds after first load

---

## 📋 **Project Structure**

```
my-daily-log/
├── local-server.js          # Start the server
├── public/
│   ├── manifest.json        # PWA manifest
│   └── icons/              # App icons
├── src/
│   ├── app/                # Next.js app
│   ├── components/         # React components
│   ├── lib/
│   │   ├── database/       # Dexie IndexedDB
│   │   ├── hooks/          # Custom hooks
│   │   └── services/       # Storage service
│   └── types/              # TypeScript types
└── .next/                  # Build output
```

---

## 🎯 **Keyboard Shortcuts**

| Shortcut | Action |
|----------|--------|
| `⌘+N` / `Ctrl+N` | New Task |
| `←` Arrow Key | Previous Day |
| `→` Arrow Key | Next Day |
| `⌘+S` / `Ctrl+S` | Save Note |

---

## 📞 **Need Help?**

1. Check browser console for errors (F12)
2. Verify server is running (check terminal output)
3. Try clearing browser cache
4. Restart the server

---

**Enjoy your offline-first Daily Log! 📝✨**
