/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { QrCode, Sliders, Shield, Moon, Sun, Sparkles, AlertCircle } from 'lucide-react';
import { BrandSettings } from '../types';

interface HeaderProps {
  brandSettings: BrandSettings;
  setBrandSettings: React.Dispatch<React.SetStateAction<BrandSettings>>;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export function Header({ brandSettings, setBrandSettings, darkMode, setDarkMode }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-black">
              <QrCode id="header-brand-logo" className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <span className="font-sans font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 text-base">
                {brandSettings.whiteLabelMode ? 'White-Label QR' : brandSettings.brandName}
              </span>
              {!brandSettings.whiteLabelMode && (
                <span className="ml-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                  PRO
                </span>
              )}
            </div>
          </div>

          {/* Quick Branding Customization and Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* White-Label Settings Inline Pill */}
            <div className="hidden md:flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs">
              <Sliders className="h-3 w-3 text-zinc-400" />
              <span className="text-zinc-500 dark:text-zinc-400">Brand Name:</span>
              <input
                type="text"
                value={brandSettings.brandName}
                onChange={(e) => setBrandSettings(prev => ({ ...prev, brandName: e.target.value }))}
                className="w-24 bg-transparent border-b border-zinc-300 dark:border-zinc-700 pb-0.5 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-200 text-xs font-medium"
                title="Customize brand name instantly"
                placeholder="Brand Name"
              />
              <div className="h-3 w-px bg-zinc-200 dark:bg-zinc-850 mx-1" />
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={brandSettings.whiteLabelMode}
                  onChange={(e) => setBrandSettings(prev => ({ ...prev, whiteLabelMode: e.target.checked }))}
                  className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-0 h-3 w-3"
                />
                <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                  <Shield className="h-3 w-3 inline" /> White-Label
                </span>
              </label>
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              id="theme-toggler"
              onClick={() => setDarkMode(!darkMode)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-905 text-zinc-600 dark:text-zinc-400 transition-colors"
              aria-label="Toggle theme color"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
