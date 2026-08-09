import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Thin service layer around expo-notifications. Screens/hooks never import
 * `expo-notifications` directly — if we swap push providers later, this is
 * the only file that changes.
 */
class NotificationService {
  private permissionGranted = false;

  async requestPermissions(): Promise<boolean> {
    const { status } = await Notifications.getPermissionsAsync();
    if (status === "granted") {
      this.permissionGranted = true;
      return true;
    }
    const { status: requested } = await Notifications.requestPermissionsAsync();
    this.permissionGranted = requested === "granted";
    return this.permissionGranted;
  }

  async notifyPhaseComplete(title: string, body: string): Promise<void> {
    if (!this.permissionGranted) return;
    await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: Platform.OS === "ios" },
      trigger: null, // fire immediately
    });
  }

  async notifyLevelUp(level: number): Promise<void> {
    if (!this.permissionGranted) return;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🎉 Level up!",
        body: `Você alcançou o nível ${level}!`,
        sound: true,
      },
      trigger: null,
    });
  }
}

export const notificationService = new NotificationService();
