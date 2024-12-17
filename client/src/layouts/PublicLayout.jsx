import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div>
      {/* public routes */}
      <Outlet />
    </div>
  );
};

export default PublicLayout;
