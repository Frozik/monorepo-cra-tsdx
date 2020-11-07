import './app.css';

import { Thing } from '@shared/components';
import React from 'react';

import logo from './logo.svg';

export const App = React.memo(() => (
  <div className="App">
    <header className="App-header">
      <Thing />
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  </div>
));
