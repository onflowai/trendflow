import React, { createContext, useContext, useState, useEffect } from 'react';
import { Outlet, redirect, useLoaderData, useNavigate } from 'react-router-dom';
import Container from '../assets/wrappers/DashboardContainer';
import { SidebarSmall, Sidebar, Navbar, CustomErrorToast } from '../components';
import { checkDefaultTheme } from '../App';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

/**
 * Dashboard Layout takes on components and sets up the layout. NOTE loader is used.
 * Loader allows to preload data to the route before it renders in this case user which we fetch
 * from the backend. Outlet is then used to pass
 * @returns
 * React Router: user, sidebar (theme). User should be coming from a server
 */
export const loader = async () => {
  try {
    const { data } = await customFetch.get('/users/current-user'); //return data has user and stats
    return data; //returning data from get containing user
  } catch (error) {
    return redirect('/'); //if backend does not return user redirect home
  }
}; //this is where data which you want to be preloaded is passed

const DashboardContext = createContext(); // setting up context for SidebarSmall and Sidebar

const DashboardLayout = () => {
  const { user, stats } = useLoaderData(); //passing the user data from loader
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [userToggled, setUserToggled] = useState(false);
  const setSidebarVisibility = (visible) => {
    if (!userToggled) {
      setShowSidebar(visible); // only auto-adjusts if the user hasn't manually toggled
    }
  }; // control the sidebar for TrendPage
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.matchMedia('(max-width: 992px)').matches;
      if (!userToggled) {
        setShowSidebar(!isMobile); // with respect to users toggle
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [userToggled]); // dependency on userToggled to reset when user manually toggles
  const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme);
  //function responsible for setting the dark theme
  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme; //newDarkTheme is opposite of isDarkTheme
    setIsDarkTheme(newDarkTheme); //passing it to set
    document.body.classList.toggle('dark-theme', newDarkTheme); //targeting body with toggle('class', boolean)
    localStorage.setItem('darkTheme', newDarkTheme); //storing new value darkTheme as newDarkTheme
  };
  //setting the sidebar equal to opposite of showSidebar
  const toggleSidebar = () => {
    setShowSidebar((prevState) => !prevState);
    setUserToggled(true); // indicates manual toggle
  };

  //async function which will connect to the server
  const logoutUser = async () => {
    navigate('/'); //THIS NEEDS TO BE CHANGED
    await customFetch.get('/auth/logout');
    toast.success(<CustomErrorToast message={'Logging Out'} />);
  };

  //RETURN -------------------------- RETURN
  return (
    <DashboardContext.Provider
      value={{
        user,
        showSidebar,
        isDarkTheme,
        toggleSidebar,
        toggleDarkTheme,
        logoutUser,
        setSidebarVisibility,
      }}
    >
      <Container>
        <main className="dashboard">
          <SidebarSmall />
          <Sidebar />
          <div>
            <Navbar />
            <div className="dashboard-page">
              <Outlet context={{ user, stats }} />
            </div>
          </div>
        </main>
      </Container>
    </DashboardContext.Provider>
  );
};

//exporting as a custom hook which passes the main context
export const useDashboardContext = () => useContext(DashboardContext);

export default DashboardLayout;
