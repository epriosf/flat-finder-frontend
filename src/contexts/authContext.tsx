import { createContext, ReactNode, useEffect, useState } from 'react';
import { User } from '../components/Interfaces/UserInterface';
import {
  initializeAuthPersistence,
  loginUser,
  logoutUser,
  onAuthStateChange,
} from '../services/authService';
import { getUserByEmail } from '../services/firebase';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      await initializeAuthPersistence();
    };

    initializeAuth();

    const unsubscribe = onAuthStateChange(async (authUser) => {
      if (authUser) {
        const userDb = await getUserByEmail(authUser.email!);

        if (userDb.length > 0) {
          const userFromDb = userDb[0];

          // Set the user state with the object retrieved from the database
          setUser({
            firstName: userFromDb.firstName,
            lastName: userFromDb.lastName,
            profile: userFromDb.profile,
            email: userFromDb.email,
            birthday: userFromDb.birthday || new Date(),
            role: userFromDb.role || 'user',
            id: userFromDb.id || '',
            profileImage: userFromDb.profileImage || '',
            isAdmin: userFromDb.isAdmin ?? false,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false); // Set loading to false after fetching user data
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const authUser = await loginUser(email, password);

      if (!authUser) {
        throw new Error('Login failed: User not found.');
      }

      const userDb = await getUserByEmail(authUser.email!);

      if (userDb.length > 0) {
        const loggedInUser = {
          firstName: userDb[0].firstName,
          lastName: userDb[0].lastName,
          profile: userDb[0].profile,
          email: userDb[0].email,
          birthday: userDb[0].birthday || new Date(),
          role: userDb[0].role || 'user',
          id: userDb[0].id || '',
          profileImage: userDb[0].profileImage || '',
          isAdmin: userDb[0].isAdmin ?? false,
        };
        setUser(loggedInUser);
        return loggedInUser;
      } else {
        throw new Error('Login failed: User not found in the database.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
