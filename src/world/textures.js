import * as THREE from 'three';

const ACCENTS = ['#e0231c', '#c9a24a', '#ff5a3c'];

// A design-tool layout grid: fine baseline grid, a handful of brighter
// column/row guide lines, and small alignment tick marks at intersections —
// reads as "artboard" rather than circuitry.
export function makeGridTexture() {
  const size = 1536;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#05070a';
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = 'rgba(223,231,224,0.035)';
  ctx.lineWidth = 1;
  const step = size / 24;
  for (let i = 0; i <= 24; i++) {
    ctx.beginPath(); ctx.moveTo(i * step, 0); ctx.lineTo(i * step, size); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * step); ctx.lineTo(size, i * step); ctx.stroke();
  }

  // bright guide lines (a handful of columns/rows, like alignment guides)
  const guides = 9;
  for (let g = 0; g < guides; g++) {
    const col = ACCENTS[g % ACCENTS.length];
    ctx.shadowColor = col;
    ctx.shadowBlur = 12;
    ctx.strokeStyle = col;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 1.6;
    if (g % 2 === 0) {
      const x = Math.random() * size;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, size); ctx.stroke();
    } else {
      const y = Math.random() * size;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(size, y); ctx.stroke();
    }
  }
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;

  // alignment ticks at scattered intersections
  for (let i = 0; i < 40; i++) {
    const x = Math.round(Math.random() * 24) * step;
    const y = Math.round(Math.random() * 24) * step;
    const col = ACCENTS[i % ACCENTS.length];
    ctx.strokeStyle = col;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 1.4;
    const s = 10;
    ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x + s, y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y - s); ctx.lineTo(x, y + s); ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(c);
  if ('colorSpace' in tex) tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function makeRoughnessTexture() {
  const size = 512;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#8a8a8a';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 700; i++) {
    const v = 120 + Math.floor(Math.random() * 80);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    const r = 4 + Math.random() * 22;
    ctx.beginPath();
    ctx.arc(Math.random() * size, Math.random() * size, r, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(c);
}

export function makeGlowTexture() {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

export { ACCENTS };
