import { createContext, useContext, useEffect, useState } from 'react';
import { onAuth, getUserRole } from '../lib/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = 로딩 중
  const [role, setRole] = useState('reader');

  useEffect(() => {
    const unsubscribe = onAuth(async (firebaseUser) => {
      if (firebaseUser) {
        const userRole = await getUserRole(firebaseUser.uid);
        setRole(userRole);
        setUser(firebaseUser);
      } else {
        setUser(null);
        setRole('reader');
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading: user === undefined }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
