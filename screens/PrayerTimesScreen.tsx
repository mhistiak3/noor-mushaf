import * as Location from "expo-location";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import SafeScreen from "../components/SafeScreen";
import { useAppContext } from "../contexts/AppContext";
import { getTranslation } from "../utils/languages";
import {
  getPrayerTimesCache,
  setPrayerTimesCache,
  type PrayerTimings,
} from "../utils/storage";
import { borderRadius, shadows, spacing } from "../utils/theme";

type PrayerData = {
  hijriDate: string;
  gregorianDate: string;
  timings: PrayerTimings;
};

type DetailRow = {
  key: keyof PrayerTimings;
  label: string;
  icon: string;
  endKey?: keyof PrayerTimings;
  showRange?: boolean;
};

export default function PrayerTimesScreen() {
  const { themeColors, currentLanguage } = useAppContext();
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrayerTimesFromApi = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Location permission required");
    }

    const isEnabled = await Location.hasServicesEnabledAsync();
    if (!isEnabled) {
      throw new Error("Please enable location services");
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const { latitude, longitude } = location.coords;

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

    const hijri = data.data.date.hijri;
    const hijriDate = `${hijri.day} ${hijri.month.en} ${hijri.year}`;
    const gregorian = data.data.date.gregorian;
    const gregorianDate = `${gregorian.day} ${gregorian.month.en} ${gregorian.year}`;

    return { hijriDate, gregorianDate, timings };
  }, []);

  const loadPrayerTimes = useCallback(async () => {
    setLoading(true);
    const cached = await getPrayerTimesCache();
    let hasCache = false;

    // Check if cache is valid by checking if it's from today (within 24 hours)
    // Prayer times change daily, so 24-hour cache is safe
    const today = new Date();
    const isCacheFromToday =
      cached && cached.hijriDate && cached.fetchedAt
        ? today.getTime() - cached.fetchedAt < 24 * 60 * 60 * 1000
        : false;

    if (cached && isCacheFromToday) {
      setPrayerData({
        hijriDate: cached.hijriDate,
        gregorianDate: cached.gregorianDate,
        timings: cached.timings,
      });
      setLoading(false);
      setError(null);
      hasCache = true;
      return; // Cache is fresh, no need to fetch
    }

    try {
      const fresh = await fetchPrayerTimesFromApi();
      setPrayerData(fresh);
      setLoading(false);
      setError(null);
      const hijriDay = Number(fresh.hijriDate.split(" ")[0]);
      await setPrayerTimesCache({ fetchedAt: Date.now(), hijriDay, ...fresh });
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
  }, [fetchPrayerTimesFromApi]);

  useEffect(() => {
    loadPrayerTimes();
  }, [loadPrayerTimes]);

  // Update current prayer time every 30 seconds as time passes
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render to recalculate currentKey based on new time
      setPrayerData((prev) => (prev ? { ...prev } : null));
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const farzRows: DetailRow[] = useMemo(
    () => [
      {
        key: "Fajr",
        label: "Fajr",
        icon: "🌅",
        endKey: "Sunrise",
        showRange: true,
      },
      {
        key: "Dhuhr",
        label: "Dhuhr",
        icon: "🌤️",
        endKey: "Asr",
        showRange: true,
      },
      {
        key: "Asr",
        label: "Asr (Hanafi)",
        icon: "🌇",
        endKey: "Maghrib",
        showRange: true,
      },
      {
        key: "Maghrib",
        label: "Maghrib (Iftar)",
        icon: "🌆",
        endKey: "Isha",
        showRange: true,
      },
      {
        key: "Isha",
        label: "Isha",
        icon: "🌌",
        endKey: "Fajr",
        showRange: true,
      },
    ],
    [],
  );

  const otherRows: DetailRow[] = useMemo(
    () => [
      { key: "Imsak", label: "Sahri (Last Time)", icon: "🌙" },
      { key: "Sunrise", label: "Sunrise", icon: "☀️" },
      { key: "Sunset", label: "Sunset", icon: "🌇" },
      { key: "Midnight", label: "Midnight", icon: "🌌" },
    ],
    [],
  );

  const currentKey = useMemo(() => {
    if (!prayerData) return null;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (const row of farzRows) {
      const start = toMinutes(prayerData.timings[row.key]);
      const endKey = row.endKey || "Fajr";
      const end = toMinutes(prayerData.timings[endKey]);

      if (start <= end) {
        if (currentMinutes >= start && currentMinutes < end) {
          return row.key;
        }
      } else {
        // Crosses midnight
        if (currentMinutes >= start || currentMinutes < end) {
          return row.key;
        }
      }
    }

    return null;
  }, [farzRows, prayerData]);

  if (loading) {
    return (
      <SafeScreen>
        <View style={styles.center}>
          <ActivityIndicator size="small" color={themeColors.primary} />
        </View>
      </SafeScreen>
    );
  }

  if (error || !prayerData) {
    return (
      <SafeScreen>
        <View style={styles.center}>
          <Text
            style={[styles.errorText, { color: themeColors.textSecondary }]}
          >
            {error || "Unable to load"}
          </Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: themeColors.background },
        ]}
      >
        <View style={styles.header}>
          <View
            style={[
              styles.hijriContainer,
              { backgroundColor: themeColors.primaryLight + "30" },
            ]}
          >
            <Text style={styles.hijriIcon}>🌙</Text>
            <Text style={[styles.hijriDate, { color: themeColors.primary }]}>
              {prayerData.hijriDate}
            </Text>
          </View>
          <Text
            style={[styles.gregorianDate, { color: themeColors.textSecondary }]}
          >
            {prayerData.gregorianDate}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.cardTitle, { color: themeColors.text }]}>
            {getTranslation("farzSalat", currentLanguage)}
          </Text>
          {prayerData &&
            farzRows.map((row) => {
              const isCurrent = row.key === currentKey;
              const startTime = prayerData.timings[row.key];
              const endTime = row.endKey
                ? prayerData.timings[row.endKey]
                : undefined;

              return (
                <View
                  key={row.label}
                  style={[
                    styles.row,
                    { borderBottomColor: themeColors.border },
                    isCurrent && [
                      styles.rowActive,
                      { backgroundColor: themeColors.primaryLight + "25" },
                    ],
                  ]}
                >
                  <View style={styles.rowLeft}>
                    <Text style={styles.rowIcon}>{row.icon}</Text>
                    <Text
                      style={[
                        styles.rowLabel,
                        {
                          color: isCurrent
                            ? themeColors.primary
                            : themeColors.textSecondary,
                        },
                        isCurrent && styles.rowLabelActive,
                      ]}
                    >
                      {row.label}
                    </Text>
                  </View>
                  <View style={styles.rowRight}>
                    <Text
                      style={[
                        styles.rowTime,
                        {
                          color: isCurrent
                            ? themeColors.primary
                            : themeColors.text,
                        },
                        isCurrent && styles.rowTimeActive,
                      ]}
                    >
                      {formatTime(startTime)}
                    </Text>
                    {row.showRange && endTime && (
                      <Text
                        style={[
                          styles.rowRange,
                          { color: themeColors.textSecondary },
                        ]}
                      >
                        to {formatTime(endTime)}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
        </View>

        <View style={[styles.card, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.cardTitle, { color: themeColors.text }]}>
            {getTranslation("otherTimes", currentLanguage)}
          </Text>
          {prayerData &&
            otherRows.map((row) => {
              const time = prayerData.timings[row.key];

              return (
                <View
                  key={row.label}
                  style={[
                    styles.row,
                    { borderBottomColor: themeColors.border },
                  ]}
                >
                  <View style={styles.rowLeft}>
                    <Text style={styles.rowIcon}>{row.icon}</Text>
                    <Text
                      style={[
                        styles.rowLabel,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      {row.label}
                    </Text>
                  </View>
                  <View style={styles.rowRight}>
                    <Text style={[styles.rowTime, { color: themeColors.text }]}>
                      {formatTime(time)}
                    </Text>
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  hijriContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  gregorianDate: {
    fontSize: 12,
    fontWeight: "600",
  },
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    paddingHorizontal: spacing.sm,
  },
  rowActive: {
    // borderRadius: borderRadius.md,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  rowIcon: {
    fontSize: 14,
  },
  rowLabel: {
    fontSize: 13,
  },
  rowLabelActive: {
    fontWeight: "700",
  },
  rowRight: {
    alignItems: "flex-end",
  },
  rowTime: {
    fontSize: 14,
    fontWeight: "600",
  },
  rowTimeActive: {},
  rowRange: {
    fontSize: 11,
    marginTop: 2,
  },
  errorText: {
    fontSize: 13,
  },
});
