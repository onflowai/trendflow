import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import {
  HomeLayout,
  Landing,
  Register,
  Login,
  DashboardLayout,
  EditTrend,
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
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <AddTrend />,
          },
          {
            path: 'stats',
            element: <Stats />,
          },
          {
            path: 'all-trends',
            element: <AllTrends />,
          },
          {
            path: 'admin',
            element: <Admin />,
          },
          {
            path: 'profile',
            element: <Profile />,
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
