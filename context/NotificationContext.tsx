import { createContext, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";
import { getSocket } from "../lib/socket";
import { playNotificationSound } from "../lib/playSound";
import * as Notifications from "expo-notifications";

type Notification = {
  id: string;
  title: string;
  body: string;
  image?: string | null;
  read: boolean;
};

const NotificationContext = createContext<any>(null);

export function NotificationProvider({ children }: any) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [appState, setAppState] = useState(AppState.currentState);

  const addNotification = (n: Notification) => {
    setNotifications((prev) => [n, ...prev]);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const socket = getSocket();

    // 🔔 Listen real-time notifications
    socket.on("notification", async (payload: any) => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        title: payload.title,
        body: payload.body,
        image: payload?.data?.image || null,
        read: false,
      };

      // Add notification to app state / list
      addNotification(newNotification);
      // Schedule local notification with banner

      // await Notifications.scheduleNotificationAsync({
      //   content: {
      //     title: payload.title,
      //     body: payload.body,
      //     sound: "default",    
      //   },
      //   trigger: null, // Show immediately
      // });
      playNotificationSound();
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  // 📱 Track app state (foreground / background)
  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState) => {
      setAppState(nextState);
    });

    return () => sub.remove();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAllRead,
        unreadCount,
        appState,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
