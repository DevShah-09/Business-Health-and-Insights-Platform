import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Receipt, 
  BarChart3, 
  BrainCircuit, 
  TrendingUp, 
  SlidersHorizontal,
  HelpCircle,
  LogOut
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/',            label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/transactions',label: 'Transactions', icon: Receipt },
  { to: '/financials',  label: 'Analytics',    icon: BarChart3 },
  { to: '/insights',    label: 'AI Insights',  icon: BrainCircuit },
  { to: '/forecast',    label: 'Forecast',     icon: TrendingUp },
  { to: '/simulation',  label: 'Simulation',   icon: SlidersHorizontal },
];

export function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="h-screen w-64 shrink-0 overflow-y-auto z-50 bg-surface flex flex-col p-4 gap-2 border-r border-surface-border/50 transition-colors">
      <div className="flex items-center gap-3 px-2 py-4 mb-6">
        <div className="w-10 h-10 bg-brand flex items-center justify-center rounded-xl shadow-lg shadow-brand/20">
          <Receipt className="text-white" size={24} />
        </div>
        <div>
          <h1 className="font-headline text-xl font-bold text-surface-foreground italic">Vyapar IQ</h1>
          <p className="text-[10px] uppercase tracking-widest text-surface-muted-foreground font-bold">Intelligence Platform</p>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-all duration-300 ease-in-out ${
                isActive
                  ? 'bg-brand/10 text-brand shadow-sm'
                  : 'text-surface-muted-foreground font-medium hover:bg-surface-muted hover:text-surface-foreground'
              }`
            }
          >
            <Icon size={20} />
            <span className="font-sans text-sm">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-surface-border/50 space-y-1">
        <a className="flex items-center gap-3 px-4 py-3 text-surface-muted-foreground font-medium hover:bg-surface-muted hover:text-surface-foreground rounded-xl transition-all duration-300 ease-in-out cursor-pointer group">
          <HelpCircle size={20} className="group-hover:text-brand transition-colors" />
          <span className="font-sans text-sm">Help Center</span>
        </a>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-surface-muted-foreground font-medium hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all duration-300 ease-in-out cursor-pointer group"
        >
          <LogOut size={20} className="group-hover:text-red-500 transition-colors" />
          <span className="font-sans text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
