// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react';
import { authService } from '../services/auth';
import { apiService } from '../services/api';
import { API_CONFIG, buildApiUrl } from '../config/api';
import type { UserLogin, UserRegistration, User } from '../types';

// ——— State & Actions ——————————————————————————————————————————————————————
interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  loading: true,
  user: null,
};

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { token: string; user: User } }
  | { type: 'AUTH_FAILURE' }
  | { type: 'AUTH_LOGOUT' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true };
    case 'AUTH_SUCCESS':
      return {
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        user: action.payload.user,
      };
    case 'AUTH_FAILURE':
      return { ...initialState, loading: false };
    case 'AUTH_LOGOUT':
      return { ...initialState, loading: false };
    default:
      return state;
  }
}

// ——— Context & Provider ——————————————————————————————————————————————————
interface AuthContextType {
  state: AuthState;
  user: User | null;
  login: (c: UserLogin) => Promise<void>;
  register: (d: UserRegistration) => Promise<void>;
  logout: () => void;
  updateProfile: (u: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  state: initialState,
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On mount, rehydrate from localStorage if present
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    if (token && userJson) {
      dispatch({ type: 'AUTH_SUCCESS', payload: { token, user: JSON.parse(userJson) } });
    } else {
      dispatch({ type: 'AUTH_FAILURE' });
    }
  }, []);

  // Helper to persist into LS + state
  const persist = (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'AUTH_SUCCESS', payload: { token, user } });
  };

  // — Login — fetch token then immediately fetch full profile
  const login = async (credentials: UserLogin) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const { token } = await authService.login(credentials);
      if (!token) throw new Error('No token returned from login');

      // Store token so apiService can pick it up
      localStorage.setItem('token', token);

      // Now fetch the full user profile (with avatarId, photoUrl, etc)
      const profile = await apiService.getJSON<User>(
        buildApiUrl(API_CONFIG.ENDPOINTS.GET_PROFILE)
      );

      persist(token, profile);
    } catch (err: any) {
      dispatch({ type: 'AUTH_FAILURE' });
      const msg = err.response?.data?.message || err.message || 'Login failed';
      throw new Error(msg);
    }
  };

  // — Register — same idea
  const register = async (data: UserRegistration) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const { token } = await authService.register(data);
      if (!token) throw new Error('No token returned from register');

      localStorage.setItem('token', token);

      // Fetch full profile after signup
      const profile = await apiService.getJSON<User>(
        buildApiUrl(API_CONFIG.ENDPOINTS.GET_PROFILE)
      );

      persist(token, profile);
    } catch (err: any) {
      dispatch({ type: 'AUTH_FAILURE' });
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  // Profile updates - updates both context and localStorage
  const updateProfile = async (userData: Partial<User>) => {
    if (!state.user) return;
    const updated = { ...state.user, ...userData };
    localStorage.setItem('user', JSON.stringify(updated));
    dispatch({ type: 'AUTH_SUCCESS', payload: { token: state.token || '', user: updated } });
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        user: state.user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

export { useAuth };
