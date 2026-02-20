/**
 * Design System Color Tokens
 * Based on the current codebase color scheme (grays and blues)
 */

export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  background: {
    light: '#ffffff',
    dark: '#0a0a0a',
  },
  foreground: {
    light: '#171717',
    dark: '#ededed',
  },
  semantic: {
    success: {
      DEFAULT: '#10b981',
      foreground: '#ffffff',
    },
    error: {
      DEFAULT: '#ef4444',
      foreground: '#ffffff',
    },
    warning: {
      DEFAULT: '#f59e0b',
      foreground: '#ffffff',
    },
    info: {
      DEFAULT: '#3b82f6',
      foreground: '#ffffff',
    },
  },
  border: {
    light: '#e5e5e5',
    dark: '#262626',
  },
  input: {
    light: '#e5e5e5',
    dark: '#262626',
  },
  ring: {
    DEFAULT: '#3b82f6',
  },
  card: {
    DEFAULT: '#ffffff',
    foreground: '#171717',
  },
  popover: {
    DEFAULT: '#ffffff',
    foreground: '#171717',
  },
  muted: {
    DEFAULT: '#f5f5f5',
    foreground: '#737373',
  },
  accent: {
    DEFAULT: '#f5f5f5',
    foreground: '#171717',
  },
  destructive: {
    DEFAULT: '#ef4444',
    foreground: '#ffffff',
  },
} as const;

export type ColorToken = typeof colors;

/**
 * Get color value by path
 */
export function getColorValue(path: string): string {
  const keys = path.split('-');
  let value: any = colors;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return path; // Return original if not found
    }
  }
  
  return typeof value === 'string' ? value : path;
}
