import AsyncStorage from "@react-native-async-storage/async-storage";
import type { LanguageCode } from "./languages";
import type { ThemeName } from "./themes";

const BOOKMARKS_KEY = "bookmarks";
const LAST_READ_KEY = "lastReadPage";
const PRAYER_TIMES_CACHE_KEY = "prayerTimesCache";
const THEME_KEY = "appTheme";
const LANGUAGE_KEY = "appLanguage";

export type PrayerTimings = {
  Imsak: string;
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Sunset: string;
  Midnight: string;
};

export type PrayerTimesCache = {
  fetchedAt: number;
  hijriDate: string;
  hijriDay: number; // Hijri day for cache validation
  gregorianDate: string;
  timings: PrayerTimings;
};

export async function getBookmarks(): Promise<number[]> {
  const raw = await AsyncStorage.getItem(BOOKMARKS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .map((value) => Number(value))
        .filter((value) => !Number.isNaN(value));
    }
  } catch {
    return [];
  }
  return [];
}

export async function setBookmarks(bookmarks: number[]): Promise<void> {
  const sorted = Array.from(new Set(bookmarks)).sort((a, b) => a - b);
  await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(sorted));
}

export async function getLastReadPage(): Promise<number> {
  const raw = await AsyncStorage.getItem(LAST_READ_KEY);
  if (!raw) return 1;
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? 1 : Math.max(1, parsed);
}

export async function setLastReadPage(page: number): Promise<void> {
  await AsyncStorage.setItem(LAST_READ_KEY, String(Math.max(1, page)));
}

export async function getPrayerTimesCache(): Promise<PrayerTimesCache | null> {
  const raw = await AsyncStorage.getItem(PRAYER_TIMES_CACHE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PrayerTimesCache;
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.timings || typeof parsed.fetchedAt !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function setPrayerTimesCache(
  cache: PrayerTimesCache,
): Promise<void> {
  await AsyncStorage.setItem(PRAYER_TIMES_CACHE_KEY, JSON.stringify(cache));
}
export async function getTheme(): Promise<ThemeName> {
  const raw = await AsyncStorage.getItem(THEME_KEY);
  if (!raw) return "ocean";
  const theme = raw as ThemeName;
  const validThemes: ThemeName[] = [
    "ocean",
    "forest",
    "sunset",
    "midnight",
    "lavender",
    "coral",
  ];
  return validThemes.includes(theme) ? theme : "ocean";
}

export async function setTheme(theme: ThemeName): Promise<void> {
  await AsyncStorage.setItem(THEME_KEY, theme);
}

export async function getLanguage(): Promise<LanguageCode> {
  const raw = await AsyncStorage.getItem(LANGUAGE_KEY);
  if (!raw) return "en";
  const lang = raw as LanguageCode;
  return lang === "en" || lang === "bn" ? lang : "en";
}

export async function setLanguage(language: LanguageCode): Promise<void> {
  await AsyncStorage.setItem(LANGUAGE_KEY, language);
}
