import React from 'react';
import { useDashboardContext } from '../pages/DashboardLayout';
import { dashboardAllLinks } from '../assets/utils/data';
import { NavLink } from 'react-router-dom';
/**
 * This component is used in both SidebarOverlay and Sidebar to show links
 * Because of the 'end' prop in <NavLink> to use toggle the active class
 * isSidebar is passed from Sidebar.jsx in NavLinks if it is true
 * @param {*} param0
 * @returns
 */
const NavLinks = ({ isSidebar }) => {
  const { toggleSidebar, user } = useDashboardContext() || {};
  const role = user?.role;
  const isAdminRole = role === 'admin' || role === 'superAdmin';
  return (
    <div>
      <div className="nav-links">
        {dashboardAllLinks.map((link) => {
          const { text, path } = link;
          if (path === 'admin' && !isAdminRole) return null;
          return (
            <NavLink
              to={path}
              key={text}
              className="nav-link"
              onClick={isSidebar ? toggleSidebar : null}
              end
            >
              {text}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default NavLinks;
