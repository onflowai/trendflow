import React, { createContext } from 'react';
import { renderToString } from 'react-dom/server';
import {
  matchRoutes,
  createMemoryRouter,
  RouterProvider,
} from 'react-router-dom';
import routes from '../src/routes.jsx';
import { ThemeProvider } from '../src/context/ThemeContext.jsx';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
//import ServerDataContext from '../src/context/ServerDataContext.js';

import { HelmetProvider } from 'react-helmet-async';
//import * as HelmetAsync from 'react-helmet-async'; // react-helmet-async (CJS in SSR):
//const { HelmetProvider } = HelmetAsync.default; //import the "react-helmet-async" default because its CJS in SSR
// import helmetPkg from 'react-helmet-async';
// const { HelmetProvider } = helmetPkg;

//export const ServerDataContext = createContext({}); //context to hold the server-loaded data
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
  const helmetContext = {};

  const matches = matchRoutes(routes, url);
  if (!matches || matches.length === 0) {
    return { appHtml: '', helmetContext: {} };
  }

  const loaderData = {};
  await Promise.all(
    matches.map(async (match) => {
      if (match.route.loader) {
        try {
          loaderData[match.route.id || match.route.path] =
            await match.route.loader();
        } catch (err) {
          console.error(`Loader error on route ${match.route.path}`, err);
        }
      }
    })
  ); // run all loaders for the matched routes

  const memoryRouter = createMemoryRouter(routes, {
    initialEntries: [url],
    hydrationData: loaderData, // Pass loader data here
  }); // providing data to the router

  const sheet = new ServerStyleSheet();

  try {
    const appHtml = renderToString(
      sheet.collectStyles(
        // <-- Collect Styled Components CSS
        <HelmetProvider context={helmetContext}>
          <ThemeProvider>
            <RouterProvider router={memoryRouter} />
          </ThemeProvider>
        </HelmetProvider>
      )
    );

    const styleTags = sheet.getStyleTags();

    return {
      appHtml,
      helmetContext,
      styleTags,
    };
  } catch (error) {
    console.error('SSR Styled-Components Error:', error);
  } finally {
    sheet.seal();
  }
}
