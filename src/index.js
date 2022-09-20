import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MoralisProvider } from 'react-moralis';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MoralisProvider serverUrl="https://cjyafepbvvkp.usemoralis.com:2053/server" appId='9zfXLWJsWB4p3zdjVTZIhOSm0AgMOjA5qcAYvhog'>
      <App />
    </MoralisProvider>
  </React.StrictMode>
);

