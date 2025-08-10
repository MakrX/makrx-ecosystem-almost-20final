import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  createdAt?: string;
  lastLoginAt?: string;
}

interface AuthError {
  message: string;
  code?: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing auth on app start
    const storedUser = localStorage.getItem("makrx_user");
    const token = localStorage.getItem("makrx_access_token");

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Validate token is still valid (basic check)
        const tokenData = token.split("_");
        const tokenTime = parseInt(tokenData[tokenData.length - 1]);
        const now = Date.now();

        // Token expires after 24 hours (86400000 ms)
        if (now - tokenTime < 86400000) {
          // Update last login time
          parsedUser.lastLoginAt = new Date().toISOString();
          setUser(parsedUser);
        } else {
          // Token expired, clear storage
          localStorage.removeItem("makrx_user");
          localStorage.removeItem("makrx_access_token");
        }
      } catch (err) {
        console.error("Error parsing stored user data:", err);
        localStorage.removeItem("makrx_user");
        localStorage.removeItem("makrx_access_token");
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API validation
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // Demo credentials validation
      const isDemoCredentials =
        email === "demo@makrx.org" && password === "makrx2024";

      if (!isDemoCredentials && !email.includes("@")) {
        throw new Error("Invalid email format");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const now = new Date().toISOString();
      const dummyUser: User = {
        id: Date.now().toString(),
        email,
        username: email.split("@")[0],
        firstName: isDemoCredentials ? "Demo" : "User",
        lastName: isDemoCredentials ? "User" : email.split("@")[0],
        roles: isDemoCredentials ? ["admin", "maker"] : ["maker"],
        createdAt: now,
        lastLoginAt: now,
      };

      localStorage.setItem("makrx_user", JSON.stringify(dummyUser));
      localStorage.setItem("makrx_access_token", "dummy_token_" + Date.now());

      setUser(dummyUser);
    } catch (err) {
      const error = err as Error;
      setError({ message: error.message, code: "LOGIN_FAILED" });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Basic validation
      if (!data.firstName.trim() || !data.lastName.trim()) {
        throw new Error("First and last name are required");
      }

      if (!data.email || !data.email.includes("@")) {
        throw new Error("Valid email is required");
      }

      if (data.password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      // Check if email already exists (simulate)
      const existingUser = localStorage.getItem("makrx_users");
      if (existingUser) {
        const users = JSON.parse(existingUser);
        if (users.find((u: User) => u.email === data.email)) {
          throw new Error("Email already registered");
        }
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const now = new Date().toISOString();
      const newUser: User = {
        id: Date.now().toString(),
        email: data.email,
        username: data.email.split("@")[0],
        firstName: data.firstName,
        lastName: data.lastName,
        roles: ["maker"],
        createdAt: now,
        lastLoginAt: now,
      };

      // Store user in localStorage (simulate database)
      const users = existingUser ? JSON.parse(existingUser) : [];
      users.push(newUser);
      localStorage.setItem("makrx_users", JSON.stringify(users));

      // Auto-login after registration
      localStorage.setItem("makrx_user", JSON.stringify(newUser));
      localStorage.setItem("makrx_access_token", "dummy_token_" + Date.now());

      setUser(newUser);
    } catch (err) {
      const error = err as Error;
      setError({ message: error.message, code: "REGISTRATION_FAILED" });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("makrx_user");
    localStorage.removeItem("makrx_access_token");
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        token,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
