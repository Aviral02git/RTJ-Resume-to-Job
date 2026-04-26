'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'light',
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeCtx);
}

function applyTheme(t: Theme) {
  const root = document.documentElement;
  if (t === 'dark') {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read stored or system preference
    const stored = localStorage.getItem('careermatch-theme') as Theme | null;
    const sys: Theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const resolved: Theme = stored ?? sys;
    setTheme(resolved);
    applyTheme(resolved);
    setMounted(true);
  }, []);

  const toggle = () => {
    setTheme(prev => {
      const next: Theme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('careermatch-theme', next);
      applyTheme(next);
      return next;
    });
  };

  // Render children always — theme is applied via class on <html>
  return (
    <ThemeCtx.Provider value={{ theme: mounted ? theme : 'light', toggle }}>
      {children}
    </ThemeCtx.Provider>
  );
}
