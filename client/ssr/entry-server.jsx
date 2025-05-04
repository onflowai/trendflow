import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server';
import routes from '../src/routes.jsx';
import { ThemeProvider } from '../src/context/ThemeContext.jsx';
import { ServerStyleSheet } from 'styled-components';
import { HelmetProvider } from 'react-helmet-async';

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
  const handler = createStaticHandler(routes); //creating handler which knows about loaders/actions
  const request = new Request('http://localhost' + url); //building a request for that URL
  const context = await handler.query(request); //running it through the handler (calling loader(s))
  const router = createStaticRouter(handler.dataRoutes, context); //creating router with the dataRoutes + fetched data
  const helmetContext = {}; //helmet SSR wrap
  const sheet = new ServerStyleSheet(); //styled-components wrap
  let appHtml, styleTags;
  try {
    appHtml = renderToString(
      sheet.collectStyles(
        <HelmetProvider context={helmetContext}>
          <ThemeProvider>
            <StaticRouterProvider router={router} context={context} />
          </ThemeProvider>
        </HelmetProvider>
      )
    );
    styleTags = sheet.getStyleTags();
  } finally {
    sheet.seal();
  }

  return { appHtml, styleTags, helmetContext };
}
