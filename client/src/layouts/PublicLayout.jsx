import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  //console.log('SSR Debug => PublicLayout rendered');
  return (
    <div>
      {/* public routes */}
      <Outlet />
    </div>
  );
};

export default PublicLayout;
