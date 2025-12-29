import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Language } from "./i18n";

interface EditorSettings {
  language: Language;
  fontSize: number;
  fontFamily: string;
  lineNumbers: boolean;
  syntaxHighlight: boolean;
  autoSave: boolean;
  theme: "light" | "dark";
  tabSize: number;
}

interface SettingsContextType {
  settings: EditorSettings;
  updateSettings: (settings: Partial<EditorSettings>) => Promise<void>;
  isLoading: boolean;
}

const defaultSettings: EditorSettings = {
  language: "en",
  fontSize: 14,
  fontFamily: "monospace",
  lineNumbers: true,
  syntaxHighlight: true,
  autoSave: true,
  theme: "light",
  tabSize: 2,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_KEY = "code_editor_settings";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<EditorSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<EditorSettings>) => {
    try {
      const updated = { ...settings, ...newSettings };
      setSettings(updated);
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
