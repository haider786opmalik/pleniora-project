const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;
const wwwDir = path.join(rootDir, 'www');

console.log('Building offline mobile app web bundle...');

if (!fs.existsSync(wwwDir)) {
  fs.mkdirSync(wwwDir, { recursive: true });
}

// Helper: Copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy assets
console.log('Copying css, js, icons...');
copyDir(path.join(rootDir, 'css'), path.join(wwwDir, 'css'));
copyDir(path.join(rootDir, 'js'), path.join(wwwDir, 'js'));
copyDir(path.join(rootDir, 'icons'), path.join(wwwDir, 'icons'));

// Copy standalone html/manifests
const singleFiles = [
  'starter-guide.html',
  'manifest.webmanifest',
  'offline.webmanifest',
  'service-worker.js'
];
for (const file of singleFiles) {
  const p = path.join(rootDir, file);
  if (fs.existsSync(p)) {
    fs.copyFileSync(p, path.join(wwwDir, file));
  }
}

// Build www/index.html from app.html
let appHtml = fs.readFileSync(path.join(rootDir, 'app.html'), 'utf8');

// Ensure mobile flag and relative paths
if (!appHtml.includes('window.IS_MOBILE_APP')) {
  appHtml = appHtml.replace(
    '<head>',
    '<head>\n<script>window.IS_MOBILE_APP=true;window.RIDA_OFFLINE_MODE=true;</script>'
  );
}

// Write to www/index.html and www/app.html
fs.writeFileSync(path.join(wwwDir, 'index.html'), appHtml, 'utf8');
fs.writeFileSync(path.join(wwwDir, 'app.html'), appHtml, 'utf8');

console.log('Mobile web bundle successfully generated in www/');

// Run Capacitor Sync to update Android and iOS native projects
try {
  console.log('Syncing Capacitor android and ios platforms...');
  const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  execSync(`${npx} cap sync`, { stdio: 'inherit', cwd: rootDir });
  console.log('Capacitor sync complete!');
} catch (e) {
  console.error('Capacitor sync error:', e.message);
  process.exitCode = 1;
}
