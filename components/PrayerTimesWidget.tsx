import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { borderRadius, colors, shadows, spacing } from "../utils/theme";

type PrayerTimes = {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

type PrayerData = {
  hijriDate: string;
  gregorianDate: string;
  currentPrayer: string;
  currentPrayerTime: string;
  nextPrayer: string;
  nextPrayerTime: string;
  timeRemaining: string;
  allPrayers: PrayerTimes;
};

const PRAYER_NAMES: (keyof PrayerTimes)[] = [
  "Fajr",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
];

export default function PrayerTimesWidget() {
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrayerTimes = useCallback(async () => {
    try {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission required");
        setLoading(false);
        return;
      }

      // Check if location services are enabled
      const isEnabled = await Location.hasServicesEnabledAsync();
      if (!isEnabled) {
        setError("Please enable location services");
        setLoading(false);
        return;
      }

      // Get current location with timeout
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = location.coords;

      // Fetch prayer times from Aladhan API with Hanafi method
      // Method 1 = University of Islamic Sciences, Karachi
      // School 1 = Hanafi (for Asr calculation)
      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=1&school=1`,
      );

      const data = await response.json();
      if (data.code !== 200) {
        throw new Error("Failed to fetch prayer times");
      }

      const timings: PrayerTimes = {
        Fajr: data.data.timings.Fajr,
        Dhuhr: data.data.timings.Dhuhr,
        Asr: data.data.timings.Asr,
        Maghrib: data.data.timings.Maghrib,
        Isha: data.data.timings.Isha,
      };

      // Get Hijri date
      const hijri = data.data.date.hijri;
      const hijriDate = `${hijri.day} ${hijri.month.en} ${hijri.year}`;
      const gregorian = data.data.date.gregorian;
      const gregorianDate = `${gregorian.day} ${gregorian.month.en} ${gregorian.year}`;

      // Calculate current and next prayer
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      let currentPrayer = "";
      let nextPrayer = "";
      let nextPrayerTime = "";

      // Find current and next prayer
      for (let i = 0; i < PRAYER_NAMES.length; i++) {
        const prayerName = PRAYER_NAMES[i];
        const [hours, minutes] = timings[prayerName].split(":").map(Number);
        const prayerTime = hours * 60 + minutes;

        if (currentTime < prayerTime) {
          nextPrayer = prayerName;
          nextPrayerTime = timings[prayerName];
          currentPrayer = i > 0 ? PRAYER_NAMES[i - 1] : "Isha";
          break;
        }
      }

      // If no next prayer found today, next is Fajr tomorrow
      if (!nextPrayer) {
        nextPrayer = "Fajr";
        nextPrayerTime = timings.Fajr;
        currentPrayer = "Isha";
      }

      const currentPrayerTime =
        timings[currentPrayer as keyof PrayerTimes] || timings.Isha;

      setPrayerData({
        hijriDate,
        gregorianDate,
        currentPrayer,
        currentPrayerTime,
        nextPrayer,
        nextPrayerTime,
        timeRemaining: calculateTimeRemaining(nextPrayerTime),
        allPrayers: timings,
      });
      setLoading(false);
      setError(null);
    } catch (err) {
      setError("Unable to load prayer times");
      setLoading(false);
      console.error(err);
    }
  }, []);

  const calculateTimeRemaining = (prayerTime: string): string => {
    const now = new Date();
    const [hours, minutes] = prayerTime.split(":").map(Number);

    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0, 0);

    // If prayer time has passed, it's tomorrow
    if (prayerDate < now) {
      prayerDate.setDate(prayerDate.getDate() + 1);
    }

    const diff = prayerDate.getTime() - now.getTime();
    const hoursRemaining = Math.floor(diff / (1000 * 60 * 60));
    const minutesRemaining = Math.floor(
      (diff % (1000 * 60 * 60)) / (1000 * 60),
    );

    if (hoursRemaining === 0) {
      return `${minutesRemaining} min`;
    }
    return `${hoursRemaining}h ${minutesRemaining}m`;
  };

  useEffect(() => {
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  useEffect(() => {
    // Update time remaining every minute
    const interval = setInterval(() => {
      setPrayerData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          timeRemaining: calculateTimeRemaining(prev.nextPrayerTime),
        };
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  if (error || !prayerData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error || "Unable to load"}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Dates */}
      <View style={styles.header}>
        <View style={styles.hijriContainer}>
          <Text style={styles.hijriIcon}>🌙</Text>
          <Text style={styles.hijriDate}>{prayerData.hijriDate}</Text>
        </View>
        <Text style={styles.gregorianDate}>{prayerData.gregorianDate}</Text>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Current Prayer */}
        <View style={styles.currentPrayerBox}>
          <Text style={styles.currentLabel}>Current</Text>
          <Text style={styles.currentPrayerName}>
            {prayerData.currentPrayer}
          </Text>
          <Text style={styles.currentPrayerTime}>
            {formatTime(prayerData.currentPrayerTime)}
          </Text>
        </View>

        {/* Next Prayer Countdown */}
        <View style={styles.nextPrayerBox}>
          <Text style={styles.nextLabel}>Next: {prayerData.nextPrayer}</Text>
          <View style={styles.countdownContainer}>
            <Text style={styles.countdown}>{prayerData.timeRemaining}</Text>
            <Text style={styles.nextTime}>
              {formatTime(prayerData.nextPrayerTime)}
            </Text>
          </View>
        </View>
      </View>

      {/* All Prayer Times */}
      <View style={styles.allPrayersContainer}>
        {PRAYER_NAMES.map((prayer) => (
          <View
            key={prayer}
            style={[
              styles.prayerTimeItem,
              prayer === prayerData.nextPrayer && styles.prayerTimeItemActive,
            ]}
          >
            <Text
              style={[
                styles.prayerTimeLabel,
                prayer === prayerData.nextPrayer &&
                  styles.prayerTimeLabelActive,
              ]}
            >
              {prayer}
            </Text>
            <Text
              style={[
                styles.prayerTime,
                prayer === prayerData.nextPrayer && styles.prayerTimeActive,
              ]}
            >
              {formatTime(prayerData.allPrayers[prayer])}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    width: "100%",
    // marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  hijriContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLight + "30",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  hijriIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  hijriDate: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
  },
  gregorianDate: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  mainContent: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  currentPrayerBox: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: "center",
  },
  currentLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  currentPrayerName: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  currentPrayerTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  nextPrayerBox: {
    flex: 1.5,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: "center",
  },
  nextLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.9)",
    marginBottom: spacing.xs,
    fontWeight: "600",
  },
  countdownContainer: {
    alignItems: "center",
  },
  countdown: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  nextTime: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  allPrayersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  prayerTimeItem: {
    alignItems: "center",
    flex: 1,
    paddingVertical: spacing.xs,
  },
  prayerTimeItemActive: {
    backgroundColor: colors.primaryLight + "30",
    borderRadius: borderRadius.sm,
  },
  prayerTimeLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  prayerTimeLabelActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  prayerTime: {
    fontSize: 11,
    color: colors.text,
    fontWeight: "500",
  },
  prayerTimeActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  errorText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
