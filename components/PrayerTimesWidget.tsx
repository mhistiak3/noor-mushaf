import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import {
  getPrayerTimesCache,
  setPrayerTimesCache,
  type PrayerTimings,
} from "../utils/storage";
import { borderRadius, colors, shadows, spacing } from "../utils/theme";

type PrayerData = {
  hijriDate: string;
  gregorianDate: string;
  currentPrayer: string;
  currentPrayerTime: string;
  nextPrayer: string;
  nextPrayerTime: string;
  timeRemaining: string;
  iftarTime: string;
  sahriTime: string;
  allPrayers: PrayerTimings;
};

const PRAYER_NAMES: (keyof PrayerTimings)[] = [
  "Fajr",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
];

const CACHE_TTL_MS = 12 * 60 * 60 * 1000;

export default function PrayerTimesWidget() {
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buildPrayerData = useCallback(
    (
      timings: PrayerTimings,
      hijriDate: string,
      gregorianDate: string,
    ): PrayerData => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      let currentPrayer = "";
      let nextPrayer = "";
      let nextPrayerTime = "";

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

      if (!nextPrayer) {
        nextPrayer = "Fajr";
        nextPrayerTime = timings.Fajr;
        currentPrayer = "Isha";
      }

      const currentPrayerTime =
        timings[currentPrayer as keyof PrayerTimings] || timings.Isha;

      return {
        hijriDate,
        gregorianDate,
        currentPrayer,
        currentPrayerTime,
        nextPrayer,
        nextPrayerTime,
        timeRemaining: calculateTimeRemaining(nextPrayerTime),
        iftarTime: timings.Maghrib,
        sahriTime: timings.Imsak,
        allPrayers: timings,
      };
    },
    [],
  );

  const fetchPrayerTimesFromApi = useCallback(async () => {
    try {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Location permission required");
      }

      // Check if location services are enabled
      const isEnabled = await Location.hasServicesEnabledAsync();
      if (!isEnabled) {
        throw new Error("Please enable location services");
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

      const timings: PrayerTimings = {
        Imsak: data.data.timings.Imsak,
        Fajr: data.data.timings.Fajr,
        Sunrise: data.data.timings.Sunrise,
        Dhuhr: data.data.timings.Dhuhr,
        Asr: data.data.timings.Asr,
        Maghrib: data.data.timings.Maghrib,
        Isha: data.data.timings.Isha,
        Sunset: data.data.timings.Sunset,
        Midnight: data.data.timings.Midnight,
      };

      // Get Hijri date
      const hijri = data.data.date.hijri;
      const hijriDate = `${hijri.day} ${hijri.month.en} ${hijri.year}`;
      const gregorian = data.data.date.gregorian;
      const gregorianDate = `${gregorian.day} ${gregorian.month.en} ${gregorian.year}`;

      return { hijriDate, gregorianDate, timings };
    } catch (err) {
      throw err;
    }
  }, []);

  const loadPrayerTimes = useCallback(async () => {
    setLoading(true);
    const cached = await getPrayerTimesCache();
    let hasCache = false;

    if (cached) {
      setPrayerData(
        buildPrayerData(cached.timings, cached.hijriDate, cached.gregorianDate),
      );
      setLoading(false);
      setError(null);
      hasCache = true;
    }

    const isStale = !cached || Date.now() - cached.fetchedAt > CACHE_TTL_MS;
    if (!isStale) {
      return;
    }

    try {
      const fresh = await fetchPrayerTimesFromApi();
      const nextData = buildPrayerData(
        fresh.timings,
        fresh.hijriDate,
        fresh.gregorianDate,
      );
      setPrayerData(nextData);
      setLoading(false);
      setError(null);
      await setPrayerTimesCache({ fetchedAt: Date.now(), ...fresh });
    } catch (err) {
      if (!hasCache) {
        const message =
          err instanceof Error && err.message
            ? err.message
            : "Unable to load prayer times";
        setError(message);
        setLoading(false);
      }
    }
  }, [buildPrayerData, fetchPrayerTimesFromApi]);

  useEffect(() => {
    loadPrayerTimes();
  }, [loadPrayerTimes]);

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

      {/* Sahri and Iftar */}
      <View style={styles.specialTimesRow}>
        <View style={styles.specialTimeBox}>
          <Text style={styles.specialLabel}>Sahri</Text>
          <Text style={styles.specialTime}>
            {formatTime(prayerData.sahriTime)}
          </Text>
        </View>
        <View style={styles.specialTimeBox}>
          <Text style={styles.specialLabel}>Iftar</Text>
          <Text style={styles.specialTime}>
            {formatTime(prayerData.iftarTime)}
          </Text>
        </View>
      </View>
    </View>
  );
}

function calculateTimeRemaining(prayerTime: string): string {
  const now = new Date();
  const [hours, minutes] = prayerTime.split(":").map(Number);

  const prayerDate = new Date();
  prayerDate.setHours(hours, minutes, 0, 0);

  if (prayerDate < now) {
    prayerDate.setDate(prayerDate.getDate() + 1);
  }

  const diff = prayerDate.getTime() - now.getTime();
  const hoursRemaining = Math.floor(diff / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hoursRemaining === 0) {
    return `${minutesRemaining} min`;
  }
  return `${hoursRemaining}h ${minutesRemaining}m`;
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
  specialTimesRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  specialTimeBox: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  specialLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  specialTime: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  errorText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
