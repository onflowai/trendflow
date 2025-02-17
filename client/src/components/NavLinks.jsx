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
  return (
    <div>
      <div className="nav-links">
        {dashboardAllLinks.map((link) => {
          const { text, path } = link;
          const { role } = user;
          if (path === 'admin' && role !== 'admin') return;
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
