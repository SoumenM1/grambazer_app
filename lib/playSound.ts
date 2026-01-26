import { createAudioPlayer } from "expo-audio";

let player: any = null;

export async function playNotificationSound() {
  try {
    if (!player) {
      player = createAudioPlayer(require("../assets/notification.wav"));
    }

    await player.seekTo(0);
    await player.play();
  } catch (e) {
    console.log("Sound error:", e);
  }
}
