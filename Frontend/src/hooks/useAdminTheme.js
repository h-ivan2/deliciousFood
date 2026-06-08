import { useTheme } from '../context/ThemeContext';

/** Shared light/dark tokens for Super Admin pages */
export function useAdminTheme() {
  const { dark, toggle } = useTheme();

  return {
    dark,
    toggle,
    bg: dark ? '#070B14' : '#f8f5f0',
    sidebarBg: dark ? '#0a0d16' : '#ffffff',
    cardBg: dark ? '#0F1524' : '#ffffff',
    textTitle: dark ? '#ffffff' : '#1a1a1a',
    textSub: dark ? 'rgba(255,255,255,0.6)' : '#666666',
    borderCol: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
    inputBg: dark ? 'rgba(255,255,255,0.05)' : '#ffffff',
    inputBorder: dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
    inputColor: dark ? '#ffffff' : '#1f2937',
    tableOverlay: dark ? 'rgba(15,21,36,0.88)' : 'rgba(255,255,255,0.78)',
    tableHeadBg: dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.85)',
    tableRowHover: dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.65)',
    navInactive: dark ? 'rgba(255,255,255,0.55)' : '#6b7280',
    navHover: dark ? 'rgba(255,255,255,0.06)' : '#f9fafb',
    modalBg: dark ? '#0F1524' : '#ffffff',
    accent: '#F5B301',
  };
}
