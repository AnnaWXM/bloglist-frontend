import React, { createContext, useContext, useReducer } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

const initialState = {
  message: null,
  type: null,
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return {
        message: action.message,
        type: action.notificationType,
      };
    case 'HIDE_NOTIFICATION':
      return initialState;
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const showNotification = (message, notificationType) => {
    dispatch({ type: 'SHOW_NOTIFICATION', message, notificationType });
  };

  const hideNotification = () => {
    dispatch({ type: 'HIDE_NOTIFICATION' });
  };

  return (
    <NotificationContext.Provider value={{ state, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
