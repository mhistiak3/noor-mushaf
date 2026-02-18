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
import {
  getPrayerTimesCache,
  setPrayerTimesCache,
  type PrayerTimings,
} from "../utils/storage";
import { borderRadius, colors, shadows, spacing } from "../utils/theme";

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

const CACHE_TTL_MS = 12 * 60 * 60 * 1000;

export default function PrayerTimesScreen() {
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

    if (cached) {
      setPrayerData({
        hijriDate: cached.hijriDate,
        gregorianDate: cached.gregorianDate,
        timings: cached.timings,
      });
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
      setPrayerData(fresh);
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
  }, [fetchPrayerTimesFromApi]);

  useEffect(() => {
    loadPrayerTimes();
  }, [loadPrayerTimes]);

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
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      </SafeScreen>
    );
  }

  if (error || !prayerData) {
    return (
      <SafeScreen>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error || "Unable to load"}</Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.hijriContainer}>
            <Text style={styles.hijriIcon}>🌙</Text>
            <Text style={styles.hijriDate}>{prayerData.hijriDate}</Text>
          </View>
          <Text style={styles.gregorianDate}>{prayerData.gregorianDate}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Farz Salat</Text>
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
                  style={[styles.row, isCurrent && styles.rowActive]}
                >
                  <View style={styles.rowLeft}>
                    <Text style={styles.rowIcon}>{row.icon}</Text>
                    <Text
                      style={[
                        styles.rowLabel,
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
                        isCurrent && styles.rowTimeActive,
                      ]}
                    >
                      {formatTime(startTime)}
                    </Text>
                    {row.showRange && endTime && (
                      <Text style={styles.rowRange}>
                        to {formatTime(endTime)}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Other Times</Text>
          {prayerData &&
            otherRows.map((row) => {
              const time = prayerData.timings[row.key];

              return (
                <View key={row.label} style={styles.row}>
                  <View style={styles.rowLeft}>
                    <Text style={styles.rowIcon}>{row.icon}</Text>
                    <Text style={styles.rowLabel}>{row.label}</Text>
                  </View>
                  <View style={styles.rowRight}>
                    <Text style={styles.rowTime}>{formatTime(time)}</Text>
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
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.sm,
  },
  rowActive: {
    backgroundColor: colors.primaryLight + "25",
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
    color: colors.textSecondary,
  },
  rowLabelActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  rowRight: {
    alignItems: "flex-end",
  },
  rowTime: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  rowTimeActive: {
    color: colors.primary,
  },
  rowRange: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  errorText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
