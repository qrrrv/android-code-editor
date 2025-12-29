import { ScrollView, Text, View, TextInput, Pressable, FlatList } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { saveFile, getCurrentFile, getFile } from "@/lib/file-storage";
import { highlightAdvanced } from "@/lib/advanced-highlighter";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useSettings } from "@/lib/settings-context";
import { t } from "@/lib/i18n";
import {
  handleBracketCompletion,
  handleClosingBracket,
  handleAutoIndent,
  detectLanguage,
} from "@/lib/code-editor-utils";

interface CodeFile {
  id: string;
  name: string;
  language: string;
  content: string;
}

export default function EditorScreen() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { settings } = useSettings();

  const [code, setCode] = useState(
    "// " + t("editor.welcome", settings.language) + "\n// " + t("editor.startTyping", settings.language) + "\n\nfunction hello() {\n  console.log('Hello, World!');\n}\n"
  );
  const [fileName, setFileName] = useState("untitled.js");
  const [fileId, setFileId] = useState<string>("");
  const [language, setLanguage] = useState("javascript");
  const [isSaved, setIsSaved] = useState(true);
  const [cursorPos, setCursorPos] = useState(0);

  // Load current file on mount
  useEffect(() => {
    const loadCurrentFile = async () => {
      const currentFileId = await getCurrentFile();
      if (currentFileId) {
        const file = await getFile(currentFileId);
        if (file) {
          setFileId(file.id);
          setFileName(file.name);
          setCode(file.content);
          const detectedLang = detectLanguage(file.name);
          setLanguage(detectedLang);
          setIsSaved(true);
        }
      }
    };
    loadCurrentFile();
  }, []);

  const handleSave = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await saveFile({
        id: fileId || Date.now().toString(),
        name: fileName,
        language,
        content: code,
        size: code.length,
        modified: Date.now(),
        created: Date.now(),
      });
      setIsSaved(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Error saving file:", error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [fileId, fileName, language, code]);

  const handleUndo = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleRedo = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleCodeChange = (text: string) => {
    setCode(text);
    setIsSaved(false);
  };

  const handleKeyPress = (char: string) => {
    if (char === "\n") {
      // Handle auto-indent on new line
      const result = handleAutoIndent(code, cursorPos, settings.tabSize);
      setCode(result.text);
      setCursorPos(result.cursorPosition);
    } else if (char in { "(": 1, "[": 1, "{": 1, '"': 1, "'": 1, "`": 1 }) {
      // Handle bracket completion
      const result = handleBracketCompletion(code, cursorPos, char);
      setCode(result.text);
      setCursorPos(result.cursorPosition);
    } else if (char in { ")": 1, "]": 1, "}": 1 }) {
      // Handle closing bracket
      const result = handleClosingBracket(code, cursorPos, char);
      setCode(result.text);
      setCursorPos(result.cursorPosition);
    }
  };

  const codeLines = code.split("\n");
  const highlightedTokens = settings.syntaxHighlight
    ? highlightAdvanced(code, language, isDark)
    : [];

  return (
    <ScreenContainer className="bg-background flex-1" edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="bg-surface border-b border-border px-4 py-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-sm font-semibold text-muted">{fileName}</Text>
          {!isSaved && <Text className="text-xs text-warning">●</Text>}
        </View>
        <Text className="text-xs text-muted mt-1">
          {t("editor.line", settings.language)} {codeLines.length} • {code.length}{" "}
          {t("editor.chars", settings.language)} • {language}
        </Text>
      </View>

      {/* Code Editor */}
      <View className="flex-1 flex-row bg-background">
        {/* Line Numbers */}
        {settings.lineNumbers && (
          <View className="bg-surface border-r border-border px-2 py-4 justify-start">
            {codeLines.map((_, index) => (
              <Text
                key={index}
                className="text-xs text-muted font-mono"
                style={{ height: settings.fontSize * 1.5 }}
              >
                {index + 1}
              </Text>
            ))}
          </View>
        )}

        {/* Code Input */}
        <TextInput
          value={code}
          onChangeText={handleCodeChange}
          onSelectionChange={(e) => setCursorPos(e.nativeEvent.selection.start)}
          multiline
          placeholder={t("editor.startTyping", settings.language)}
          placeholderTextColor={colors.muted}
          className="flex-1 px-4 py-4 text-foreground font-mono"
          style={{
            fontSize: settings.fontSize,
            color: colors.foreground,
            backgroundColor: colors.background,
            lineHeight: settings.fontSize * 1.5,
          }}
          scrollEnabled
        />
      </View>

      {/* Bottom Toolbar */}
      <View className="bg-surface border-t border-border px-4 py-3 flex-row justify-between items-center">
        <View className="flex-row gap-2">
          <Pressable
            onPress={handleUndo}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? colors.primary : colors.background,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 6,
              },
            ]}
          >
            <Text className="text-xs font-semibold text-primary">↶ {t("editor.undo", settings.language)}</Text>
          </Pressable>

          <Pressable
            onPress={handleRedo}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? colors.primary : colors.background,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 6,
              },
            ]}
          >
            <Text className="text-xs font-semibold text-primary">↷ {t("editor.redo", settings.language)}</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? colors.primary : colors.primary,
              opacity: pressed ? 0.9 : 1,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 6,
            },
          ]}
        >
          <Text className="text-xs font-semibold text-background">
            {isSaved ? "✓ " + t("editor.saved", settings.language) : t("editor.save", settings.language)}
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
