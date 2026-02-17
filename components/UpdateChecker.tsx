import * as Updates from "expo-updates";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors, spacing } from "../utils/theme";

export default function UpdateChecker() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isProduction, setIsProduction] = useState(false);

  const checkForUpdates = useCallback(async () => {
    // Only check for updates in production (non-Expo Go)
    if (!isProduction) {
      return;
    }

    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        setUpdateAvailable(true);
      }
    } catch (error) {
      console.error("Error checking for updates:", error);
    }
  }, [isProduction]);

  const handleUpdate = useCallback(async () => {
    try {
      setDownloading(true);
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (error) {
      Alert.alert("Update Failed", "Unable to download the latest update");
      console.error("Error updating:", error);
      setDownloading(false);
    }
  }, []);

  const handleDismiss = useCallback(() => {
    setUpdateAvailable(false);
  }, []);

  useEffect(() => {
    // Check if running in production (not Expo Go)
    const checkEnvironment = async () => {
      try {
        const updateId = Updates.updateId;

        // If we have an updateId, we're in a production build (EAS)
        // In Expo Go, updateId will be null or undefined
        if (updateId && updateId !== "0") {
          setIsProduction(true);
        } else {
          setIsProduction(false);
        }
      } catch (error) {
        console.error("Error checking environment:", error);
        setIsProduction(false);
      }
    };

    checkEnvironment();
  }, []);

  useEffect(() => {
    // Check for updates when app starts (only in production)
    if (!isProduction) {
      return;
    }

    checkForUpdates();

    // Optionally check for updates every 30 minutes
    const interval = setInterval(checkForUpdates, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isProduction, checkForUpdates]);

  return (
    <Modal
      visible={updateAvailable}
      transparent
      animationType="fade"
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📱</Text>
          </View>

          <Text style={styles.title}>Update Available</Text>
          <Text style={styles.message}>
            A new version of Noor Mushaf is available. Please update to get the
            latest features and improvements.
          </Text>

          {downloading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Downloading update...</Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Pressable
              onPress={handleDismiss}
              disabled={downloading}
              style={({ pressed }) => [
                styles.button,
                styles.laterButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.laterButtonText}>Later</Text>
            </Pressable>
            <Pressable
              onPress={handleUpdate}
              disabled={downloading}
              style={({ pressed }) => [
                styles.button,
                styles.updateButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.updateButtonText}>Update Now</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: spacing.lg,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: spacing.md,
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.8,
  },
  laterButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  laterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  updateButton: {
    backgroundColor: colors.primary,
  },
  updateButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
