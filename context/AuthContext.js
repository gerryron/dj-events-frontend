import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { API_URL, NEXT_URL } from '@/config/index';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => checkUserLoggedIn(), []);

  //* Register User
  const register = async (req) => {
    const res = await fetch(`${NEXT_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      router.push('/account/dashboard');
    } else {
      setError(data.message);
      //* set default instance
      setError(null);
    }
  };

  //* Login User
  const login = async ({ email: identifier, password }) => {
    const res = await fetch(`${NEXT_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
    } else {
      setError(data.message);
      //* set default instance
      setError(null);
    }
  };

  //* Logout User
  const logout = async () => {
    const res = await fetch(`${NEXT_URL}/api/logout`, {
      method: 'POST',
    });

    if (res.ok) {
      setUser(null);
      router.push('/');
    }
  };

  //* Check if user is logged in
  const checkUserLoggedIn = async () => {
    const res = await fetch(`${API_URL}/api/user`);
    const data = await res.json();

    if (res.ok) {
      setUser(data.user);
      router.push('/account/dashboard');
    } else {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user, error, register, login, logout,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;