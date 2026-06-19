/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QRTemplate } from '../types';

export const QR_TEMPLATES: QRTemplate[] = [
  {
    id: 'minimal-black',
    name: 'Minimal Black',
    description: 'Ultra-pure, essential black & white design inspired by Swiss layouts.',
    tagColor: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100',
    icon: 'QrCode',
    styleOptions: {
      dotStyle: 'square',
      eyeBorderStyle: 'square',
      eyePupilStyle: 'square',
      foregroundColor: '#000000',
      backgroundColor: '#ffffff',
      backgroundTransparent: false,
      gradient: {
        enabled: false,
        type: 'linear',
        colorStart: '#000000',
        colorEnd: '#333333',
        angle: 90
      },
      customEyeColors: false,
      frameStyle: 'none',
      frameCtaText: 'SCAN ME'
    }
  },
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    description: 'Clean, professional blue with smooth aesthetic rounded modules.',
    tagColor: 'bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200',
    icon: 'Sparkles',
    styleOptions: {
      dotStyle: 'rounded',
      eyeBorderStyle: 'rounded',
      eyePupilStyle: 'circle',
      foregroundColor: '#2563eb',
      backgroundColor: '#f8fafc',
      backgroundTransparent: false,
      gradient: {
        enabled: false,
        type: 'linear',
        colorStart: '#2563eb',
        colorEnd: '#1d4ed8',
        angle: 45
      },
      customEyeColors: true,
      eyeBorderColor: '#1d4ed8',
      eyePupilColor: '#2563eb',
      frameStyle: 'minimal-line',
      frameColor: '#2563eb',
      frameTextColor: '#2563eb',
      frameCtaText: 'LATEST DEMO'
    }
  },
  {
    id: 'corporate-pro',
    name: 'Corporate Pro',
    description: 'Sophisticated professional slate with elegant rounded corners.',
    tagColor: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100',
    icon: 'Briefcase',
    styleOptions: {
      dotStyle: 'rounded',
      eyeBorderStyle: 'rounded',
      eyePupilStyle: 'square',
      foregroundColor: '#1e293b',
      backgroundColor: '#ffffff',
      backgroundTransparent: false,
      gradient: {
        enabled: true,
        type: 'linear',
        colorStart: '#0f172a',
        colorEnd: '#334155',
        angle: 135
      },
      customEyeColors: false,
      frameStyle: 'rounded-card',
      frameColor: '#0f172a',
      frameTextColor: '#ffffff',
      frameCtaText: 'CONNECT CARD'
    }
  },
  {
    id: 'whatsapp-green',
    name: 'WhatsApp Green',
    description: 'Instantly recognizable green, optimized for messaging invites.',
    tagColor: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200',
    icon: 'MessageSquare',
    styleOptions: {
      dotStyle: 'rounded',
      eyeBorderStyle: 'circle',
      eyePupilStyle: 'circle',
      foregroundColor: '#16a34a',
      backgroundColor: '#ffffff',
      backgroundTransparent: false,
      gradient: {
        enabled: false,
        type: 'linear',
        colorStart: '#16a34a',
        colorEnd: '#15803d',
        angle: 90
      },
      customEyeColors: true,
      eyeBorderColor: '#15803d',
      eyePupilColor: '#16a34a',
      frameStyle: 'bottom-banner',
      frameColor: '#16a34a',
      frameTextColor: '#ffffff',
      frameCtaText: 'CHAT SECURELY'
    }
  },
  {
    id: 'instagram-gradient',
    name: 'Instagram Gradient',
    description: 'Striking purple-to-orange gradient, perfect for influencer profiles.',
    tagColor: 'bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-pink-200',
    icon: 'Instagram',
    styleOptions: {
      dotStyle: 'circle',
      eyeBorderStyle: 'circle',
      eyePupilStyle: 'circle',
      foregroundColor: '#d946ef',
      backgroundColor: '#ffffff',
      backgroundTransparent: false,
      gradient: {
        enabled: true,
        type: 'linear',
        colorStart: '#8b5cf6',
        colorEnd: '#ec4899',
        angle: 45
      },
      customEyeColors: false,
      frameStyle: 'bottom-banner',
      frameColor: '#ec4899',
      frameTextColor: '#ffffff',
      frameCtaText: 'FOLLOW PROFILE'
    }
  },
  {
    id: 'youtube-red',
    name: 'YouTube Red',
    description: 'Vibrant, high-contrast red built for video content links.',
    tagColor: 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200',
    icon: 'Youtube',
    styleOptions: {
      dotStyle: 'square',
      eyeBorderStyle: 'leaf',
      eyePupilStyle: 'circle',
      foregroundColor: '#dc2626',
      backgroundColor: '#ffffff',
      backgroundTransparent: false,
      gradient: {
        enabled: false,
        type: 'linear',
        colorStart: '#dc2626',
        colorEnd: '#b91c1c',
        angle: 90
      },
      customEyeColors: true,
      eyeBorderColor: '#dc2626',
      eyePupilColor: '#b91c1c',
      frameStyle: 'bottom-banner',
      frameColor: '#dc2626',
      frameTextColor: '#ffffff',
      frameCtaText: 'WATCH VIDEO'
    }
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    description: 'Golden champagne gradient on royal obsidian backgrounds.',
    tagColor: 'bg-amber-100/50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200',
    icon: 'Crown',
    styleOptions: {
      dotStyle: 'diamond',
      eyeBorderStyle: 'square',
      eyePupilStyle: 'diamond',
      foregroundColor: '#cca43b',
      backgroundColor: '#111827',
      backgroundTransparent: false,
      gradient: {
        enabled: true,
        type: 'linear',
        colorStart: '#cca43b',
        colorEnd: '#ebd690',
        angle: 135
      },
      customEyeColors: true,
      eyeBorderColor: '#ebd690',
      eyePupilColor: '#cca43b',
      frameStyle: 'elegant',
      frameColor: '#cca43b',
      frameTextColor: '#cca43b',
      frameCtaText: 'VIP PORTAL'
    }
  },
  {
    id: 'wedding-elegant',
    name: 'Wedding Elegant',
    description: 'Soft champagne-gold tones with delicate vine corner brackets.',
    tagColor: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200',
    icon: 'Heart',
    styleOptions: {
      dotStyle: 'rounded',
      eyeBorderStyle: 'leaf',
      eyePupilStyle: 'leaf',
      foregroundColor: '#be9b7b',
      backgroundColor: '#fffdfa',
      backgroundTransparent: false,
      gradient: {
        enabled: false,
        type: 'linear',
        colorStart: '#be9b7b',
        colorEnd: '#855845',
        angle: 90
      },
      customEyeColors: false,
      frameStyle: 'elegant',
      frameColor: '#be9b7b',
      frameTextColor: '#855845',
      frameCtaText: 'OUR STORY'
    }
  },
  {
    id: 'restaurant-menu',
    name: 'Restaurant Menu',
    description: 'Warm terracotta palette designed to trigger appetizing appeal.',
    tagColor: 'bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-200',
    icon: 'Utensils',
    styleOptions: {
      dotStyle: 'rounded',
      eyeBorderStyle: 'rounded',
      eyePupilStyle: 'circle',
      foregroundColor: '#ea580c',
      backgroundColor: '#fffbeb',
      backgroundTransparent: false,
      gradient: {
        enabled: true,
        type: 'linear',
        colorStart: '#c2410c',
        colorEnd: '#ea580c',
        angle: 45
      },
      customEyeColors: false,
      frameStyle: 'bottom-banner',
      frameColor: '#ea580c',
      frameTextColor: '#ffffff',
      frameCtaText: 'VIEW THE MENU'
    }
  },
  {
    id: 'event-ticket',
    name: 'Event Ticket',
    description: 'Electric violet palette optimized for high-energy concerts.',
    tagColor: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-200',
    icon: 'Ticket',
    styleOptions: {
      dotStyle: 'star',
      eyeBorderStyle: 'circle',
      eyePupilStyle: 'diamond',
      foregroundColor: '#6366f1',
      backgroundColor: '#ffffff',
      backgroundTransparent: false,
      gradient: {
        enabled: true,
        type: 'linear',
        colorStart: '#4f46e5',
        colorEnd: '#9333ea',
        angle: 135
      },
      customEyeColors: false,
      frameStyle: 'rounded-card',
      frameColor: '#4f46e5',
      frameTextColor: '#ffffff',
      frameCtaText: 'TICKET PASS'
    }
  },
  {
    id: 'portfolio-creator',
    name: 'Portfolio Creator',
    description: 'Striking professional teal with sleek minimalistic tech outline.',
    tagColor: 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200',
    icon: 'FolderGit',
    styleOptions: {
      dotStyle: 'square',
      eyeBorderStyle: 'rounded',
      eyePupilStyle: 'square',
      foregroundColor: '#0d9488',
      backgroundColor: '#ffffff',
      backgroundTransparent: false,
      gradient: {
        enabled: false,
        type: 'linear',
        colorStart: '#0d9488',
        colorEnd: '#0f766e',
        angle: 90
      },
      customEyeColors: true,
      eyeBorderColor: '#0f766e',
      eyePupilColor: '#0d9488',
      frameStyle: 'minimal-line',
      frameColor: '#0d9488',
      frameTextColor: '#0d9488',
      frameCtaText: 'MY PORTFOLIO'
    }
  },
  {
    id: 'business-card',
    name: 'Business Card',
    description: 'Luxury corporate charcoal-platinum gradient with contacts CTA.',
    tagColor: 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100',
    icon: 'UserPlus',
    styleOptions: {
      dotStyle: 'circle',
      eyeBorderStyle: 'square',
      eyePupilStyle: 'circle',
      foregroundColor: '#27272a',
      backgroundColor: '#f4f4f5',
      backgroundTransparent: false,
      gradient: {
        enabled: true,
        type: 'linear',
        colorStart: '#09090b',
        colorEnd: '#52525b',
        angle: 90
      },
      customEyeColors: false,
      frameStyle: 'rounded-card',
      frameColor: '#18181b',
      frameTextColor: '#ffffff',
      frameCtaText: 'ADD CONTACT'
    }
  }
];
