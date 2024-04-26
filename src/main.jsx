import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { NotificationProvider } from './components/Notification';
import { UserProvider } from './components/User';
import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient();


ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
    <QueryClientProvider client={queryClient}>
    <NotificationProvider>
      <App />
    </NotificationProvider>
    </QueryClientProvider>
    </UserProvider>
  </React.StrictMode>,

  document.getElementById('root')
);

