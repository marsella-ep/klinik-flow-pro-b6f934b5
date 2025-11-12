import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "doctor" | "pharmacist" | "receptionist" | "staff";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: Record<string, User & { password: string }> = {
  "admin@sentosa.com": {
    id: "1",
    name: "Admin Klinik",
    email: "admin@sentosa.com",
    role: "admin",
    password: "admin123",
  },
  "doctor@sentosa.com": {
    id: "2",
    name: "Dr. Budi Santoso",
    email: "doctor@sentosa.com",
    role: "doctor",
    password: "doctor123",
  },
  "pharmacist@sentosa.com": {
    id: "3",
    name: "Apt. Sarah Wijaya",
    email: "pharmacist@sentosa.com",
    role: "pharmacist",
    password: "pharmacist123",
  },
  "receptionist@sentosa.com": {
    id: "4",
    name: "Siti Nurhaliza",
    email: "receptionist@sentosa.com",
    role: "receptionist",
    password: "receptionist123",
  },
  "staff@sentosa.com": {
    id: "5",
    name: "Ahmad Dahlan",
    email: "staff@sentosa.com",
    role: "staff",
    password: "staff123",
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("clinic_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string) => {
    const foundUser = mockUsers[email];
    if (!foundUser || foundUser.password !== password) {
      throw new Error("Email atau password salah");
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem("clinic_user", JSON.stringify(userWithoutPassword));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("clinic_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
