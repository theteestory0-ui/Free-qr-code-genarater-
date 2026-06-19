/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type QRContentType = 'url' | 'text' | 'phone' | 'email' | 'whatsapp' | 'wifi' | 'social';

export type DotStyleType = 'square' | 'circle' | 'rounded' | 'diamond' | 'star';
export type EyeBorderStyleType = 'square' | 'circle' | 'rounded' | 'leaf';
export type EyePupilStyleType = 'square' | 'circle' | 'diamond' | 'leaf';
export type FrameStyleType = 'none' | 'bottom-banner' | 'elegant' | 'minimal-line' | 'rounded-card';

export interface GradientConfig {
  enabled: boolean;
  type: 'linear' | 'radial';
  colorStart: string;
  colorEnd: string;
  angle: number; // For linear: 0, 45, 90, 135, etc.
}

export interface QRStyleOptions {
  dotStyle: DotStyleType;
  eyeBorderStyle: EyeBorderStyleType;
  eyePupilStyle: EyePupilStyleType;
  
  // Colors
  foregroundColor: string;
  backgroundColor: string;
  backgroundTransparent: boolean;
  gradient: GradientConfig;
  
  // Custom eye colors toggling
  customEyeColors: boolean;
  eyeBorderColor?: string;
  eyePupilColor?: string;
  
  // Logo settings
  logoUrl?: string; // base64, external URL or objectURL
  logoSize: number; // percent 10 to 30
  logoPadding: boolean; // add white backing
  
  // Frame custom settings
  frameStyle: FrameStyleType;
  frameColor: string;
  frameTextColor: string;
  frameCtaText: string;
  
  // Size setting
  size: number; // export resolution e.g. 512, 1024, 2048
}

export interface QRTemplate {
  id: string;
  name: string;
  description: string;
  styleOptions: Partial<QRStyleOptions>;
  icon: string; // lucide icon name or emoji representation
  tagColor: string;
}

export interface BrandSettings {
  brandName: string;
  headerLogoSymbol: string; // Lucide icon or text symbol
  faviconUrl?: string;
  whiteLabelMode: boolean;
}

// Content definitions
export interface WifiContent {
  ssid: string;
  password?: string;
  encryption: 'WEP' | 'WPA' | 'nopass';
  hidden: boolean;
}

export interface EmailContent {
  to: string;
  subject?: string;
  body?: string;
}

export interface WhatsappContent {
  phone: string;
  message?: string;
}

export interface SocialContent {
  platform: 'instagram' | 'twitter' | 'youtube' | 'linkedin' | 'facebook' | 'tiktok';
  username: string;
}
