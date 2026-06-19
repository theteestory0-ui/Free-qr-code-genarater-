/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Globe, FileText, Phone, Mail, MessageCircle, Wifi, Share2, Eye, EyeOff } from 'lucide-react';
import { QRContentType } from '../types';

interface QRGeneratorFormProps {
  activeType: QRContentType;
  setActiveType: (type: QRContentType) => void;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export function QRGeneratorForm({ activeType, setActiveType, formData, setFormData }: QRGeneratorFormProps) {
  const [showWifiPass, setShowWifiPass] = React.useState(false);

  // Content configuration selectors
  const typesList: { id: QRContentType; label: string; icon: any }[] = [
    { id: 'url', label: 'Website', icon: Globe },
    { id: 'text', label: 'Text', icon: FileText },
    { id: 'phone', label: 'Phone', icon: Phone },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { id: 'wifi', label: 'WiFi Network', icon: Wifi },
    { id: 'social', label: 'Social Profile', icon: Share2 },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [activeType]: {
        ...prev[activeType],
        [field]: value
      }
    }));
  };

  const activeData = formData[activeType] || {};

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider mb-4">
        1. Select QR Code Type
      </h2>

      {/* Tabs list with horizontal scroll if needed */}
      <div className="flex flex-wrap gap-2 mb-6">
        {typesList.map((type) => {
          const Icon = type.icon;
          const isActive = activeType === type.id;
          return (
            <button
              key={type.id}
              id={`tab-select-${type.id}`}
              onClick={() => setActiveType(type.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-semibold'
                  : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/55 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-150 dark:border-zinc-850'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{type.label}</span>
            </button>
          );
        })}
      </div>

      <div className="h-px bg-zinc-100 dark:bg-zinc-850 mb-6" />

      {/* Dynamic Content Forms */}
      <div className="space-y-4">
        {activeType === 'url' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Website Address</label>
            <div className="flex rounded-xl border border-zinc-200 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-zinc-900/10 focus-within:border-zinc-900 dark:focus-within:border-zinc-200 overflow-hidden bg-zinc-50/20">
              <span className="flex items-center bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 px-3.5 text-xs font-mono text-zinc-400 select-none">
                https://
              </span>
              <input
                id="input-url"
                type="text"
                placeholder="domain.com/path-details"
                value={activeData.url?.replace(/^https?:\/\//, '') || ''}
                onChange={(e) => {
                  const val = e.target.value ? `https://${e.target.value.trim()}` : '';
                  handleInputChange('url', val);
                }}
                className="w-full bg-transparent px-3.5 py-3 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none"
              />
            </div>
            <p className="text-[10.5px] text-zinc-400 dark:text-zinc-500 font-mono">
              Static URL QR codes are permanent. Make sure the linked link has correct spellings.
            </p>
          </div>
        )}

        {activeType === 'text' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Custom Text / Message</label>
            <textarea
              id="input-text"
              rows={4}
              placeholder="Write plain text, details, serial key, or promotional codes here..."
              value={activeData.text || ''}
              onChange={(e) => handleInputChange('text', e.target.value)}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3.5 py-3 text-xs bg-zinc-50/10 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 dark:focus:border-zinc-200 text-zinc-900 dark:text-zinc-50 focus:outline-none transition-all"
            />
          </div>
        )}

        {activeType === 'phone' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Phone Number</label>
            <input
              id="input-phone"
              type="tel"
              placeholder="+1 (555) 012-3456"
              value={activeData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3.5 py-3 text-xs bg-zinc-50/10 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 dark:focus:border-zinc-200 text-zinc-900 dark:text-zinc-50 focus:outline-none transition-all font-mono"
            />
            <p className="text-[10.5px] text-zinc-450 dark:text-zinc-500">
              Include country code (e.g. +1 for USA, +44 for UK) to secure immediate calling.
            </p>
          </div>
        )}

        {activeType === 'email' && (
          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Recipient Email (To)</label>
              <input
                id="input-email-to"
                type="email"
                placeholder="partner@company.com"
                value={activeData.to || ''}
                onChange={(e) => handleInputChange('to', e.target.value)}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3.5 py-3 text-xs bg-zinc-50/10 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 dark:focus:border-zinc-200 text-zinc-900 dark:text-zinc-50 focus:outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Subject (Optional)</label>
                <input
                  id="input-email-subj"
                  type="text"
                  placeholder="Inquiry or Feedback"
                  value={activeData.subject || ''}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3.5 py-3 text-xs bg-zinc-50/10 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 dark:focus:border-zinc-200 text-zinc-900 dark:text-zinc-50 focus:outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Preset Body (Optional)</label>
                <input
                  id="input-email-body"
                  type="text"
                  placeholder="Hello, I am interested in..."
                  value={activeData.body || ''}
                  onChange={(e) => handleInputChange('body', e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3.5 py-3 text-xs bg-zinc-50/10 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 dark:focus:border-zinc-200 text-zinc-900 dark:text-zinc-50 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {activeType === 'whatsapp' && (
          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">WhatsApp Phone Number</label>
              <input
                id="input-wa-phone"
                type="tel"
                placeholder="+15550123456"
                value={activeData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3.5 py-3 text-xs bg-zinc-50/10 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 dark:focus:border-zinc-200 text-zinc-900 dark:text-zinc-50 focus:outline-none transition-all font-mono"
              />
              <p className="text-[10.5px] text-zinc-450 dark:text-zinc-500">
                Write country code + phone without spaces, dashes or plus signs (e.g. 15550123456).
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Prefilled Message (Optional)</label>
              <textarea
                id="input-wa-msg"
                rows={2}
                placeholder="Send a pre-filled welcome text when users scan and contact..."
                value={activeData.message || ''}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3.5 py-2.5 text-xs bg-zinc-50/10 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 dark:focus:border-zinc-200 text-zinc-900 dark:text-zinc-50 focus:outline-none transition-all"
              />
            </div>
          </div>
        )}

        {activeType === 'wifi' && (
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Network Name (SSID)</label>
              <input
                id="input-wifi-ssid"
                type="text"
                placeholder="Enterprise_Staff_5G"
                value={activeData.ssid || ''}
                onChange={(e) => handleInputChange('ssid', e.target.value)}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3.5 py-3 text-xs bg-zinc-50/10 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 dark:focus:border-zinc-200 text-zinc-900 dark:text-zinc-50 focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Encryption / Security</label>
              <select
                id="select-wifi-enc"
                value={activeData.encryption || 'WPA'}
                onChange={(e) => handleInputChange('encryption', e.target.value)}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-3 text-xs bg-zinc-50/10 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 dark:focus:border-zinc-200 text-zinc-900 dark:text-zinc-50 focus:outline-none transition-all cursor-pointer"
              >
                <option value="WPA">WPA/WPA2 Professional (Default)</option>
                <option value="WEP">WEP Legacy</option>
                <option value="nopass">Unsecured / Public Network</option>
              </select>
            </div>

            {activeData.encryption !== 'nopass' && (
              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 font-sans">Network Password</label>
                <div className="relative flex rounded-xl border border-zinc-200 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-zinc-900/10 focus-within:border-zinc-900 dark:focus-within:border-zinc-200 overflow-hidden bg-zinc-50/10">
                  <input
                    id="input-wifi-pass"
                    type={showWifiPass ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={activeData.password || ''}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full bg-transparent px-3.5 py-3 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowWifiPass(!showWifiPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650"
                  >
                    {showWifiPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            <div className="col-span-2 pt-1">
              <label className="flex items-center gap-2 select-none cursor-pointer text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                <input
                  id="checkbox-wifi-hid"
                  type="checkbox"
                  checked={activeData.hidden || false}
                  onChange={(e) => handleInputChange('hidden', e.target.checked)}
                  className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-950 focus:ring-0 h-4 w-4"
                />
                <span>This is a hidden network (SSID broadcast is disabled on router)</span>
              </label>
            </div>
          </div>
        )}

        {activeType === 'social' && (
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Platform</label>
              <select
                id="select-social-plat"
                value={activeData.platform || 'instagram'}
                onChange={(e) => handleInputChange('platform', e.target.value)}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-3 text-xs bg-zinc-50/10 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 dark:focus:border-zinc-200 text-zinc-900 dark:text-zinc-50 focus:outline-none transition-all cursor-pointer font-sans"
              >
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter / X</option>
                <option value="youtube">YouTube</option>
                <option value="linkedin">LinkedIn</option>
                <option value="facebook">Facebook</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Username / Path</label>
              <div className="relative flex rounded-xl border border-zinc-200 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-zinc-900/10 focus-within:border-zinc-900 dark:focus-within:border-zinc-200 overflow-hidden bg-zinc-50/10">
                <span className="flex items-center bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 px-3 text-xs font-mono text-zinc-400 select-none">
                  @
                </span>
                <input
                  id="input-social-user"
                  type="text"
                  placeholder="username"
                  value={activeData.username || ''}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full bg-transparent px-3.5 py-3 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="col-span-2">
              <p className="text-[11px] text-zinc-450 dark:text-zinc-500 font-mono italic">
                Resulting link: 
                <span className="ml-1.5 text-zinc-900 dark:text-zinc-100 font-medium select-all">
                  {activeData.platform === 'youtube' && `https://youtube.com/@${activeData.username || 'username'}`}
                  {activeData.platform === 'instagram' && `https://instagram.com/${activeData.username || 'username'}`}
                  {activeData.platform === 'twitter' && `https://x.com/${activeData.username || 'username'}`}
                  {activeData.platform === 'linkedin' && `https://linkedin.com/in/${activeData.username || 'username'}`}
                  {activeData.platform === 'facebook' && `https://facebook.com/${activeData.username || 'username'}`}
                  {activeData.platform === 'tiktok' && `https://tiktok.com/@${activeData.username || 'username'}`}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
