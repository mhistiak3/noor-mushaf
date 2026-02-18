export type LanguageCode = "en" | "bn";

export type Translations = {
  settings: string;
  theme: string;
  language: string;
  selectTheme: string;
  selectLanguage: string;
  english: string;
  bangla: string;
  appearance: string;
  appLanguage: string;
  darkMode: string;
  about: string;
  version: string;
  allPara: string;
  browseJuz: string;
  allSura: string;
  browseSuras: string;
  bookmarks: string;
  savedPages: string;
  lastRead: string;
  continueFrom: string;
  goToPage: string;
  openAnyPage: string;
  prayerTimes: string;
  fullSchedule: string;
  quranReader: string;
  noBookmarks: string;
  page: string;
  farzSalat: string;
  otherTimes: string;
  sura: string;
  ayahs: string;
  para: string;
  sahri: string;
  iftar: string;
  nightReading: string;
  jumpToPage: string;
  recent: string;
  go: string;
  cancel: string;
  allParaDesc: string;
  allSuraDesc: string;
  currentPrayer: string;
  nextPrayer: string;
};

export const translations: Record<LanguageCode, Translations> = {
  en: {
    settings: "Settings",
    theme: "Theme",
    language: "Language",
    selectTheme: "Select Theme",
    selectLanguage: "Select Language",
    english: "English",
    bangla: "Bangla",
    appearance: "Appearance",
    appLanguage: "App Language",
    darkMode: "Dark Mode",
    about: "About",
    version: "Version",
    allPara: "All Para",
    browseJuz: "Browse 30 Juz",
    allSura: "All Sura",
    browseSuras: "Browse 114 Suras",
    bookmarks: "Bookmarks",
    savedPages: "Saved pages",
    lastRead: "Last Read",
    continueFrom: "Continue from page",
    goToPage: "Go to Page",
    openAnyPage: "Open any page by number",
    prayerTimes: "Prayer Times",
    fullSchedule: "Full daily schedule",
    quranReader: "Quran Reader",
    noBookmarks: "No bookmarks yet",
    page: "Page",
    farzSalat: "Farz Salat",
    otherTimes: "Other Times",
    sura: "divisions of the Quran ordered by revelation",
    ayahs: "Ayahs",
    para: "30 divisions of the Quran for easy reading",
    sahri: "Sahri",
    iftar: "Iftar",
    nightReading: "Night reading",
    jumpToPage: "Go to page",
    recent: "Recent",
    go: "Go",
    cancel: "Cancel",
    allParaDesc: "30 divisions of the Quran for easy reading",
    allSuraDesc: "114 chapters of the Quran ordered by revelation",
    currentPrayer: "Current",
    nextPrayer: "Next",
  },
  bn: {
    settings: "সেটিংস",
    theme: "থিম",
    language: "ভাষা",
    selectTheme: "থিম নির্বাচন করুন",
    selectLanguage: "ভাষা নির্বাচন করুন",
    english: "ইংরেজি",
    bangla: "বাংলা",
    appearance: "চেহারা",
    appLanguage: "অ্যাপ্লিকেশন ভাষা",
    darkMode: "ডার্ক মোড",
    about: "সম্পর্কে",
    version: "সংস্করণ",
    allPara: "সব পারা",
    browseJuz: "৩০টি জুজ ব্রাউজ করুন",
    allSura: "সব সুরা",
    browseSuras: "১১৪টি সুরা ব্রাউজ করুন",
    bookmarks: "বুকমার্ক",
    savedPages: "সংরক্ষিত পৃষ্ঠা",
    lastRead: "শেষ পড়া",
    continueFrom: "পৃষ্ঠা থেকে চালিয়ে যান",
    goToPage: "পৃষ্ঠায় যান",
    openAnyPage: "যেকোনো পৃষ্ঠা সংখ্যা দ্বারা খুলুন",
    prayerTimes: "নামাজের সময়",
    fullSchedule: "সম্পূর্ণ দৈনিক সূচি",
    quranReader: "কুরআন রিডার",
    noBookmarks: "এখনো কোনো বুকমার্ক নেই",
    page: "পৃষ্ঠা",
    farzSalat: "ফার্জ সালাত",
    otherTimes: "অন্যান্য সময়",
    sura: "সুরা কুরআনের অধ্যায় যা প্রকাশের ক্রম অনুসারে সাজানো",
    ayahs: "আয়াত",
    para: "কুরআনের সহজ পাঠের জন্য ৩০টি বিভাগ",
    sahri: "সাহরি",
    iftar: "ইফতার",
    nightReading: "রাতের পাঠ",
    jumpToPage: "পৃষ্ঠায় যান",
    recent: "সম্প্রতি",
    go: "যান",
    cancel: "বাতিল করুন",
    allParaDesc: "কুরআনের সহজ পাঠের জন্য ৩০টি বিভাগ",
    allSuraDesc: "কুরআন প্রকাশের ক্রম অনুসারে সাজানো ১১৪টি অধ্যায়",
    currentPrayer: "বর্তমান",
    nextPrayer: "পরবর্তী",
  },
};

export function getTranslation(
  key: keyof Translations,
  language: LanguageCode,
): string {
  return translations[language][key];
}
