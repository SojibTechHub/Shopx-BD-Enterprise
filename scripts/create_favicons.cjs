const fs = require('fs');
const path = require('path');

// Minimal valid 16x16 ICO file buffer
const icoHeader = Buffer.from([
  0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
  0x10, 0x10, 0x00, 0x00, 0x01, 0x00, 0x20, 0x00,
  0x68, 0x04, 0x00, 0x00,
  0x16, 0x00, 0x00, 0x00
]);

const bmpHeader = Buffer.alloc(40);
bmpHeader.writeUInt32LE(40, 0);
bmpHeader.writeInt32LE(16, 4);
bmpHeader.writeInt32LE(32, 8);
bmpHeader.writeUInt16LE(1, 12);
bmpHeader.writeUInt16LE(32, 14);
bmpHeader.writeUInt32LE(0, 16);
bmpHeader.writeUInt32LE(16 * 16 * 4 + 16 * 2, 20);

// #15803d pixel in BGRA
const pixel = Buffer.from([0x3d, 0x80, 0x15, 0xff]);
const pixels = Buffer.alloc(16 * 16 * 4);
for (let i = 0; i < 16 * 16; i++) {
  pixel.copy(pixels, i * 4);
}
const mask = Buffer.alloc(64, 0);

const icoBuffer = Buffer.concat([icoHeader, bmpHeader, pixels, mask]);

const targets = [
  path.join(__dirname, '..', 'frontend', 'public'),
  path.join(__dirname, '..', 'admin', 'public'),
  path.join(__dirname, '..', 'public'),
];

const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#15803d"/><text x="16" y="22" font-family="Arial,sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle">SX</text></svg>';

for (const dir of targets) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(dir, 'favicon.svg'), svg);
  console.log('Created favicon in:', dir);
}
