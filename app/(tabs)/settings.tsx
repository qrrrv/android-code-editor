import { ScrollView, Text, View, Pressable, Switch } from "react-native";
import { useState, useCallback } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import * as Haptics from "expo-haptics";

export default function SettingsScreen() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState("monospace");
  const [lineNumbers, setLineNumbers] = useState(true);
  const [syntaxHighlight, setSyntaxHighlight] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [theme, setTheme] = useState(colorScheme || "light");

  const fontSizes = [12, 14, 16, 18, 20, 24];
  const fontFamilies = ["Monospace", "Courier", "Roboto Mono"];

  const handleToggle = useCallback(
    (setter: (value: boolean) => void, currentValue: boolean) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setter(!currentValue);
    },
    []
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
          <Text className="text-2xl font-bold text-foreground">Settings</Text>
        </View>

        {/* Editor Section */}
        <View className="mt-4">
          <Text className="text-xs font-bold text-muted px-4 py-2 uppercase">Editor</Text>
          <View className="bg-surface">
            <ToggleRow
              label="Line Numbers"
              value={lineNumbers}
              onToggle={() => handleToggle(setLineNumbers, lineNumbers)}
            />
            <ToggleRow
              label="Syntax Highlighting"
              value={syntaxHighlight}
              onToggle={() => handleToggle(setSyntaxHighlight, syntaxHighlight)}
            />
            <ToggleRow
              label="Auto Save"
              value={autoSave}
              onToggle={() => handleToggle(setAutoSave, autoSave)}
            />
          </View>
        </View>

        {/* Font Section */}
        <View className="mt-4">
          <Text className="text-xs font-bold text-muted px-4 py-2 uppercase">Font</Text>
          <View className="bg-surface">
            <SettingRow
              label="Font Size"
              value={`${fontSize}pt`}
              onPress={() => {}}
            />
            <View className="px-4 py-3 border-b border-border flex-row gap-2 flex-wrap">
              {fontSizes.map((size) => (
                <Pressable
                  key={size}
                  onPress={() => {
                    setFontSize(size);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={({ pressed }) => [
                    {
                      backgroundColor: fontSize === size ? colors.primary : colors.background,
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
                      color: fontSize === size ? colors.background : colors.foreground,
                    }}
                  >
                    {size}
                  </Text>
                </Pressable>
              ))}
            </View>

            <SettingRow
              label="Font Family"
              value={fontFamily}
              onPress={() => {}}
            />
            <View className="px-4 py-3 border-b border-border gap-2">
              {fontFamilies.map((family) => (
                <Pressable
                  key={family}
                  onPress={() => {
                    setFontFamily(family);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={({ pressed }) => [
                    {
                      backgroundColor: fontFamily === family ? colors.primary : colors.background,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 6,
                      opacity: pressed ? 0.8 : 1,
                      borderWidth: fontFamily === family ? 0 : 1,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color: fontFamily === family ? colors.background : colors.foreground,
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
          <Text className="text-xs font-bold text-muted px-4 py-2 uppercase">Theme</Text>
          <View className="bg-surface">
            <View className="px-4 py-3 gap-2 flex-row">
              {["light", "dark"].map((t) => (
                <Pressable
                  key={t}
                  onPress={() => {
                    setTheme(t as "light" | "dark");
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      backgroundColor: theme === t ? colors.primary : colors.background,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderRadius: 6,
                      opacity: pressed ? 0.8 : 1,
                      borderWidth: theme === t ? 0 : 1,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    className="text-sm font-semibold text-center capitalize"
                    style={{
                      color: theme === t ? colors.background : colors.foreground,
                    }}
                  >
                    {t}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* About Section */}
        <View className="mt-4">
          <Text className="text-xs font-bold text-muted px-4 py-2 uppercase">About</Text>
          <View className="bg-surface px-4 py-4">
            <Text className="text-sm text-foreground font-semibold">Code Editor</Text>
            <Text className="text-xs text-muted mt-1">Version 1.0.0</Text>
            <Text className="text-xs text-muted mt-4">
              A beautiful code editor for Android with syntax highlighting, file management, and modern design.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
