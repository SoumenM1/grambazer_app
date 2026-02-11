import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  // ❌ Expo push works only on real device
  if (!Device.isDevice) {
    alert("❌ Push notifications require a physical device");
    return null;
  }

  // 1️⃣ Check existing permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  // 2️⃣ Ask permission if not granted
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // 3️⃣ Permission denied
  if (finalStatus !== "granted") {
    alert("❌ Notification permission denied");
    return null;
  }

  // 4️⃣ Get Expo Push Token
  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: "5f9744ce-7aec-4402-9149-d168d9869ee9", // 👈 IMPORTANT
    })
  ).data;

  // console.log("📲 Expo Push Token:", token);

  // 5️⃣ Android notification channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Gramseba",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }

  return token;
}
