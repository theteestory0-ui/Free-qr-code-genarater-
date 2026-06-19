/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import { QRStyleOptions } from '../types';

interface QRRendererProps {
  content: string;
  options: QRStyleOptions;
  logoDataUrl?: string;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export function generateQRContent(type: string, data: any): string {
  switch (type) {
    case 'url':
      return data.url || '';
    case 'text':
      return data.text || '';
    case 'phone':
      return data.phone ? `tel:${data.phone}` : '';
    case 'email': {
      const parts: string[] = [];
      if (data.subject) parts.push(`subject=${encodeURIComponent(data.subject)}`);
      if (data.body) parts.push(`body=${encodeURIComponent(data.body)}`);
      const query = parts.length ? `?${parts.join('&')}` : '';
      return data.to ? `mailto:${data.to}${query}` : '';
    }
    case 'whatsapp': {
      const msg = data.message ? `?text=${encodeURIComponent(data.message)}` : '';
      const numbersOnly = data.phone?.replace(/[^0-9]/g, '') || '';
      return numbersOnly ? `https://wa.me/${numbersOnly}${msg}` : '';
    }
    case 'wifi': {
      const ssid = data.ssid || '';
      const pass = data.password || '';
      const enc = data.encryption || 'nopass';
      const hid = data.hidden ? 'H' : '';
      // WIFI:S:SSID;T:WEP;P:PASS;H:true;;
      return `WIFI:S:${ssid};T:${enc};P:${pass};${hid ? 'H:true;' : ''};`;
    }
    case 'social': {
      const username = data.username || '';
      const platform = data.platform || 'instagram';
      if (!username) return '';
      switch (platform) {
        case 'instagram':
          return `https://instagram.com/${username}`;
        case 'twitter':
          return `https://x.com/${username}`;
        case 'youtube':
          return `https://youtube.com/@${username}`;
        case 'linkedin':
          return `https://linkedin.com/in/${username}`;
        case 'facebook':
          return `https://facebook.com/${username}`;
        case 'tiktok':
          return `https://tiktok.com/@${username}`;
        default:
          return username;
      }
    }
    default:
      return '';
  }
}

export function QRRenderer({ content, options, logoDataUrl, onCanvasReady }: QRRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);

  // Pre-load logo image if it changes
  useEffect(() => {
    if (!logoDataUrl) {
      setLogoImage(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = logoDataUrl;
    img.onload = () => {
      setLogoImage(img);
    };
    img.onerror = () => {
      console.error('Failed to load center logo image');
      setLogoImage(null);
    };
  }, [logoDataUrl]);

  // Handle active drawing on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!content) {
      // Clear canvas if no content
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    try {
      // 1. Generate QR matrix using 'qrcode'
      // High (Level H) error correction strictly used for custom styling reliability
      const qr = QRCode.create(content, { errorCorrectionLevel: 'H' });
      const size = qr.modules.size;
      const matrixGet = (row: number, col: number) => {
        if (qr.modules.get) {
          return qr.modules.get(row, col);
        }
        return (qr.modules as any).data[row * size + col];
      };

      // 2. Set Canvas sizes
      const res = options.size || 512;
      canvas.width = res;
      
      // Determine height depending on the selected Frame configuration
      let totalHeight = res;
      if (options.frameStyle === 'bottom-banner' || options.frameStyle === 'rounded-card') {
        totalHeight = Math.round(res * 1.24); // 24% extra horizontal room for the brand banner
      } else if (options.frameStyle === 'minimal-line') {
        totalHeight = Math.round(res * 1.15); // Fine card structure
      }
      canvas.height = totalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Enable premium antialiasing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 3. Clear canvas & Draw background
      ctx.fillStyle = options.backgroundTransparent ? 'rgba(0,0,0,0)' : options.backgroundColor;
      ctx.fillRect(0, 0, res, totalHeight);

      // 4. Calculate QR layout inside canvas
      const padding = Math.round(res * 0.10); // 10% outer cushion
      const qrOffsetTop = padding;
      const qrOffsetLeft = padding;
      const qrPrintSize = res - padding * 2;
      const cellSize = qrPrintSize / size;

      // 5. Draw Frame background and structure before the code matrix to enable overlay layers safely
      drawFrameStructure(ctx, res, totalHeight, padding, options);

      // 6. Draw foreground grid (solid or gradient)
      let defaultFill: string | CanvasGradient = options.foregroundColor;
      if (options.gradient.enabled) {
        if (options.gradient.type === 'linear') {
          // linear gradient angle mapping to coordinate space
          const angleRad = (options.gradient.angle * Math.PI) / 180;
          const x0 = qrOffsetLeft + qrPrintSize * Math.max(0, -Math.cos(angleRad));
          const y0 = qrOffsetTop + qrPrintSize * Math.max(0, -Math.sin(angleRad));
          const x1 = qrOffsetLeft + qrPrintSize * Math.max(0, Math.cos(angleRad));
          const y1 = qrOffsetTop + qrPrintSize * Math.max(0, Math.sin(angleRad));
          
          const linGrad = ctx.createLinearGradient(x0, y0, x1, y1);
          linGrad.addColorStop(0, options.gradient.colorStart);
          linGrad.addColorStop(1, options.gradient.colorEnd);
          defaultFill = linGrad;
        } else {
          // Centered radial radial gradient
          const cx = qrOffsetLeft + qrPrintSize / 2;
          const cy = qrOffsetTop + qrPrintSize / 2;
          const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, qrPrintSize / 1.3);
          radGrad.addColorStop(0, options.gradient.colorStart);
          radGrad.addColorStop(1, options.gradient.colorEnd);
          defaultFill = radGrad;
        }
      }

      ctx.fillStyle = defaultFill;

      // 7. Render modules grid
      const logoRatio = options.logoSize / 100;
      const logoUnitsSquare = size * logoRatio;
      const boundsMin = (size - logoUnitsSquare) / 2;
      const boundsMax = (size + logoUnitsSquare) / 2;

      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          // Check standard QR finder pattern coordinates and skip them to avoid clipping
          if ((r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7)) {
            continue; 
          }

          // Check if cells reside in the logo central clearing bounds to leave empty matrix zone
          if (logoImage && options.logoPadding) {
            if (r >= boundsMin - 0.5 && r <= boundsMax - 0.5 && c >= boundsMin - 0.5 && c <= boundsMax - 0.5) {
              continue;
            }
          }

          if (matrixGet(r, c)) {
            const px = qrOffsetLeft + c * cellSize;
            const py = qrOffsetTop + r * cellSize;
            
            drawCellModule(ctx, px, py, cellSize, options.dotStyle);
          }
        }
      }

