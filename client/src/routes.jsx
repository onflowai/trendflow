import {
  Blog,
  Admin,
  Error,
  Login,
  Profile,
  AddBlog,
  Landing,
  Register,
  AddTrend,
  BlogPage,
  Settings,
  EditTrend,
  TrendPage,
  AllTrends,
  LandingBlog,
  LandingBlogPage,
  DashboardLayout,
  LandingEmailVerify,
} from './pages/index.js';

import { UserProvider } from './context/UserContext.jsx';
import PublicLayout from './layouts/PublicLayout.jsx'; // layout for public routes
import ProtectedLayout from './layouts/ProtectedLayout.jsx'; // layout for protected routes

import { action as registerAction } from './pages/Register.jsx';
import { action as loginAction } from './pages/Login.jsx';
import { loader as dashboardLoader } from './pages/DashboardLayout.jsx';
import { action as addTrendAction } from './pages/AddTrend.jsx';
import { loader as allTrendsLoader } from './pages/AllTrends.jsx';
import { action as editTrendAction } from './pages/EditTrend.jsx';
import { loader as editTrendLoader } from './pages/EditTrend.jsx';
import { loader as singleTrendLoader } from './pages/TrendPage.jsx';
import { loader as allTrendAdminLoader } from './pages/Admin.jsx';
import { action as profileAction } from './pages/Profile.jsx';
import { loader as getUserSavedTrends } from './pages/Profile.jsx';
import { loader as blogLoader } from './pages/Blog.jsx';
import { loader as singleBlogLoader } from './pages/BlogPage.jsx';
import { loader as singleEditBlogLoader } from './pages/AddBlog.jsx';
import { action as createBlogAction } from './pages/AddBlog.jsx';
import { action as editBlogAction } from './pages/AddBlog.jsx';
import { loader as allStatsLoader } from './pages/Settings.jsx';
import { loader as landingLoader } from './pages/Landing.jsx';
import { loader as landingBlogLoader } from './pages/LandingBlog.jsx';
import { loader as landingBlogPageLoader } from './pages/LandingBlogPage.jsx';

/**
 * routes.js contains all route objects for both SSR and client usage
 **/
const routes = [
  {
    path: '/',
    element: <PublicLayout />,
    // errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
        loader: landingLoader,
        id: 'landing',
        //_serverLoader: landingLoader,
      },
      {
        path: 'register',
        element: <Register />,
        action: registerAction,
        id: 'landingRegister',
      },
      {
        path: 'login',
        element: <Login />,
        action: loginAction,
        id: 'landingLogin',
      },
      { path: 'verify-email', element: <LandingEmailVerify /> },
      {
        path: 'blog',
        element: <LandingBlog />,
        loader: landingBlogLoader,
        id: 'landingBlog',
        //_serverLoader: landingBlogLoader,
      },
      {
        path: 'blog/:slug',
        element: <LandingBlogPage />,
        loader: landingBlogPageLoader,
        id: 'landingBlogPage',
        //_serverLoader: landingBlogPageLoader,
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <UserProvider>
        <ProtectedLayout />
      </UserProvider>
    ),
    // errorElement: <Error />,
    children: [
      {
        path: '',
        element: <DashboardLayout />,
        loader: dashboardLoader,
        id: 'dashboard',
        children: [
          {
            index: true,
            element: <AllTrends />,
            loader: allTrendsLoader,
            id: 'dashboardAllTrends',
          },
          {
            path: 'blog',
            element: <Blog />,
            loader: blogLoader,
            id: 'dashboardBlogLoader',
          },
          {
            path: 'create-blog',
            element: <AddBlog />,
            action: createBlogAction,
            id: 'dashboardBlogAction',
          },
          {
            path: 'edit-blog/:slug',
            element: <AddBlog />,
            loader: singleEditBlogLoader,
            action: editBlogAction,
            id: 'dashboardAddBlog',
          },
          {
            path: 'blog/:slug',
            element: <BlogPage />,
            loader: singleBlogLoader,
            id: 'dashboardBlogPage',
          },
          {
            path: 'submit',
            element: <AddTrend />,
            action: addTrendAction,
            id: 'dashboardAddTrend',
          },
          {
            path: 'admin',
            element: <Admin />,
            loader: allTrendAdminLoader,
            id: 'dashboardAdmin',
          },
          {
            path: 'profile',
            element: <Profile />,
            action: profileAction,
            loader: getUserSavedTrends,
            id: 'dashboardProfile',
          },
          {
            path: 'edit-trend/:slug',
            element: <EditTrend />,
            loader: editTrendLoader,
            action: editTrendAction,
            id: 'dashboardEditTrend',
          },
          {
            path: 'trend/:slug',
            element: <TrendPage />,
            loader: singleTrendLoader,
            id: 'dashboardTrendPage',
          },
          {
            path: 'settings',
            element: <Settings />,
            loader: allStatsLoader,
            id: 'dashboardSettings',
          },
        ],
      },
    ],
  },
];

export default routes;
