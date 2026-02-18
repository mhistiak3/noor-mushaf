import React, { createContext, useContext, useEffect, useState } from "react";
import type { LanguageCode } from "../utils/languages";
import { getLanguage, getTheme, setLanguage, setTheme } from "../utils/storage";
import type { ThemeName } from "../utils/themes";
import { themes } from "../utils/themes";

type AppContextType = {
  currentTheme: ThemeName;
  setCurrentTheme: (theme: ThemeName) => Promise<void>;
  currentLanguage: LanguageCode;
  setCurrentLanguage: (language: LanguageCode) => Promise<void>;
  themeColors: typeof themes.ocean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentThemeState] = useState<ThemeName>("ocean");
  const [currentLanguage, setCurrentLanguageState] =
    useState<LanguageCode>("en");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const theme = await getTheme();
    const language = await getLanguage();
    setCurrentThemeState(theme);
    setCurrentLanguageState(language);
    setIsLoaded(true);
  };

  const handleSetTheme = async (theme: ThemeName) => {
    setCurrentThemeState(theme);
    await setTheme(theme);
  };

  const handleSetLanguage = async (language: LanguageCode) => {
    setCurrentLanguageState(language);
    await setLanguage(language);
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        currentTheme,
        setCurrentTheme: handleSetTheme,
        currentLanguage,
        setCurrentLanguage: handleSetLanguage,
        themeColors: themes[currentTheme],
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
