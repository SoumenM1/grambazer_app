import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSocket } from "../lib/socket";
import { setAuthToken } from "../lib/api";

type AuthContextType = {
  user: any | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: any) => Promise<void>;
  logout: () => Promise<void>;
};

const connectSocket = (token: string) => {
  const socket = getSocket(token);
  socket.auth = { token }; // 🔑 SET TOKEN
  if (!socket.connected) {
    socket.connect();
  }
};


const AuthContext = createContext<AuthContextType>(null as any);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, [token]);

  const restoreSession = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // ✅ SET AXIOS TOKEN FIRST
        setAuthToken(storedToken);
        // ✅ THEN CONNECT SOCKET
        connectSocket(storedToken);
      }
    } catch (e) {
      console.log("Restore session failed", e);
    } finally {
      setLoading(false);
    }
  };

  // 🔐 LOGIN
  const login = async (jwt: string, userData: any) => {
    await AsyncStorage.multiSet([
      ["token", jwt],
      ["user", JSON.stringify(userData)],
    ]);

    setToken(jwt);
    setUser(userData);
    setAuthToken(jwt);
    connectSocket(jwt);
  };

  // 🚪 LOGOUT
  const logout = async () => {
    await AsyncStorage.multiRemove(["token", "user"]);
    setToken(null);
    setUser(null);
    setAuthToken(null);
    const socket = getSocket();
    socket.disconnect();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