      // 8. Custom render 3 Corner Eyes
      drawCustomEyes(ctx, qrOffsetLeft, qrOffsetTop, size, cellSize, defaultFill, options);

      // 9. Draw Brand Center Logo
      if (logoImage) {
        const cx = qrOffsetLeft + qrPrintSize / 2;
        const cy = qrOffsetTop + qrPrintSize / 2;
        const lw = qrPrintSize * logoRatio;
        const lh = qrPrintSize * logoRatio;

        // Draw white circular or rectangular backing shield
        if (options.logoPadding) {
          ctx.beginPath();
          ctx.fillStyle = '#ffffff';
          // A rounded rect for matching design aesthetics
          const shieldRadius = lw * 0.15;
          ctx.roundRect ? ctx.roundRect(cx - lw/2 - 4, cy - lh/2 - 4, lw + 8, lh + 8, shieldRadius) : ctx.rect(cx - lw/2 - 4, cy - lh/2 - 4, lw + 8, lh + 8);
          ctx.fill();
        }

        // Keep aspect ratio intact
        let aspect = logoImage.width / logoImage.height;
        let drawW = lw;
        let drawH = lh;
        if (aspect > 1) {
          drawH = lw / aspect;
        } else {
          drawW = lh * aspect;
        }

        ctx.drawImage(logoImage, cx - drawW/2, cy - drawH/2, drawW, drawH);
      }

      // 10. Post-process Frame decorations (e.g. text lettering / CTA caps)
      drawFrameDecorations(ctx, res, totalHeight, padding, options);

      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
    } catch (err) {
      console.error('Error drawing customized QR Canvas: ', err);
    }
  }, [content, options, logoImage, logoDataUrl, onCanvasReady]);

  return (
    <div className="relative flex justify-center items-center w-full max-w-sm mx-auto select-none bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl" id="qr-preview-root">
      <div className="w-full relative aspect-square max-w-[320px] bg-white rounded-2xl overflow-hidden flex items-center justify-center shadow-lg border border-zinc-100 dark:border-zinc-800" style={{ height: 'auto' }}>
        <canvas ref={canvasRef} className="w-full h-auto object-contain" />
      </div>
    </div>
  );
}

