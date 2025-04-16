import React from 'react';

/**
 * minimal "app wrapper"
 * everything is set up in entry-client.jsx
 * @param {*} param0
 * @returns
 */

function App({ children }) {
  return <div className="app-wrapper">{children}</div>;
}

export default App;
