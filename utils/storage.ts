import AsyncStorage from "@react-native-async-storage/async-storage";

const BOOKMARKS_KEY = "bookmarks";
const LAST_READ_KEY = "lastReadPage";

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
