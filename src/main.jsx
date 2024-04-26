import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { NotificationProvider } from './components/Notification';
import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient();


ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <NotificationProvider>
      <App />
    </NotificationProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

