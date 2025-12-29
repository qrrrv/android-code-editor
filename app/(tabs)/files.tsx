import { ScrollView, Text, View, Pressable, FlatList, Alert, TextInput } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { getAllFiles, deleteFile, createFile, LANGUAGE_TEMPLATES, setCurrentFile } from "@/lib/file-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useSettings } from "@/lib/settings-context";
import { t } from "@/lib/i18n";

interface CodeFile {
  id: string;
  name: string;
  language: string;
  size: number;
  modified: string;
  content: string;
}

export default function FilesScreen() {
  const colors = useColors();
  const { settings } = useSettings();
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [customFileName, setCustomFileName] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Reload files when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadFiles();
    }, [])
  );

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const storedFiles = await getAllFiles();
      const formattedFiles = storedFiles.map((file) => ({
        id: file.id,
        name: file.name,
        language: file.language,
        size: file.size,
        modified: formatDate(file.modified),
        content: file.content,
      }));
      setFiles(formattedFiles);
    } catch (error) {
      console.error("Error loading files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return settings.language === "ru" ? "Сегодня" : "Today";
    if (days === 1) return settings.language === "ru" ? "Вчера" : "Yesterday";
    if (days < 7)
      return settings.language === "ru" ? `${days} дней назад` : `${days} days ago`;
    return date.toLocaleDateString();
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCreateFile = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      t("files.selectLanguage", settings.language),
      "",
      [
        {
          text: "JavaScript",
          onPress: async () => {
            const newFile = await createFile("untitled.js", "JavaScript", LANGUAGE_TEMPLATES.javascript);
            await setCurrentFile(newFile.id);
            loadFiles();
          },
        },
        {
          text: "Python",
          onPress: async () => {
            const newFile = await createFile("untitled.py", "Python", LANGUAGE_TEMPLATES.python);
            await setCurrentFile(newFile.id);
            loadFiles();
          },
        },
        {
          text: "Java",
          onPress: async () => {
            const newFile = await createFile("HelloWorld.java", "Java", LANGUAGE_TEMPLATES.java);
            await setCurrentFile(newFile.id);
            loadFiles();
          },
        },
        {
          text: "HTML",
          onPress: async () => {
            const newFile = await createFile("index.html", "HTML", LANGUAGE_TEMPLATES.html);
            await setCurrentFile(newFile.id);
            loadFiles();
          },
        },
        {
          text: "CSS",
          onPress: async () => {
            const newFile = await createFile("style.css", "CSS", LANGUAGE_TEMPLATES.css);
            await setCurrentFile(newFile.id);
            loadFiles();
          },
        },
        {
          text: settings.language === "ru" ? "Пользовательский" : "Custom",
          onPress: () => setShowCustomInput(true),
        },
        { text: t("files.cancel", settings.language), onPress: () => {} },
      ]
    );
  }, [settings.language]);

  const handleCreateCustomFile = async () => {
    if (!customFileName.trim()) {
      Alert.alert(
        settings.language === "ru" ? "Ошибка" : "Error",
        settings.language === "ru"
          ? "Пожалуйста, введите имя файла"
          : "Please enter a file name"
      );
      return;
    }

    const newFile = await createFile(customFileName, "text", "");
    await setCurrentFile(newFile.id);
    setCustomFileName("");
    setShowCustomInput(false);
    loadFiles();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleDeleteFile = useCallback(
    (id: string, name: string) => {
      Alert.alert(
        t("files.deleteConfirm", settings.language),
        name,
        [
          { text: t("files.cancel", settings.language), onPress: () => {} },
          {
            text: t("files.delete", settings.language),
            onPress: async () => {
              try {
                await deleteFile(id);
                loadFiles();
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              } catch (error) {
                console.error("Error deleting file:", error);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              }
            },
            style: "destructive",
          },
        ]
      );
    },
    [settings.language]
  );

  const handleOpenFile = useCallback(
    (id: string) => {
      setCurrentFile(id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    []
  );

  const getLanguageColor = (language: string) => {
    const colorMap: Record<string, string> = {
      JavaScript: "#F7DF1E",
      Python: "#3776AB",
      Java: "#007396",
      CSS: "#1572B6",
      HTML: "#E34C26",
      JSON: "#000000",
      XML: "#FF6B6B",
      "C++": "#00599C",
      text: "#6B7280",
    };
    return colorMap[language] || colors.primary;
  };

  const renderFileItem = ({ item }: { item: CodeFile }) => (
    <Pressable
      onPress={() => handleOpenFile(item.id)}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View className="bg-surface border border-border rounded-lg p-4 mb-3 flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">{item.name}</Text>
          <View className="flex-row gap-2 mt-2">
            <Text
              className="text-xs font-semibold px-2 py-1 rounded"
              style={{ color: getLanguageColor(item.language), backgroundColor: colors.background }}
            >
              {item.language}
            </Text>
            <Text className="text-xs text-muted">{item.size} bytes</Text>
            <Text className="text-xs text-muted">{item.modified}</Text>
          </View>
        </View>
        <Pressable
          onPress={() => handleDeleteFile(item.id, item.name)}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.7 : 1,
              paddingHorizontal: 12,
              paddingVertical: 8,
            },
          ]}
        >
          <Text className="text-lg text-error">×</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="bg-background flex-1" edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="bg-surface border-b border-border px-4 py-4">
        <Text className="text-2xl font-bold text-foreground mb-4">
          {t("files.title", settings.language)}
        </Text>
        <View className="bg-background border border-border rounded-lg px-3 py-2 flex-row items-center">
          <Text className="text-muted mr-2">🔍</Text>
          <TextInput
            placeholder={t("files.search", settings.language)}
            placeholderTextColor={colors.muted}
            value={searchText}
            onChangeText={setSearchText}
            className="flex-1 text-foreground"
            style={{ color: colors.foreground }}
          />
        </View>
      </View>

      {/* Custom File Input Modal */}
      {showCustomInput && (
        <View className="absolute inset-0 bg-black/50 flex-1 items-center justify-center z-50">
          <View className="bg-surface rounded-lg p-6 w-4/5">
            <Text className="text-lg font-bold text-foreground mb-4">
              {settings.language === "ru" ? "Создать файл" : "Create File"}
            </Text>
            <TextInput
              placeholder={settings.language === "ru" ? "Имя файла" : "File name"}
              placeholderTextColor={colors.muted}
              value={customFileName}
              onChangeText={setCustomFileName}
              className="border border-border rounded-lg px-4 py-3 text-foreground mb-4"
              style={{ color: colors.foreground }}
            />
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => {
                  setShowCustomInput(false);
                  setCustomFileName("");
                }}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    backgroundColor: colors.background,
                    paddingVertical: 10,
                    borderRadius: 6,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text className="text-center font-semibold text-foreground">
                  {t("files.cancel", settings.language)}
                </Text>
              </Pressable>
              <Pressable
                onPress={handleCreateCustomFile}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    backgroundColor: colors.primary,
                    paddingVertical: 10,
                    borderRadius: 6,
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}
              >
                <Text className="text-center font-semibold text-background">
                  {settings.language === "ru" ? "Создать" : "Create"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Files List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted">
            {settings.language === "ru" ? "Загрузка файлов..." : "Loading files..."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFiles}
          renderItem={renderFileItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          scrollEnabled
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <Text className="text-muted text-base">
                {t("files.noFiles", settings.language)}
              </Text>
              <Text className="text-muted text-sm mt-2">
                {t("files.createNew", settings.language)}
              </Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button */}
      <Pressable
        onPress={handleCreateFile}
        style={({ pressed }) => [
          {
            position: "absolute",
            bottom: 80,
            right: 16,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.primary,
            justifyContent: "center",
            alignItems: "center",
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.95 : 1 }],
          },
        ]}
      >
        <Text className="text-2xl text-background font-bold">+</Text>
      </Pressable>
    </ScreenContainer>
  );
}
