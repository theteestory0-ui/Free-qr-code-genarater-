/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { QrCode, ExternalLink, RefreshCw, Cpu, Check, FileDown, Info, ShieldCheck } from 'lucide-react';
import { Header } from './components/Header';
import { QRGeneratorForm } from './components/QRGeneratorForm';
import { generateQRContent } from './components/QRRenderer';
import { StyleConfigurator } from './components/StyleConfigurator';
import { TemplatesGrid } from './components/TemplatesGrid';
import { PreviewSection } from './components/PreviewSection';
import { QRStyleOptions, BrandSettings, QRContentType, QRTemplate } from './types';

// Default custom state configurations
const DEFAULT_OPTIONS: QRStyleOptions = {
  dotStyle: 'rounded',
  eyeBorderStyle: 'rounded',
  eyePupilStyle: 'circle',
  foregroundColor: '#0f172a',
  backgroundColor: '#ffffff',
  backgroundTransparent: false,
  gradient: {
    enabled: false,
    type: 'linear',
    colorStart: '#2563eb',
    colorEnd: '#ec4899',
    angle: 45
  },
  customEyeColors: false,
  logoSize: 18,
  logoPadding: true,
  frameStyle: 'none',
  frameColor: '#0f172a',
  frameTextColor: '#ffffff',
  frameCtaText: 'SCAN ME',
  size: 512
};

const DEFAULT_BRAND: BrandSettings = {
  brandName: 'CoreQR Generator',
  headerLogoSymbol: 'QrCode',
  whiteLabelMode: false
};

const INITIAL_FORM_DATA = {
  url: { url: 'https://google.com' },
  text: { text: 'Welcome to CoreQR Generator. Customize and download this static code instantly!' },
  phone: { phone: '+1234567890' },
  email: { to: 'support@example.com', subject: 'Inquiry', body: 'Hello, I scanned your beautiful QR!' },
  whatsapp: { phone: '15550000000', message: 'Hello! I would love more info about this offer.' },
  wifi: { ssid: 'Guest_Network_5G', password: 'SecuredPassword2026', encryption: 'WPA', hidden: false },
  social: { platform: 'instagram', username: 'ai.studio' }
};

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [activeType, setActiveType] = useState<QRContentType>('url');
  const [formData, setFormData] = useState<any>(INITIAL_FORM_DATA);
  const [options, setOptions] = useState<QRStyleOptions>(DEFAULT_OPTIONS);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [logoDataUrl, setLogoDataUrl] = useState<string | undefined>(undefined);
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(DEFAULT_BRAND);

  // Sync favicon/title optionally or show notification
  useEffect(() => {
    document.title = brandSettings.whiteLabelMode ? 'Static QR Code Generator' : `${brandSettings.brandName} - Premium Static QR Generator`;
  }, [brandSettings]);

  // Sync dark class to root documentElement and save to localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Read actual formatted raw string encoding based on selection
  const currentContentText = generateQRContent(activeType, formData[activeType] || {});

  // Apply quick Template choices
  const handleSelectTemplate = (template: QRTemplate) => {
    setActiveTemplateId(template.id);
    setOptions((prev) => ({
      ...prev,
      ...template.styleOptions,
      gradient: {
        ...prev.gradient,
        ...(template.styleOptions.gradient || {})
      }
    }));
  };

  // Reset active template selection outline on manual customization overrides
  const handleManualOverrideOptions = (newOpts: React.SetStateAction<QRStyleOptions>) => {
    setActiveTemplateId(null);
    setOptions(newOpts);
  };

  const handleManualOverrideLogo = (url: string | undefined) => {
    setActiveTemplateId(null);
    setLogoDataUrl(url);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
        
        {/* Sites Header */}
        <Header
          brandSettings={brandSettings}
          setBrandSettings={setBrandSettings}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* Workspace core */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          
          {/* Intro welcome deck */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-850 pb-6"
          >
            <div>
              <span className="text-[11px] font-mono font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 rounded-md">
                Static No-Expiry Engine
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mt-3 font-sans">
                {brandSettings.whiteLabelMode ? 'Static QR Generator' : brandSettings.brandName}
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
                Encode links, passwords, emails, and credentials directly inside offline module matrixes. No expiry, no tracking, complete privacy vector assets.
              </p>
            </div>

            {/* Quick stats / offline status */}
            <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 text-xs text-zinc-500 max-w-xs">
              <Cpu className="h-4 w-4 text-emerald-500 animate-spin" style={{ animationDuration: '6s' }} />
              <div>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">100% Secure & Local</span>
                <span className="text-[10px]">Data never leaves your local browser.</span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left columns (Forms, configs, and library presets) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              
              {/* Dynamic input fields depending on active select type */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
              >
                <QRGeneratorForm
                  activeType={activeType}
                  setActiveType={setActiveType}
                  formData={formData}
                  setFormData={setFormData}
                />
              </motion.div>

              {/* Dynamic configurator card */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
              >
                <StyleConfigurator
                  options={options}
                  setOptions={handleManualOverrideOptions}
                  logoDataUrl={logoDataUrl}
                  setLogoDataUrl={handleManualOverrideLogo}
                />
              </motion.div>

              {/* Templates Selection Grid (12 items) */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
              >
                <TemplatesGrid
                  activeTemplateId={activeTemplateId}
                  onSelectTemplate={handleSelectTemplate}
                />
              </motion.div>

            </div>

            {/* Right column (Locked Preview and Export panels) */}
            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 gap-6 flex flex-col">
              
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.12 }}
              >
                <PreviewSection
                  content={currentContentText}
                  options={options}
                  setOptions={setOptions}
                  logoDataUrl={logoDataUrl}
                  brandSettings={brandSettings}
                />
              </motion.div>

              {/* White Label Support Widget */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 text-xs"
              >
                <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  White-Label Production Ready
                </h4>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal">
                  Toggle <strong>White-Label</strong> mode in the header to instantly remove {brandSettings.brandName} branding references on high-resolution canvas print downloads and PDF metadata reports.
                </p>
              </motion.div>

            </div>

          </div>

        </main>

        {/* Minimal Footer */}
        <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 bg-white dark:bg-black text-zinc-400 dark:text-zinc-650 mt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:flex sm:items-center sm:justify-between gap-4">
            <p className="text-xs">
              &copy; 2026 {brandSettings.whiteLabelMode ? 'White-Label QR Code Suite' : `${brandSettings.brandName} Ltd`}. Open Source client library.
            </p>
            <p className="text-[10px] uppercase tracking-wider font-mono mt-2 sm:mt-0">
              Zero Cookies • Offline Safe • Compliant Vector Outputs
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}
