/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { QR_TEMPLATES } from '../data/templates';
import { QRStyleOptions, QRTemplate } from '../types';

interface TemplatesGridProps {
  activeTemplateId: string | null;
  onSelectTemplate: (template: QRTemplate) => void;
}

export function TemplatesGrid({ activeTemplateId, onSelectTemplate }: TemplatesGridProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
            Quick Templates Preset
          </h2>
          <p className="text-[11.5px] text-zinc-500 mt-1">
            Apply instant professional coordinate layouts, color gradients, and frames.
          </p>
        </div>
      </div>

      {/* Grid of 12 templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {QR_TEMPLATES.map((tpl) => {
          // Dynamic icon resolver
          const IconComponent = (LucideIcons as any)[tpl.icon] || LucideIcons.QrCode;
          const isActive = activeTemplateId === tpl.id;

          return (
            <button
              key={tpl.id}
              id={`template-select-${tpl.id}`}
              onClick={() => onSelectTemplate(tpl)}
              className={`flex flex-col items-start text-left p-4 rounded-xl border cursor-pointer transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 ${
                isActive
                  ? 'border-zinc-950 dark:border-white bg-zinc-950/5 dark:bg-white/5 ring-1 ring-zinc-950 dark:ring-white'
                  : 'border-zinc-150 dark:border-zinc-850 bg-white dark:bg-zinc-950'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className={`p-2 rounded-lg ${isActive ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-905 text-zinc-650 dark:text-zinc-400'}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <span className={`px-2 py-0.5 text-[9.5px] font-mono rounded-full ${tpl.tagColor}`}>
                  Preset
                </span>
              </div>
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                {tpl.name}
              </h3>
              <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed">
                {tpl.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
