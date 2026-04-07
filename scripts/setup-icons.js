import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const src = path.join(
  os.homedir(),
  '.gemini/antigravity/brain/6b0154a2-5437-4f3e-9b86-26665c48a6f4/pneumoscan_icon_1775523761797.png'
);

const publicDir = path.join(__dirname, '..', 'public');

if (!fs.existsSync(src)) {
  console.error('❌ Icon file not found at:', src);
  process.exit(1);
}

fs.copyFileSync(src, path.join(publicDir, 'logo192.png'));
fs.copyFileSync(src, path.join(publicDir, 'logo512.png'));
fs.copyFileSync(src, path.join(publicDir, 'favicon.png'));

console.log('✅ Lung heartbeat icon placed in public/ as:');
console.log('   - favicon.png  (browser tab icon)');
console.log('   - logo192.png  (Apple touch icon)');
console.log('   - logo512.png  (PWA / manifest icon)');
