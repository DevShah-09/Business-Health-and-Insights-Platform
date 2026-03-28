import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Sun, Moon, Bell, Settings } from 'lucide-react';

export function TopBar() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      setIsDark(true);
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="bg-surface/80 backdrop-blur-xl sticky top-0 z-40 flex justify-end items-center px-8 py-4 w-full border-b border-surface-border/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface transition-colors text-surface-muted-foreground" title="Toggle Dark Mode">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button 
          onClick={() => navigate('/profile')}
          className="p-2 rounded-full hover:bg-surface transition-colors text-surface-muted-foreground"
          title="Profile Settings"
        >
          <Settings size={20} />
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-surface-border/50">
          <div className="text-right">
            <p className="text-sm font-bold text-surface-foreground">{user?.name || 'Guest User'}</p>
            <p className="text-[10px] text-surface-muted-foreground uppercase font-bold">Business Owner</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-brand/20">
            {getInitials(user?.name)}
          </div>
          
          <button 
            onClick={logout}
            className="ml-2 p-2 rounded-lg hover:bg-red-500/10 text-surface-muted-foreground hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
