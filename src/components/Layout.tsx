
import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen pb-16">
      <Outlet />
      <BottomNav />
    </div>
  );
};

export default Layout;
