/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { Palette, Layers, Image as ImageIcon, Layout, Upload, Check, RefreshCw } from 'lucide-react';
import { QRStyleOptions, DotStyleType, EyeBorderStyleType, EyePupilStyleType, FrameStyleType } from '../types';

interface StyleConfiguratorProps {
  options: QRStyleOptions;
  setOptions: React.Dispatch<React.SetStateAction<QRStyleOptions>>;
  logoDataUrl?: string;
  setLogoDataUrl: (url: string | undefined) => void;
}

export function StyleConfigurator({ options, setOptions, logoDataUrl, setLogoDataUrl }: StyleConfiguratorProps) {
  const [activeSubTab, setActiveSubTab] = useState<'style' | 'colors' | 'logo' | 'frame'>('style');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateOption = (field: keyof QRStyleOptions, value: any) => {
    setOptions((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const updateGradient = (field: string, value: any) => {
    setOptions((prev) => ({
      ...prev,
      gradient: {
        ...prev.gradient,
        [field]: value
      }
    }));
  };

  // Drag and drop / file upload triggers
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        setLogoDataUrl(uploadEvent.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Pre-configured logos for quick white-label testing
  const presetLogos = [
    { name: 'Scan Code', icon: '⚡', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%231e293b" rx="20"/><path d="M50 20 L30 55 H45 L35 80 L70 45 H55 Z" fill="%23ffffff"/></svg>' },
    { name: 'Profile Me', icon: '👤', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%236366f1"/><circle cx="50" cy="40" r="18" fill="%23ffffff"/><path d="M18 80 C24 64, 40 58, 50 58 C60 58, 76 64, 82 80 Z" fill="%23ffffff"/></svg>' },
    { name: 'Global Network', icon: '🌐', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230d9488" rx="20"/><circle cx="50" cy="50" r="30" stroke="%23ffffff" fill="none" stroke-width="4"/><path d="M20 50 H80 M50 20 V80" stroke="%23ffffff" stroke-width="4"/></svg>' },
    { name: 'Wifi Hotspot', icon: '📶', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23ea580c" rx="20"/><path d="M50 80 A1 1 0 0 0 50 78 A1 1 0 0 0 50 80 M35 60 C40 52, 60 52, 65 60 M23 45 C35 30, 65 30, 77 45 M12 30 C32 8, 68 8, 88 30" stroke="%23ffffff" fill="none" stroke-width="6" stroke-linecap="round"/></svg>' },
  ];

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider mb-4">
        2. Customize Aesthetic Details
      </h2>

      {/* Categories Tab Selector */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-50 dark:bg-zinc-900 rounded-xl mb-6">
        <button
          id="config-tab-style"
          onClick={() => setActiveSubTab('style')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
            activeSubTab === 'style'
              ? 'bg-white dark:bg-zinc-805 text-zinc-900 dark:text-zinc-50 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span className="hidden sm:inline">Modules</span>
        </button>
        <button
          id="config-tab-colors"
          onClick={() => setActiveSubTab('colors')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
            activeSubTab === 'colors'
              ? 'bg-white dark:bg-zinc-805 text-zinc-900 dark:text-zinc-50 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Colorways</span>
        </button>
        <button
          id="config-tab-logo"
          onClick={() => setActiveSubTab('logo')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
            activeSubTab === 'logo'
              ? 'bg-white dark:bg-zinc-805 text-zinc-900 dark:text-zinc-50 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          <ImageIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Watermark</span>
        </button>
        <button
          id="config-tab-frame"
          onClick={() => setActiveSubTab('frame')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
            activeSubTab === 'frame'
              ? 'bg-white dark:bg-zinc-805 text-zinc-900 dark:text-zinc-50 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          <Layout className="h-4 w-4" />
          <span className="hidden sm:inline">Frame CTA</span>
        </button>
      </div>

      {/* Subtab Contents */}
      <div className="space-y-6">
        
        {/* TAB 1: MODULE STYLE */}
        {activeSubTab === 'style' && (
          <div className="space-y-5">
            {/* Dot styles */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Dot Shape (Modules)</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(['square', 'circle', 'rounded', 'diamond', 'star'] as DotStyleType[]).map((style) => (
                  <button
                    key={style}
                    id={`dot-style-${style}`}
                    onClick={() => updateOption('dotStyle', style)}
                    className={`border rounded-xl p-3 text-xs capitalize cursor-pointer transition-all ${
                      options.dotStyle === style
                        ? 'border-zinc-900 dark:border-zinc-200 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold'
                        : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Eye Outer Borders */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Finder Borders (Eye Outer)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['square', 'circle', 'rounded', 'leaf'] as EyeBorderStyleType[]).map((style) => (
                  <button
                    key={style}
                    id={`eye-border-${style}`}
                    onClick={() => updateOption('eyeBorderStyle', style)}
                    className={`border rounded-xl p-2.5 text-xs capitalize cursor-pointer transition-all ${
                      options.eyeBorderStyle === style
                        ? 'border-zinc-900 dark:border-zinc-200 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold'
                        : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Eye pupils */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Eye Center (Pupil Inside)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['square', 'circle', 'diamond', 'leaf'] as EyePupilStyleType[]).map((style) => (
                  <button
                    key={style}
                    id={`eye-pupil-${style}`}
                    onClick={() => updateOption('eyePupilStyle', style)}
                    className={`border rounded-xl p-2.5 text-xs capitalize cursor-pointer transition-all ${
                      options.eyePupilStyle === style
                        ? 'border-zinc-900 dark:border-zinc-200 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold'
                        : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COLOR CONTROLS */}
        {activeSubTab === 'colors' && (
          <div className="space-y-4">
            {/* Main theme options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2 border-b border-zinc-100 dark:border-zinc-900">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Body Solid Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    id="color-picker-body"
                    type="color"
                    value={options.foregroundColor}
                    disabled={options.gradient.enabled}
                    onChange={(e) => updateOption('foregroundColor', e.target.value)}
                    className="h-8 w-11 rounded border border-zinc-300 dark:border-zinc-750 cursor-pointer disabled:opacity-40"
                  />
                  <input
                    type="text"
                    value={options.foregroundColor}
                    disabled={options.gradient.enabled}
                    onChange={(e) => updateOption('foregroundColor', e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 px-2 py-1 text-xs uppercase text-zinc-705 dark:text-zinc-300 focus:outline-none focus:border-zinc-900 font-mono disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Background Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    id="color-picker-bg"
                    type="color"
                    value={options.backgroundColor}
                    disabled={options.backgroundTransparent}
                    onChange={(e) => updateOption('backgroundColor', e.target.value)}
                    className="h-8 w-11 rounded border border-zinc-300 dark:border-zinc-750 cursor-pointer disabled:opacity-40"
                  />
                  <input
                    type="text"
                    value={options.backgroundColor}
                    disabled={options.backgroundTransparent}
                    onChange={(e) => updateOption('backgroundColor', e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 px-2 py-1 text-xs uppercase text-zinc-705 dark:text-zinc-300 focus:outline-none focus:border-zinc-900 font-mono disabled:opacity-40"
                  />
                </div>
              </div>
            </div>

            {/* Gradient options */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                  <input
                    id="checkbox-gradient-enabled"
                    type="checkbox"
                    checked={options.gradient.enabled}
                    onChange={(e) => updateGradient('enabled', e.target.checked)}
                    className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-950 focus:ring-0 h-4 w-4 cursor-pointer"
                  />
                  <span>Enable Custom Color Gradient</span>
                </label>
              </div>

              {options.gradient.enabled && (
                <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl space-y-4 border border-zinc-200/50 dark:border-zinc-850/40">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-medium text-zinc-500">Gradient Start</span>
                      <div className="flex gap-1.5 items-center">
                        <input
                          id="color-gradient-start"
                          type="color"
                          value={options.gradient.colorStart}
                          onChange={(e) => updateGradient('colorStart', e.target.value)}
                          className="h-8 w-10 rounded border cursor-pointer"
                        />
                        <span className="text-xs font-mono">{options.gradient.colorStart}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-medium text-zinc-500">Gradient End</span>
                      <div className="flex gap-1.5 items-center">
                        <input
                          id="color-gradient-end"
                          type="color"
                          value={options.gradient.colorEnd}
                          onChange={(e) => updateGradient('colorEnd', e.target.value)}
                          className="h-8 w-10 rounded border cursor-pointer"
                        />
                        <span className="text-xs font-mono">{options.gradient.colorEnd}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-medium text-zinc-500 block mb-1">Gradient Coordinates (Linear / Radial)</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => updateGradient('type', 'linear')}
                        className={`flex-1 py-1.5 rounded-lg text-xs capitalize ${
                          options.gradient.type === 'linear' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-semibold' : 'bg-white hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        Linear
                      </button>
                      <button
                        type="button"
                        onClick={() => updateGradient('type', 'radial')}
                        className={`flex-1 py-1.5 rounded-lg text-xs capitalize ${
                          options.gradient.type === 'radial' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-semibold' : 'bg-white hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        Radial
                      </button>
                    </div>
                  </div>

                  {options.gradient.type === 'linear' && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-medium">
                        <span className="text-zinc-500">Linear Sweep Angle</span>
                        <span className="font-mono text-zinc-700 dark:text-zinc-300">{options.gradient.angle}°</span>
                      </div>
                      <input
                        id="slider-gradient-angle"
                        type="range"
                        min="0"
                        max="360"
                        step="15"
                        value={options.gradient.angle}
                        onChange={(e) => updateGradient('angle', parseInt(e.target.value))}
                        className="w-full accent-zinc-900 dark:accent-white h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Custom eye colors options */}
            <div className="border-t border-zinc-100 dark:border-zinc-900 pt-4 space-y-3.5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                <input
                  id="checkbox-eye-colors-custom"
                  type="checkbox"
                  checked={options.customEyeColors}
                  onChange={(e) => updateOption('customEyeColors', e.target.checked)}
                  className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-950 focus:ring-0 h-4 w-4"
                />
                <span>Set Custom Colors on Corner Eyes</span>
              </label>

              {options.customEyeColors && (
                <div className="grid grid-cols-2 gap-4 p-3 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-200/50 dark:border-zinc-850/40">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-medium text-zinc-500">Eye Frame Color</span>
                    <input
                      id="color-eye-border"
                      type="color"
                      value={options.eyeBorderColor || options.foregroundColor}
                      onChange={(e) => updateOption('eyeBorderColor', e.target.value)}
                      className="h-8 w-full rounded border cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-medium text-zinc-500">Pupil Inner Color</span>
                    <input
                      id="color-eye-pupil"
                      type="color"
                      value={options.eyePupilColor || options.foregroundColor}
                      onChange={(e) => updateOption('eyePupilColor', e.target.value)}
                      className="h-8 w-full rounded border cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Transparent background options */}
            <div className="border-t border-zinc-100 dark:border-zinc-900 pt-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                <input
                  id="checkbox-bg-transparent"
                  type="checkbox"
                  checked={options.backgroundTransparent}
                  onChange={(e) => updateOption('backgroundTransparent', e.target.checked)}
                  className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-950 focus:ring-0 h-4 w-4"
                />
                <span>Enable Transparent Canvas Background</span>
              </label>
            </div>
          </div>
        )}

        {/* TAB 3: WATERMARX LOGO UPLOAD */}
        {activeSubTab === 'logo' && (
          <div className="space-y-4">
            
            {/* Drag Drop or Upload */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-6 text-center cursor-pointer hover:border-zinc-900 dark:hover:border-zinc-400 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-all flex flex-col items-center justify-center gap-3.5 select-none"
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-650 dark:text-zinc-350">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-semibold block text-zinc-800 dark:text-zinc-205">Click to upload brand logo</span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 block">Supports beautiful PNG, SVG, or JPG (Center square ratio recommended)</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/svg+xml, image/jpeg"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>

            {/* Preconfigured White Label Logo presets */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-2">Try Free Preset Icons</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {presetLogos.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setLogoDataUrl(preset.url)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer text-left transition-all ${
                      logoDataUrl === preset.url ? 'ring-2 ring-zinc-900 dark:ring-zinc-100 bg-zinc-50 dark:bg-zinc-905 font-medium' : ''
                    }`}
                  >
                    <span className="text-base">{preset.icon}</span>
                    <span className="truncate">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Logo Settings adjustments if loaded */}
            {logoDataUrl && (
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-200/50 dark:border-zinc-850/40 gap-4 flex flex-col pt-3">
                
                {/* Active logo badge info with clear */}
                <div className="flex items-center justify-between border-b border-zinc-250 dark:border-zinc-800 pb-2">
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Logo Active</span>
                  <button
                    id="button-clear-logo"
                    type="button"
                    onClick={() => setLogoDataUrl(undefined)}
                    className="text-[11px] text-red-500 hover:text-red-600 underline font-mono cursor-pointer"
                  >
                    Remove Logo
                  </button>
                </div>

                {/* Adjust size */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-zinc-500">
                    <span>Center Logo Scale</span>
                    <span className="font-mono text-zinc-800 dark:text-zinc-200">{options.logoSize}%</span>
                  </div>
                  <input
                    id="slider-logo-size"
                    type="range"
                    min="10"
                    max="30"
                    step="1"
                    value={options.logoSize}
                    onChange={(e) => updateOption('logoSize', parseInt(e.target.value))}
                    className="w-full accent-zinc-900 dark:accent-white h-1.5 bg-zinc-200 dark:bg-zinc-805 rounded-lg cursor-pointer"
                  />
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                    H error-correction is active. Sizes between 15% - 25% maintain optimal rapid scanner speeds.
                  </p>
                </div>

                {/* Shield margin */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    <input
                      id="checkbox-logo-padding"
                      type="checkbox"
                      checked={options.logoPadding}
                      onChange={(e) => updateOption('logoPadding', e.target.checked)}
                      className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-950 focus:ring-0 h-4 w-4"
                    />
                    <span>Add White Padding backing shield (Improves scannability)</span>
                  </label>
                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB 4: FRAME AND CTA */}
        {activeSubTab === 'frame' && (
          <div className="space-y-4">
            
            {/* Frame Style choices */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Select Marketing Frame Layout</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {([
                  { style: 'none', label: 'No Frame' },
                  { style: 'bottom-banner', label: 'Bottom Banner' },
                  { style: 'rounded-card', label: 'Pro Card' },
                  { style: 'elegant', label: 'Elegant Corner' },
                  { style: 'minimal-line', label: 'Sleek Line' }
                ] as { style: FrameStyleType; label: string }[]).map((itm) => (
                  <button
                    key={itm.style}
                    id={`frame-style-${itm.style}`}
                    onClick={() => updateOption('frameStyle', itm.style)}
                    className={`border rounded-xl p-3 text-xs cursor-pointer transition-all ${
                      options.frameStyle === itm.style
                        ? 'border-zinc-900 dark:border-zinc-200 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold'
                        : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-650 dark:text-zinc-400'
                    }`}
                  >
                    {itm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom inputs if frame selected */}
            {options.frameStyle !== 'none' && (
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-200/50 dark:border-zinc-850/40 space-y-4">
                
                {/* CTA text input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-450">Frame CTA Text Lettering</label>
                  <input
                    id="input-frame-cta"
                    type="text"
                    maxLength={22}
                    placeholder="SCAN ME"
                    value={options.frameCtaText || ''}
                    onChange={(e) => updateOption('frameCtaText', e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3.5 py-2.5 text-xs bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 dark:focus:border-zinc-200 text-zinc-900 dark:text-zinc-50 focus:outline-none transition-all uppercase tracking-wide font-sans"
                  />
                  <p className="text-[10.5px] text-zinc-400 font-mono">
                    Keep it short and actionable (e.g. "CONNECT WIFI", "GET DISCOUNT", "CONTACT ME").
                  </p>
                </div>

                {/* Frame Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-zinc-500">Frame Border/Background</span>
                    <div className="flex gap-1.5 items-center">
                      <input
                        id="color-frame"
                        type="color"
                        value={options.frameColor}
                        onChange={(e) => updateOption('frameColor', e.target.value)}
                        className="h-8 w-11 rounded border cursor-pointer bg-white"
                      />
                      <span className="text-xs font-mono uppercase">{options.frameColor}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-zinc-500">CTA Text Color</span>
                    <div className="flex gap-1.5 items-center">
                      <input
                        id="color-frame-text"
                        type="color"
                        value={options.frameTextColor}
                        onChange={(e) => updateOption('frameTextColor', e.target.value)}
                        className="h-8 w-11 rounded border cursor-pointer bg-white"
                      />
                      <span className="text-xs font-mono uppercase">{options.frameTextColor}</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
