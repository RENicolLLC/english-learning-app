import React from 'react';
import { mockUser, mockAuthContext as defaultMockAuthContext } from '../../../utils/mockData';

export const AuthContext = React.createContext({});

export const useAuth = () => defaultMockAuthContext;

export const AuthProvider = ({ children, value }) => {
  return (
    <AuthContext.Provider value={value || defaultMockAuthContext}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 