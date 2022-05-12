//this hook will be used to authenticate the user, to made a context, to login the application,
//storage in only one place data from user authenticate, and logout in everywhere on this app.
//authentication hook to centralize every that involves an user.

import React, {
  createContext,
  useState,
  useContext,
  ReactNode
} from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  driver_license: string;
  avatar: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn: (credentials: SignInCredentials) => Promise<void>; //it is a function that return an empty promise
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

//this function expect to receive a children, this children is the routes of our app
function AuthProvider ({ children } : AuthProviderProps) {
  const [data, setData] = useState<AuthState>({} as AuthState);

  async function signIn({ email, password } : SignInCredentials) {
    const response = await api.post('/sessions', {
      email,
      password
    });

    const { token, user } = response.data;

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    setData({ token, user});
  }

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        signIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

//Now in fact using the hook to make everything available in all app
function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
