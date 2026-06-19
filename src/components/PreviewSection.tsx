/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, FileDown, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';
import { QRRenderer, triggerDownload, generateSVGString, downloadPDF } from './QRRenderer';
import { QRStyleOptions, BrandSettings } from '../types';

interface PreviewSectionProps {
  content: string;
  options: QRStyleOptions;
  setOptions: React.Dispatch<React.SetStateAction<QRStyleOptions>>;
  logoDataUrl?: string;
  brandSettings: BrandSettings;
}

export function PreviewSection({ content, options, setOptions, logoDataUrl, brandSettings }: PreviewSectionProps) {
  const [activeCanvas, setActiveCanvas] = useState<HTMLCanvasElement | null>(null);
  const [exportRes, setExportRes] = useState<number>(1024); // Default high-res print export is 1024x1024
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const displaySuccessMsg = (msg: string) => {
    setDownloadSuccess(msg);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const currentBrand = brandSettings.whiteLabelMode ? 'White-Label' : brandSettings.brandName;

  // 1. Download Standard PNG with high-resolution scaling
  const handleDownloadPng = (transparent = false) => {
    if (!activeCanvas) return;
    
    // Store original background parameters to restore after export
    const originalTransparent = options.backgroundTransparent;
    const originalRes = options.size;

    // Trigger full redraw at chosen export resolution
    setOptions(prev => ({ 
      ...prev, 
      size: exportRes, 
      backgroundTransparent: transparent 
    }));

    // Wait short frame for Canvas context recalculation
    setTimeout(() => {
      const redrawnCanvas = document.querySelector('#qr-preview-root canvas') as HTMLCanvasElement;
      if (redrawnCanvas) {
        const pngUrl = redrawnCanvas.toDataURL('image/png', 1.0);
        const modeSuffix = transparent ? '_transparent' : '';
        triggerDownload(`${currentBrand.toLowerCase().replace(/[^a-z0-9]/g, '_')}_qr_${exportRes}px${modeSuffix}.png`, pngUrl);
        displaySuccessMsg(`${transparent ? 'Transparent' : 'Standard'} PNG Downloaded!`);
      }

      // Restore parameters
      setOptions(prev => ({ 
        ...prev, 
        size: originalRes, 
        backgroundTransparent: originalTransparent 
      }));
    }, 150);
  };

  // 2. Download Clean Vector SVG
  const handleDownloadSvg = () => {
    const svgStr = generateSVGString(content, options, logoDataUrl);
    if (!svgStr) return;

    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    triggerDownload(`${currentBrand.toLowerCase().replace(/[^a-z0-9]/g, '_')}_qr_vector.svg`, blobUrl);
    displaySuccessMsg('SVG Vector Downloaded!');
  };

  // 3. Download Clean Print PDF using jsPDF
  const handleDownloadPdf = () => {
    if (!activeCanvas) return;
    
    const originalRes = options.size;
    
    // Redraw at high resolution for maximum print crispness
    setOptions(prev => ({ ...prev, size: 1024 }));

    setTimeout(() => {
      const redrawnCanvas = document.querySelector('#qr-preview-root canvas') as HTMLCanvasElement;
      if (redrawnCanvas) {
        downloadPDF(redrawnCanvas, currentBrand);
        displaySuccessMsg('Print PDF Downloaded!');
      }
      
      setOptions(prev => ({ ...prev, size: originalRes }));
    }, 150);
  };

  const isFormValid = content.trim().length > 0;

  return (
    <div className="space-y-6">
      
      {/* Dynamic preview canvas container */}
      <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col items-center">
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 self-start mb-4 uppercase tracking-wider">
          Live Dynamic Preview
        </span>

        {isFormValid ? (
          <QRRenderer
            content={content}
            options={options}
            logoDataUrl={logoDataUrl}
            onCanvasReady={(canvas) => setActiveCanvas(canvas)}
          />
        ) : (
          <div className="w-full max-w-sm aspect-square bg-zinc-50 dark:bg-zinc-900 border border-dashed border-zinc-205 dark:border-zinc-800 rounded-3xl flex flex-col items-center justify-center p-6 text-center select-none min-h-[300px]">
            <span className="text-3xl mb-3">🔍</span>
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Awaiting QR content</h3>
            <p className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-1.5 max-w-[200px] leading-relaxed">
              Please enter a website link, WiFi password or custom text in Step 1 to generate preview.
            </p>
          </div>
        )}

        {/* Success Alert Banner overlays */}
        {downloadSuccess && (
          <div className="mt-4 flex items-center gap-2 p-2 px-4 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-350 border border-emerald-150 dark:border-emerald-900/30 text-xs font-medium animate-bounce">
            <CheckCircle className="h-4 w-4" />
            <span>{downloadSuccess}</span>
          </div>
        )}
      </div>

      {/* Export operations control deck */}
      {isFormValid && (
        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              3. Resolution & Formats
            </span>
            
            {/* Export scale controls */}
            <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-100 dark:border-zinc-850">
              {([512, 1024, 2048] as number[]).map((res) => (
                <button
                  key={res}
                  id={`res-select-${res}`}
                  onClick={() => setExportRes(res)}
                  className={`px-2 py-1 text-[10px] font-mono rounded-md font-medium cursor-pointer transition-all ${
                    exportRes === res
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  {res}px
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            
            {/* Main PNG Download */}
            <button
              id="download-png-standard"
              onClick={() => handleDownloadPng(false)}
              className="flex items-center justify-center gap-2.5 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100 transition-all font-semibold py-3 px-4 text-xs cursor-pointer shadow-sm"
            >
              <Download className="h-4.5 w-4.5" />
              <span>Download PNG ({exportRes}px)</span>
            </button>

            {/* Transparent PNG Download */}
            <button
              id="download-png-transparent"
              onClick={() => handleDownloadPng(true)}
              className="flex items-center justify-center gap-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-305 transition-all font-semibold py-3 px-4 text-xs cursor-pointer bg-white dark:bg-transparent"
            >
              <Sparkles className="h-4.5 w-4.5 text-zinc-500" />
              <span>Transparent PNG</span>
            </button>

            {/* Vector SVG Download */}
            <button
              id="download-svg"
              onClick={handleDownloadSvg}
              className="flex items-center justify-center gap-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-905 text-zinc-705 dark:text-zinc-305 transition-all font-semibold py-3 px-4 text-xs cursor-pointer bg-white dark:bg-transparent"
            >
              <FileDown className="h-4.5 w-4.5 text-blue-500" />
              <span>Vector SVG</span>
            </button>

            {/* Print ready PDF */}
            <button
              id="download-pdf"
              onClick={handleDownloadPdf}
              className="flex items-center justify-center gap-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-905 text-zinc-705 dark:text-zinc-305 transition-all font-semibold py-3 px-4 text-xs cursor-pointer bg-white dark:bg-transparent"
            >
              <FileDown className="h-4.5 w-4.5 text-red-500" />
              <span>Print A4 PDF</span>
            </button>

          </div>

          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 text-center flex items-center justify-center gap-1.5 font-sans pt-1">
            <ShieldAlert className="h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
            Static codes encode content directly into dots, requiring offline scan reliability.
          </p>
        </div>
      )}

    </div>
  );
}
