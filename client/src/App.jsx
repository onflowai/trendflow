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
  Blog,
  AddBlog,
  BlogPage,
} from './pages';
import { UserProvider } from './context/UserContext.jsx';
/**
 * using React Router v6 from React 18 to utilize 'action' property allows you to specify an action function to be executed before rendering the corresponding component.
 * 'loader' property allows you to specify a loader function that fetches data asynchronously before rendering the corresponding component
 * @returns
 */
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
import { loader as singleTrendLoader } from './pages/TrendPage';
import { loader as allTrendAdminLoader } from './pages/Admin';
import { action as profileAction } from './pages/Profile';
import { loader as getUserSavedTrends } from './pages/Profile';
import { loader as blogLoader } from './pages/Blog';
import { loader as singleBlogLoader } from './pages/BlogPage';

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
            path: 'blog',
            element: <Blog />,
            loader: blogLoader,
          },
          {
            path: 'create-blog',
            element: <AddBlog />,
          },
          {
            path: 'blog/:slug',
            element: <BlogPage />,
            loader: singleBlogLoader,
          },
          {
            path: 'submit',
            element: <AddTrend />,
            action: addTrendAction,
          },
          {
            path: 'admin',
            element: <Admin />,
            loader: allTrendAdminLoader,
          },
          {
            path: 'profile',
            element: <Profile />,
            action: profileAction,
            loader: getUserSavedTrends,
          },
          {
            path: 'edit-trend/:slug',
            element: <EditTrend />,
            loader: editTrendLoader,
            action: editTrendAction,
          },
          {
            path: 'trend/:slug',
            element: <TrendPage />,
            loader: singleTrendLoader,
          },
        ],
      },
    ],
  },
]);

// const App = () => {
//   //using RouterProvided and creating instance of router from above
//   return <RouterProvider router={router} />;
// };
const App = () => {
  //using RouterProvided and creating instance of router from above
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
};

export default App;