// Draw individual dot models with responsive paths
function drawCellModule(ctx: CanvasRenderingContext2D, px: number, py: number, size: number, style: string) {
  ctx.beginPath();
  switch (style) {
    case 'circle': {
      const r = size * 0.42;
      ctx.arc(px + size / 2, py + size / 2, r, 0, 2 * Math.PI);
      ctx.fill();
      break;
    }
    case 'rounded': {
      const r = size * 0.38;
      ctx.roundRect ? ctx.roundRect(px, py, size, size, r) : ctx.rect(px, py, size, size);
      ctx.fill();
      break;
    }
    case 'diamond': {
      ctx.moveTo(px + size / 2, py);
      ctx.lineTo(px + size, py + size / 2);
      ctx.lineTo(px + size / 2, py + size);
      ctx.lineTo(px, py + size / 2);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'star': {
      // 4-pointed elegant sparkle stars
      const half = size / 2;
      ctx.moveTo(px + half, py);
      ctx.quadraticCurveTo(px + half, py + half, px + size, py + half);
      ctx.quadraticCurveTo(px + half, py + half, px + half, py + size);
      ctx.quadraticCurveTo(px + half, py + half, px, py + half);
      ctx.quadraticCurveTo(px + half, py + half, px + half, py);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'square':
    default: {
      ctx.rect(px, py, size, size);
      ctx.fill();
      break;
    }
  }
}

// Handles custom outer/inner styles for the three finder patterns
function drawCustomEyes(
  ctx: CanvasRenderingContext2D,
  offsetLeft: number,
  offsetTop: number,
  matrixSize: number,
  cellSize: number,
  bodyFill: string | CanvasGradient,
  options: QRStyleOptions
) {
  const eyeCellWidth = 7;
  const totalEyeSize = eyeCellWidth * cellSize;

  const positions = [
    { x: offsetLeft, y: offsetTop }, // Top-Left
    { x: offsetLeft + (matrixSize - eyeCellWidth) * cellSize, y: offsetTop }, // Top-Right
    { x: offsetLeft, y: offsetTop + (matrixSize - eyeCellWidth) * cellSize }, // Bottom-Left
  ];

  positions.forEach((pos) => {
    // Determine target border & pupil colors
    const borderFill = options.customEyeColors && options.eyeBorderColor ? options.eyeBorderColor : bodyFill;
    const pupilFill = options.customEyeColors && options.eyePupilColor ? options.eyePupilColor : bodyFill;

    // Outer Eye Path
    ctx.beginPath();
    ctx.fillStyle = borderFill;

    const wt = totalEyeSize;
    const x = pos.x;
    const y = pos.y;

    // Draw solid outer shape
    switch (options.eyeBorderStyle) {
      case 'circle': {
        ctx.arc(x + wt / 2, y + wt / 2, wt / 2, 0, 2 * Math.PI);
        ctx.fill();
        break;
      }
      case 'rounded': {
        const eyeRad = wt * 0.25;
        ctx.roundRect ? ctx.roundRect(x, y, wt, wt, eyeRad) : ctx.rect(x, y, wt, wt);
        ctx.fill();
        break;
      }
      case 'leaf': {
        // Beautiful eye/leaf path with opposing curves and pointed top-left & bottom-right
        ctx.beginPath();
        ctx.moveTo(x + wt, y + wt);
        ctx.bezierCurveTo(x + wt, y + wt * 0.1, x + wt * 0.1, y, x, y);
        ctx.bezierCurveTo(x, y + wt * 0.9, x + wt * 0.9, y + wt, x + wt, y + wt);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'square':
      default: {
        ctx.rect(x, y, wt, wt);
        ctx.fill();
        break;
      }
    }

    // Clearance loop: Fill interior with canvas background color of size 5x5 cells (creates the 1-cell border stroke effect)
    ctx.beginPath();
    ctx.fillStyle = options.backgroundColor;
    const innerOffset = cellSize;
    const innerWt = 5 * cellSize;
    const innerX = x + innerOffset;
    const innerY = y + innerOffset;

    // Matching clearance interior
    switch (options.eyeBorderStyle) {
      case 'circle': {
        ctx.arc(innerX + innerWt / 2, innerY + innerWt / 2, innerWt / 2, 0, 2 * Math.PI);
        ctx.fill();
        break;
      }
      case 'rounded': {
        const clearanceRad = innerWt * 0.22;
        ctx.roundRect ? ctx.roundRect(innerX, innerY, innerWt, innerWt, clearanceRad) : ctx.rect(innerX, innerY, innerWt, innerWt);
        ctx.fill();
        break;
      }
      case 'leaf': {
        ctx.beginPath();
        ctx.moveTo(innerX + innerWt, innerY + innerWt);
        ctx.bezierCurveTo(innerX + innerWt, innerY + innerWt * 0.1, innerX + innerWt * 0.1, innerY, innerX, innerY);
        ctx.bezierCurveTo(innerX, innerY + innerWt * 0.9, innerX + innerWt * 0.9, innerY + innerWt, innerX + innerWt, innerY + innerWt);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'square':
      default: {
        ctx.rect(innerX, innerY, innerWt, innerWt);
        ctx.fill();
        break;
      }
    }

    // Pupil Path (centered 3x3 cells)
    ctx.beginPath();
    ctx.fillStyle = pupilFill;
    const pupilOffset = 2 * cellSize;
    const pupilWt = 3 * cellSize;
    const px = x + pupilOffset;
    const py = y + pupilOffset;

    switch (options.eyePupilStyle) {
      case 'circle': {
        ctx.arc(px + pupilWt / 2, py + pupilWt / 2, pupilWt / 2, 0, 2 * Math.PI);
        ctx.fill();
        break;
      }
      case 'diamond': {
        ctx.moveTo(px + pupilWt / 2, py);
        ctx.lineTo(px + pupilWt, py + pupilWt / 2);
        ctx.lineTo(px + pupilWt / 2, py + pupilWt);
        ctx.lineTo(px, py + pupilWt / 2);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'leaf': {
        ctx.beginPath();
        ctx.moveTo(px + pupilWt, py + pupilWt);
        ctx.bezierCurveTo(px + pupilWt, py + pupilWt * 0.15, px + pupilWt * 0.15, py, px, py);
        ctx.bezierCurveTo(px, py + pupilWt * 0.85, px + pupilWt * 0.85, py + pupilWt, px + pupilWt, py + pupilWt);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'square':
      default: {
        ctx.rect(px, py, pupilWt, pupilWt);
        ctx.fill();
        break;
      }
    }
  });
}

// Background frame geometry setup
function drawFrameStructure(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  padding: number,
  options: QRStyleOptions
) {
  if (options.frameStyle === 'none') return;

  ctx.save();
  switch (options.frameStyle) {
    case 'rounded-card': {
      // Warm border container enclosing the canvas
      ctx.beginPath();
      ctx.strokeStyle = options.frameColor;
      ctx.lineWidth = 4;
      const cardRad = width * 0.06;
      ctx.roundRect ? ctx.roundRect(8, 8, width - 16, height - 16, cardRad) : ctx.rect(8, 8, width - 16, height - 16);
      ctx.stroke();
      break;
    }
    case 'elegant': {
      // Custom delicate thin borders
      const bDist = padding * 0.35;
      ctx.beginPath();
      ctx.strokeStyle = options.frameColor;
      ctx.lineWidth = 1.5;
      ctx.rect(bDist, bDist, width - bDist * 2, height - bDist * 2);
      ctx.stroke();
      break;
    }
    case 'minimal-line': {
      // Sleek outline card chassis
      ctx.beginPath();
      ctx.strokeStyle = options.frameColor + '3F'; // 25% opacity
      ctx.lineWidth = 1.5;
      const rad = 12;
      ctx.roundRect ? ctx.roundRect(12, 12, width - 24, height - 24, rad) : ctx.rect(12, 12, width - 24, height - 24);
      ctx.stroke();
      break;
    }
    default:
      break;
  }
  ctx.restore();
}

// Lettering and brand labels inside frames
function drawFrameDecorations(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  padding: number,
  options: QRStyleOptions
) {
  if (options.frameStyle === 'none') return;

  ctx.save();
  const rawText = options.frameCtaText || 'SCAN ME';
  const ctaVal = rawText.toUpperCase();

  switch (options.frameStyle) {
    case 'bottom-banner': {
      // Solid colored marketing lower pill
      const bannerHeight = Math.round(width * 0.16);
      const bannerY = width;

      ctx.beginPath();
      ctx.fillStyle = options.frameColor;
      
      // Beautiful rounded layout at the lower edge of the bottom panel
      if (ctx.roundRect) {
        ctx.roundRect(padding, bannerY, width - padding * 2, bannerHeight, 14);
      } else {
        ctx.rect(padding, bannerY, width - padding * 2, bannerHeight);
      }
      ctx.fill();

      // CTA label
      ctx.fillStyle = options.frameTextColor;
      ctx.font = `bold ${Math.round(width * 0.038)}px "Inter", "Space Grotesk", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ctaVal, width / 2, bannerY + bannerHeight / 2);
      break;
    }
    case 'rounded-card': {
      // Colored button tab centered in Card base
      const cardHeight = Math.round(width * 0.14);
      const cardY = width + padding * 0.3;

      ctx.beginPath();
      ctx.fillStyle = options.frameColor;
      const bRad = 10;
      ctx.roundRect ? ctx.roundRect(padding * 1.5, cardY, width - padding * 3, cardHeight, bRad) : ctx.rect(padding * 1.5, cardY, width - padding * 3, cardHeight);
      ctx.fill();

      ctx.fillStyle = options.frameTextColor;
      ctx.font = `bold ${Math.round(width * 0.035)}px "Inter", "Space Grotesk", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ctaVal, width / 2, cardY + cardHeight / 2);
      break;
    }
    case 'elegant': {
      // Double brackets in standard vintage corners
      ctx.strokeStyle = options.frameColor;
      ctx.lineWidth = 3;
      const bSize = width * 0.06;
      const bOffset = padding * 0.5;

      const limits = [
        { x: bOffset, y: bOffset, dx: 1, dy: 1 },
        { x: width - bOffset, y: bOffset, dx: -1, dy: 1 },
        { x: bOffset, y: height - bOffset, dx: 1, dy: -1 },
        { x: width - bOffset, y: height - bOffset, dx: -1, dy: -1 }
      ];

      limits.forEach((pt) => {
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y + pt.dy * bSize);
        ctx.lineTo(pt.x, pt.y);
        ctx.lineTo(pt.x + pt.dx * bSize, pt.y);
        ctx.stroke();
      });

      // Subtle centered tiny text footer
      ctx.fillStyle = options.frameTextColor;
      ctx.font = `italic ${Math.round(width * 0.028)}px Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.fillText(`•   ${ctaVal}   •`, width / 2, height - bOffset - 4);
      break;
    }
    case 'minimal-line': {
      // Compact sleek capsule
      const capWidth = width * 0.44;
      const capHeight = width * 0.08;
      const capX = (width - capWidth) / 2;
      const capY = height - capHeight - 12;

      ctx.beginPath();
      ctx.fillStyle = options.frameColor;
      ctx.roundRect ? ctx.roundRect(capX, capY, capWidth, capHeight, 30) : ctx.rect(capX, capY, capWidth, capHeight);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(width * 0.027)}px "Inter", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ctaVal, width / 2, capY + capHeight / 2);
      break;
    }
  }
  ctx.restore();
}

// Custom vector SVG file generation function
export function generateSVGString(content: string, options: QRStyleOptions, logoDataUrl?: string): string {
  try {
    const qr = QRCode.create(content, { errorCorrectionLevel: 'H' });
    const size = qr.modules.size;
    const matrixGet = (row: number, col: number) => {
      if (qr.modules.get) {
        return qr.modules.get(row, col);
      }
      return (qr.modules as any).data[row * size + col];
    };

    const res = 512;
    let totalHeight = res;
    if (options.frameStyle === 'bottom-banner' || options.frameStyle === 'rounded-card') {
      totalHeight = Math.round(res * 1.24);
    } else if (options.frameStyle === 'minimal-line') {
      totalHeight = Math.round(res * 1.15);
    }

    const padding = Math.round(res * 0.10);
    const qrPrintSize = res - padding * 2;
    const cellSize = qrPrintSize / size;

    const logoRatio = options.logoSize / 100;
    const logoUnitsSquare = size * logoRatio;
    const boundsMin = (size - logoUnitsSquare) / 2;
    const boundsMax = (size + logoUnitsSquare) / 2;

    const elements: string[] = [];
    const defs: string[] = [];

    // Background color
    if (!options.backgroundTransparent) {
      elements.push(`<rect width="${res}" height="${totalHeight}" fill="${options.backgroundColor}" />`);
    }

    // Gradient definitions
    let fillAttr = options.foregroundColor;
    if (options.gradient.enabled) {
      fillAttr = 'url(#qr-gradient)';
      if (options.gradient.type === 'linear') {
        const angleRad = (options.gradient.angle * Math.PI) / 180;
        const x1 = Math.round(Math.max(0, -Math.cos(angleRad)) * 100);
        const y1 = Math.round(Math.max(0, -Math.sin(angleRad)) * 100);
        const x2 = Math.round(Math.max(0, Math.cos(angleRad)) * 100);
        const y2 = Math.round(Math.max(0, Math.sin(angleRad)) * 100);
        defs.push(`
          <linearGradient id="qr-gradient" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
            <stop offset="0%" stop-color="${options.gradient.colorStart}" />
            <stop offset="100%" stop-color="${options.gradient.colorEnd}" />
          </linearGradient>
        `);
      } else {
        defs.push(`
          <radialGradient id="qr-gradient" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stop-color="${options.gradient.colorStart}" />
            <stop offset="100%" stop-color="${options.gradient.colorEnd}" />
          </radialGradient>
        `);
      }
    }

    // Render body modules
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if ((r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7)) {
          continue; // skip corners of finder stamps
        }

        if (logoDataUrl && options.logoPadding) {
          if (r >= boundsMin - 0.5 && r <= boundsMax - 0.5 && c >= boundsMin - 0.5 && c <= boundsMax - 0.5) {
            continue; // clear center for logo space
          }
        }

        if (matrixGet(r, c)) {
          const px = padding + c * cellSize;
          const py = padding + r * cellSize;

          if (options.dotStyle === 'circle') {
            const rad = cellSize * 0.42;
            elements.push(`<circle cx="${px + cellSize/2}" cy="${py + cellSize/2}" r="${rad}" fill="${fillAttr}" />`);
          } else if (options.dotStyle === 'rounded') {
            const rad = cellSize * 0.38;
            elements.push(`<rect x="${px}" y="${py}" width="${cellSize}" height="${cellSize}" rx="${rad}" fill="${fillAttr}" />`);
          } else if (options.dotStyle === 'diamond') {
            const path = `M ${px + cellSize/2} ${py} L ${px + cellSize} ${py + cellSize/2} L ${px + cellSize/2} ${py + cellSize} L ${px} ${py + cellSize/2} Z`;
            elements.push(`<path d="${path}" fill="${fillAttr}" />`);
          } else if (options.dotStyle === 'star') {
            const half = cellSize / 2;
            const path = `M ${px + half} ${py} Q ${px + half} ${py + half} ${px + cellSize} ${py + half} Q ${px + half} ${py + half} ${px + half} ${py + cellSize} Q ${px + half} ${py + half} ${px} ${py + half} Q ${px + half} ${py + half} ${px + half} ${py}`;
            elements.push(`<path d="${path}" fill="${fillAttr}" />`);
          } else {
            elements.push(`<rect x="${px}" y="${py}" width="${cellSize}" height="${cellSize}" fill="${fillAttr}" />`);
          }
        }
      }
    }

    // Draw frame styling onto vectors
    if (options.frameStyle !== 'none') {
      const sfColor = options.frameColor;
      if (options.frameStyle === 'rounded-card') {
        const rad = res * 0.06;
        elements.push(`<rect x="8" y="8" width="${res - 16}" height="${totalHeight - 16}" rx="${rad}" fill="none" stroke="${sfColor}" stroke-width="4" />`);
        
        // Lower pill layout button
        const cardY = res + padding * 0.3;
        elements.push(`<rect x="${padding * 1.5}" y="${cardY}" width="${res - padding * 3}" height="${res * 0.14}" rx="10" fill="${sfColor}" />`);
        elements.push(`
          <text x="${res / 2}" y="${cardY + res * 0.07}" fill="${options.frameTextColor}" font-family="system-ui, sans-serif" font-weight="bold" font-size="${res * 0.035}" text-anchor="middle" dominant-baseline="middle">
            ${(options.frameCtaText || 'SCAN ME').toUpperCase()}
          </text>
        `);
      } else if (options.frameStyle === 'bottom-banner') {
        const bannerHeight = Math.round(res * 0.16);
        elements.push(`<rect x="${padding}" y="${res}" width="${res - padding * 2}" height="${bannerHeight}" rx="14" fill="${sfColor}" />`);
        elements.push(`
          <text x="${res / 2}" y="${res + bannerHeight / 2}" fill="${options.frameTextColor}" font-family="system-ui, sans-serif" font-weight="bold" font-size="${res * 0.038}" text-anchor="middle" dominant-baseline="middle">
            ${(options.frameCtaText || 'SCAN ME').toUpperCase()}
          </text>
        `);
      } else if (options.frameStyle === 'elegant') {
        const bDist = padding * 0.35;
        elements.push(`<rect x="${bDist}" y="${bDist}" width="${res - bDist * 2}" height="${totalHeight - bDist * 2}" fill="none" stroke="${sfColor}" stroke-width="1.5" />`);
        
        // Corner brackets
        const bSize = res * 0.06;
        const bOffset = padding * 0.5;
        const cornerCoord = [
          `M ${bOffset} ${bOffset + bSize} L ${bOffset} ${bOffset} L ${bOffset + bSize} ${bOffset}`,
          `M ${res - bOffset} ${bOffset + bSize} L ${res - bOffset} ${bOffset} L ${res - bOffset - bSize} ${bOffset}`,
          `M ${bOffset} ${totalHeight - bOffset - bSize} L ${bOffset} ${totalHeight - bOffset} L ${bOffset + bSize} ${totalHeight - bOffset}`,
          `M ${res - bOffset} ${totalHeight - bOffset - bSize} L ${res - bOffset} ${totalHeight - bOffset} L ${res - bOffset - bSize} ${totalHeight - bOffset}`
        ];
        cornerCoord.forEach(path => {
          elements.push(`<path d="${path}" fill="none" stroke="${sfColor}" stroke-width="3" />`);
        });

        // Elegant tiny label text
        elements.push(`
          <text x="${res / 2}" y="${totalHeight - bOffset - 4}" fill="${options.frameTextColor}" font-family="Georgia, serif" font-style="italic" font-size="${res * 0.028}" text-anchor="middle">
            •  ${(options.frameCtaText || 'SCAN ME').toUpperCase()}  •
          </text>
        `);
      } else if (options.frameStyle === 'minimal-line') {
        const rad = 12;
        elements.push(`<rect x="12" y="12" width="${res - 24}" height="${totalHeight - 24}" rx="${rad}" fill="none" stroke="${sfColor}3F" stroke-width="1.5" />`);
        
        const capW = res * 0.44;
        const capH = res * 0.08;
        elements.push(`<rect x="${(res - capW)/2}" y="${totalHeight - capH - 12}" width="${capW}" height="${capH}" rx="30" fill="${sfColor}" />`);
        elements.push(`
          <text x="${res / 2}" y="${totalHeight - capH/2 - 12}" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="bold" font-size="${res * 0.027}" text-anchor="middle" dominant-baseline="middle">
            ${(options.frameCtaText || 'SCAN ME').toUpperCase()}
          </text>
        `);
      }
    }

    // 3 Corner Finder Stamps
    const eyeWidth = 7 * cellSize;
    const eyeBorder = options.customEyeColors && options.eyeBorderColor ? options.eyeBorderColor : fillAttr;
    const eyePupil = options.customEyeColors && options.eyePupilColor ? options.eyePupilColor : fillAttr;

    const eyeOffsets = [
      { x: padding, y: padding },
      { x: padding + (size - 7) * cellSize, y: padding },
      { x: padding, y: padding + (size - 7) * cellSize }
    ];

    eyeOffsets.forEach((pos) => {
      const ex = pos.x;
      const ey = pos.y;

      let outerPath = '';
      if (options.eyeBorderStyle === 'circle') {
        outerPath = `<circle cx="${ex + eyeWidth/2}" cy="${ey + eyeWidth/2}" r="${eyeWidth/2}" fill="${eyeBorder}" />`;
      } else if (options.eyeBorderStyle === 'rounded') {
        outerPath = `<rect x="${ex}" y="${ey}" width="${eyeWidth}" height="${eyeWidth}" rx="${eyeWidth * 0.25}" fill="${eyeBorder}" />`;
      } else if (options.eyeBorderStyle === 'leaf') {
        outerPath = `<path d="M ${ex + eyeWidth} ${ey + eyeWidth} C ${ex + eyeWidth} ${ey + eyeWidth * 0.1}, ${ex + eyeWidth * 0.1} ${ey}, ${ex} ${ey} C ${ex} ${ey + eyeWidth * 0.9}, ${ex + eyeWidth * 0.9} ${ey + eyeWidth}, ${ex + eyeWidth} ${ey + eyeWidth} Z" fill="${eyeBorder}" />`;
      } else {
        outerPath = `<rect x="${ex}" y="${ey}" width="${eyeWidth}" height="${eyeWidth}" fill="${eyeBorder}" />`;
      }
      elements.push(outerPath);

      // Inner clearance mask
      const inX = ex + cellSize;
      const inY = ey + cellSize;
      const inW = 5 * cellSize;
      let innerClear = '';
      if (options.eyeBorderStyle === 'circle') {
        innerClear = `<circle cx="${inX + inW/2}" cy="${inY + inW/2}" r="${inW/2}" fill="${options.backgroundColor}" />`;
      } else if (options.eyeBorderStyle === 'rounded') {
        innerClear = `<rect x="${inX}" y="${inY}" width="${inW}" height="${inW}" rx="${inW * 0.22}" fill="${options.backgroundColor}" />`;
      } else if (options.eyeBorderStyle === 'leaf') {
        innerClear = `<path d="M ${inX + inW} ${inY + inW} C ${inX + inW} ${inY + inW * 0.1}, ${inX + inW * 0.1} ${inY}, ${inX} ${inY} C ${inX} ${inY + inW * 0.9}, ${inX + inW * 0.9} ${inY + inW}, ${inX + inW} ${inY + inW} Z" fill="${options.backgroundColor}" />`;
      } else {
        innerClear = `<rect x="${inX}" y="${inY}" width="${inW}" height="${inW}" fill="${options.backgroundColor}" />`;
      }
      elements.push(innerClear);

      // Inner Pupil
      const px = ex + 2 * cellSize;
      const py = ey + 2 * cellSize;
      const pw = 3 * cellSize;
      let pupilPath = '';
      if (options.eyePupilStyle === 'circle') {
        pupilPath = `<circle cx="${px + pw/2}" cy="${py + pw/2}" r="${pw/2}" fill="${eyePupil}" />`;
      } else if (options.eyePupilStyle === 'diamond') {
        pupilPath = `<path d="M ${px + pw/2} ${py} L ${px + pw} ${py + pw/2} L ${px + pw/2} ${py + pw} L ${px} ${py + pw/2} Z" fill="${eyePupil}" />`;
      } else if (options.eyePupilStyle === 'leaf') {
        pupilPath = `<path d="M ${px + pw} ${py + pw} C ${px + pw} ${py + pw * 0.15}, ${px + pw * 0.15} ${py}, ${px} ${py} C ${px} ${py + pw * 0.85}, ${px + pw * 0.85} ${py + pw}, ${px + pw} ${py + pw} Z" fill="${eyePupil}" />`;
      } else {
        pupilPath = `<rect x="${px}" y="${py}" width="${pw}" height="${pw}" fill="${eyePupil}" />`;
      }
      elements.push(pupilPath);
    });

    // Logo embedding as SVG image
    if (logoDataUrl) {
      const cx = padding + qrPrintSize / 2;
      const cy = padding + qrPrintSize / 2;
      const lw = qrPrintSize * logoRatio;
      const lh = qrPrintSize * logoRatio;

      if (options.logoPadding) {
        elements.push(`<rect x="${cx - lw/2 - 4}" y="${cy - lh/2 - 4}" width="${lw + 8}" height="${lh + 8}" rx="${lw * 0.15}" fill="#ffffff" />`);
      }
      elements.push(`<image x="${cx - lw/2}" y="${cy - lh/2}" width="${lw}" height="${lh}" href="${logoDataUrl}" />`);
    }

    const output = `
<svg xmlns="http://www.w3.org/2000/svg" width="${res}" height="${totalHeight}" viewBox="0 0 ${res} ${totalHeight}">
  <defs>
    ${defs.join('\n')}
  </defs>
  ${elements.join('\n')}
</svg>
    `.trim();

    return output;
  } catch (err) {
    console.error('Error generating customized SVG string: ', err);
    return '';
  }
}

// Download triggering utilities with high-quality settings
export function triggerDownload(fileName: string, dataUrl: string) {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadPDF(canvas: HTMLCanvasElement, brandName: string) {
  try {
    // Generate an clean, standard A4 PDF document incorporating the logo and watermark
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const qrDataUrl = canvas.toDataURL('image/png', 1.0);

    // Document header brand markers
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(`${brandName.toUpperCase()}`, 20, 20);

    doc.setFontSize(8);
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.text(`Generated on ${dateStr}`, 190 - 20, 20, { align: 'right' });

    // Decorative line
    doc.setDrawColor(220, 220, 220);
    doc.line(20, 25, 190, 25);

    // Center standard 120x150 max frame print
    const canvasRatio = canvas.height / canvas.width;
    const qrWidthInPdf = 110; // mm width
    const qrHeightInPdf = qrWidthInPdf * canvasRatio;

    doc.addImage(
      qrDataUrl,
      'PNG',
      (210 - qrWidthInPdf) / 2, // Centered horizontal position
      45,                       // Y offset
      qrWidthInPdf,
      qrHeightInPdf
    );

    // Document styling label details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(30, 30, 30);
    doc.text('Your Custom QR Code', 105, 50 + qrHeightInPdf + 12, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(140, 140, 140);
    doc.text('This is a high-resolution static vector-ready offline code. It will never expire.', 105, 50 + qrHeightInPdf + 20, { align: 'center' });

    // Footer lines
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text(`Professional dynamic layouts powered by ${brandName}`, 105, 275, { align: 'center' });

    doc.save(`${brandName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_qr_code.pdf`);
  } catch (err) {
    console.error('Error triggered while creating PDF export: ', err);
  }
}
