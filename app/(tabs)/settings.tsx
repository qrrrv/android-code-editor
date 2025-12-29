import { ScrollView, Text, View, Pressable, Switch } from "react-native";
import { useState, useCallback } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import * as Haptics from "expo-haptics";
import { useSettings } from "@/lib/settings-context";
import { t, type Language } from "@/lib/i18n";

export default function SettingsScreen() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const { settings, updateSettings } = useSettings();

  const fontSizes = [12, 14, 16, 18, 20, 24];
  const fontFamilies = ["Monospace", "Courier", "Roboto Mono"];
  const languages: Language[] = ["en", "ru"];

  const handleToggle = useCallback(
    async (key: keyof typeof settings, currentValue: boolean) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await updateSettings({ [key]: !currentValue });
    },
    [updateSettings]
  );

  const SettingRow = ({
    label,
    value,
    onPress,
  }: {
    label: string;
    value: string;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View className="flex-row justify-between items-center py-4 px-4 border-b border-border">
        <Text className="text-base text-foreground font-medium">{label}</Text>
        <Text className="text-sm text-primary font-semibold">{value}</Text>
      </View>
    </Pressable>
  );

  const ToggleRow = ({
    label,
    value,
    onToggle,
  }: {
    label: string;
    value: boolean;
    onToggle: () => void;
  }) => (
    <View className="flex-row justify-between items-center py-4 px-4 border-b border-border">
      <Text className="text-base text-foreground font-medium">{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={value ? colors.primary : colors.muted}
      />
    </View>
  );

  return (
    <ScreenContainer className="bg-background flex-1" edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Header */}
        <View className="bg-surface border-b border-border px-4 py-4">
          <Text className="text-2xl font-bold text-foreground">{t("settings.title", settings.language)}</Text>
        </View>

        {/* Language Section */}
        <View className="mt-4">
          <Text className="text-xs font-bold text-muted px-4 py-2 uppercase">
            {t("settings.language", settings.language)}
          </Text>
          <View className="bg-surface">
            <View className="px-4 py-3 gap-2 flex-row">
              {languages.map((lang) => (
                <Pressable
                  key={lang}
                  onPress={() => {
                    updateSettings({ language: lang });
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      backgroundColor: settings.language === lang ? colors.primary : colors.background,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderRadius: 6,
                      opacity: pressed ? 0.8 : 1,
                      borderWidth: settings.language === lang ? 0 : 1,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    className="text-sm font-semibold text-center capitalize"
                    style={{
                      color: settings.language === lang ? colors.background : colors.foreground,
                    }}
                  >
                    {lang === "en" ? "English" : "Русский"}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Editor Section */}
        <View className="mt-4">
          <Text className="text-xs font-bold text-muted px-4 py-2 uppercase">
            {t("settings.editor", settings.language)}
          </Text>
          <View className="bg-surface">
            <ToggleRow
              label={t("settings.lineNumbers", settings.language)}
              value={settings.lineNumbers}
              onToggle={() => handleToggle("lineNumbers", settings.lineNumbers)}
            />
            <ToggleRow
              label={t("settings.syntaxHighlight", settings.language)}
              value={settings.syntaxHighlight}
              onToggle={() => handleToggle("syntaxHighlight", settings.syntaxHighlight)}
            />
            <ToggleRow
              label={t("settings.autoSave", settings.language)}
              value={settings.autoSave}
              onToggle={() => handleToggle("autoSave", settings.autoSave)}
            />
          </View>
        </View>

        {/* Font Section */}
        <View className="mt-4">
          <Text className="text-xs font-bold text-muted px-4 py-2 uppercase">
            {t("settings.font", settings.language)}
          </Text>
          <View className="bg-surface">
            <SettingRow
              label={t("settings.fontSize", settings.language)}
              value={`${settings.fontSize}pt`}
              onPress={() => {}}
            />
            <View className="px-4 py-3 border-b border-border flex-row gap-2 flex-wrap">
              {fontSizes.map((size) => (
                <Pressable
                  key={size}
                  onPress={() => {
                    updateSettings({ fontSize: size });
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={({ pressed }) => [
                    {
                      backgroundColor: settings.fontSize === size ? colors.primary : colors.background,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 6,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{
                      color: settings.fontSize === size ? colors.background : colors.foreground,
                    }}
                  >
                    {size}
                  </Text>
                </Pressable>
              ))}
            </View>

            <SettingRow
              label={t("settings.fontFamily", settings.language)}
              value={settings.fontFamily}
              onPress={() => {}}
            />
            <View className="px-4 py-3 border-b border-border gap-2">
              {fontFamilies.map((family) => (
                <Pressable
                  key={family}
                  onPress={() => {
                    updateSettings({ fontFamily: family });
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={({ pressed }) => [
                    {
                      backgroundColor: settings.fontFamily === family ? colors.primary : colors.background,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 6,
                      opacity: pressed ? 0.8 : 1,
                      borderWidth: settings.fontFamily === family ? 0 : 1,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color: settings.fontFamily === family ? colors.background : colors.foreground,
                      fontFamily: family.toLowerCase(),
                    }}
                  >
                    {family}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Theme Section */}
        <View className="mt-4">
          <Text className="text-xs font-bold text-muted px-4 py-2 uppercase">
            {t("settings.theme", settings.language)}
          </Text>
          <View className="bg-surface">
            <View className="px-4 py-3 gap-2 flex-row">
              {["light", "dark"].map((t_val) => (
                <Pressable
                  key={t_val}
                  onPress={() => {
                    updateSettings({ theme: t_val as "light" | "dark" });
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      backgroundColor: settings.theme === t_val ? colors.primary : colors.background,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderRadius: 6,
                      opacity: pressed ? 0.8 : 1,
                      borderWidth: settings.theme === t_val ? 0 : 1,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    className="text-sm font-semibold text-center capitalize"
                    style={{
                      color: settings.theme === t_val ? colors.background : colors.foreground,
                    }}
                  >
                    {t_val === "light" ? t("theme.light", settings.language) : t("theme.dark", settings.language)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* About Section */}
        <View className="mt-4">
          <Text className="text-xs font-bold text-muted px-4 py-2 uppercase">
            {t("settings.about", settings.language)}
          </Text>
          <View className="bg-surface px-4 py-4">
            <Text className="text-sm text-foreground font-semibold">Code Editor</Text>
            <Text className="text-xs text-muted mt-1">
              {t("settings.version", settings.language)}: 2.0.0
            </Text>
            <Text className="text-xs text-muted mt-4">
              {t("settings.description", settings.language)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
