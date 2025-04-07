import React, { createContext } from 'react';
import { renderToString } from 'react-dom/server';
import {
  matchRoutes,
  createMemoryRouter,
  RouterProvider,
} from 'react-router-dom';
import routes from './routes.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

import * as HelmetAsync from 'react-helmet-async'; // react-helmet-async (CJS in SSR):
const { HelmetProvider } = HelmetAsync.default; //import the "react-helmet-async" default because its CJS in SSR

export const ServerDataContext = createContext({}); //context to hold the server-loaded data
/**
 * entry-server is only used by Node server for SSRot manually calls loaders for each route in SSR
 * then uses a special data context so route components can read that data
 *   - "render(url)" is called from server.js the match routes with matchRoutes(routes, url)
 *   - for each match, if there's a "loader" in route.route, call it
 *   - store that data in an object keyed by route id or path
 *   - create a memory router but remove the official loader config, because its handled manually
 *   - wrap with <ServerDataContext.Provider> so route components can read data
 *   - run renderToString(...) with <HelmetProvider> + <ThemeProvider>
 * @param {*} url
 * @returns
 */
export async function render(url) {
  const matches = matchRoutes(routes, url);
  if (!matches) {
    // no matching route => empty
    return { appHtml: '', helmetContext: {} };
  } //find matching routes

  const routeData = {};
  for (const match of matches) {
    if (match.route._serverLoader) {
      //store the data under some key (like route path or "id")
      const loaded = await match.route._serverLoader({
        params: match.params,
        //can pass more context if needed
      });
      routeData[match.route.path || 'root'] = loaded;
    }
  }

  // create a memory-based router for SSR
  const memoryRouter = createMemoryRouter(
    routes.map((r) => {
      const { _serverLoader, loader, ...rest } = r;
      return { ...rest };
    }),
    {
      initialEntries: [url],
    }
  ); //"SSR-friendly" version of the route objects that doesn't have "loader" but does "element"

  const helmetContext = {}; // creating a helmetContext to gather <Helmet> tags

  // Render your app to string
  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <ThemeProvider>
        <ServerDataContext.Provider value={routeData}>
          <RouterProvider router={memoryRouter} />
        </ServerDataContext.Provider>
      </ThemeProvider>
    </HelmetProvider>
  );

  // // extract the helmet data
  // const { helmet } = helmetContext;

  return {
    appHtml,
    helmetContext, // we return the entire context
  };
}
