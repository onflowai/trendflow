import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import {
  HomeLayout,
  Landing,
  Register,
  Login,
  DashboardLayout,
  EditTrend,
  TrendPage,
  Error,
  AddTrend,
  AllTrends,
  Profile,
  Admin,
  Stats,
} from './pages';

//Function responsible for setting DarkTheme by persisting it in local storage
export const checkDefaultTheme = () => {
  //retrieving the state of the darkTheme to check if it true
  const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
  document.body.classList.toggle('dark-theme', isDarkTheme);
  return isDarkTheme;
};
checkDefaultTheme();

import { action as registerAction } from './pages/Register';
import { action as loginAction } from './pages/Login';
import { loader as dashboardLoader } from './pages/DashboardLayout';
import { action as addTrendAction } from './pages/AddTrend';
import { loader as allTrendsLoader } from './pages/AllTrends';
import { action as editTrendAction } from './pages/EditTrend';
import { loader as editTrendLoader } from './pages/EditTrend';
import { action as deleteTrendAction } from './pages/DeleteTrend';

//Route function (provided by react) contains routs as objects in an array
//which displays what is shown in the url of the page ("/" is a home page)
const router = createBrowserRouter([
  {
    //nesting routs with index route for the landing for "/" path
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: 'register',
        element: <Register />,
        action: registerAction,
      },
      {
        path: 'login',
        element: <Login />,
        action: loginAction,
      },
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        loader: dashboardLoader,
        children: [
          {
            index: true,
            element: <AllTrends />,
            loader: allTrendsLoader,
          },
          {
            path: 'stats',
            element: <Stats />,
          },
          {
            path: 'add-trend',
            element: <AddTrend />,
            action: addTrendAction,
          },
          {
            path: 'admin',
            element: <Admin />,
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'edit-trend/:slug',
            element: <EditTrend />,
            loader: editTrendLoader,
            action: editTrendAction,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  //using RouterProvided and creating instance of router from above
  return <RouterProvider router={router} />;
};

export default App;
