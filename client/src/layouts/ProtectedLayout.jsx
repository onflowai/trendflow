import React from 'react';
import { Outlet } from 'react-router-dom';

const ProtectedLayout = () => {
  return (
    <div>
      {/* protected routes */}
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;
