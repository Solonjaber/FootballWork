
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Users, SoccerBall, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { path: '/', label: 'Jogadores', icon: Users },
    { path: '/gerar-times', label: 'Gerar Times', icon: SoccerBall },
    { path: '/historico', label: 'Histórico', icon: BarChart2 },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t h-16 flex items-center justify-around z-10">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              'flex flex-col items-center justify-center w-1/3 h-full transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <item.icon size={20} className="mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
