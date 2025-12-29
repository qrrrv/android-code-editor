import { ScrollView, Text, View, TextInput, Pressable, FlatList } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { saveFile, getCurrentFile, getFile } from "@/lib/file-storage";
import { highlightCode, getTokenColor } from "@/lib/syntax-highlighter";
import { useColorScheme } from "@/hooks/use-color-scheme";

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
  const [code, setCode] = useState("// Welcome to Code Editor\n// Start typing your code here...\n\nfunction hello() {\n  console.log('Hello, World!');\n}\n");
  const [fileName, setFileName] = useState("untitled.js");
  const [fileId, setFileId] = useState<string>("");
  const [language, setLanguage] = useState("javascript");
  const [lineNumbers, setLineNumbers] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [isSaved, setIsSaved] = useState(true);

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
          setLanguage(file.language);
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

  const codeLines = code.split("\n");

  return (
    <ScreenContainer className="bg-background flex-1" edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="bg-surface border-b border-border px-4 py-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-sm font-semibold text-muted">{fileName}</Text>
          {!isSaved && <Text className="text-xs text-warning">●</Text>}
        </View>
        <Text className="text-xs text-muted mt-1">
          Line {codeLines.length} • {code.length} chars • {language}
        </Text>
      </View>

      {/* Code Editor */}
      <View className="flex-1 flex-row bg-background">
        {/* Line Numbers */}
        {lineNumbers && (
          <View className="bg-surface border-r border-border px-2 py-4 justify-start">
            {codeLines.map((_, index) => (
              <Text
                key={index}
                className="text-xs text-muted font-mono"
                style={{ height: fontSize * 1.5 }}
              >
                {index + 1}
              </Text>
            ))}
          </View>
        )}

        {/* Code Input */}
        <TextInput
          value={code}
          onChangeText={(text) => {
            setCode(text);
            setIsSaved(false);
          }}
          multiline
          placeholder="Enter your code here..."
          placeholderTextColor={colors.muted}
          className="flex-1 px-4 py-4 text-foreground font-mono"
          style={{
            fontSize,
            color: colors.foreground,
            backgroundColor: colors.background,
            lineHeight: fontSize * 1.5,
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
            <Text className="text-xs font-semibold text-primary">↶ Undo</Text>
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
            <Text className="text-xs font-semibold text-primary">↷ Redo</Text>
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
          <Text className="text-xs font-semibold text-background">{isSaved ? "✓ Saved" : "Save"}</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
