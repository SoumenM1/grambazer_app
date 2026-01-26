import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSocket } from "../lib/socket";

type AuthContextType = {
  user: any | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: any) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>(null as any);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // 🔑 IMPORTANT
 
  // 🔁 Restore session on app start
  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        const socket = getSocket();
        socket.auth = { token: storedToken };
        socket.connect();
      }
    } catch (e) {
      console.log("Restore session failed", e);
      
    } finally {
      setLoading(false); // 🔑 DONE LOADING
    }
  };

  const login = async (token: string, user: any) => {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
    const socket = getSocket();
    socket.auth = { token }; // 🔐 set before connect
    socket.connect();
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["token", "user"]);
    const socket = getSocket();
    socket.disconnect();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
