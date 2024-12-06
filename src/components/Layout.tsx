import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from '../lib/theme';
import { useEffect } from 'react';

export default function Layout() {
  const { theme } = useTheme();

  useEffect(() => {
    // Apply theme to root element
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 overflow-auto bg-gray-50 dark:bg-[#1e1e1e]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}