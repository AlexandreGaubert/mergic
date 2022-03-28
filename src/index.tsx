import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import PullRequestContextProvider from './contexts/PullRequestsContext';

TimeAgo.addDefaultLocale(en)

ReactDOM.render(
  <React.StrictMode>
    <PullRequestContextProvider>
      <App />
    </PullRequestContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);