import { ScrollView, Text, View, Pressable, FlatList, Alert, TextInput } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { getAllFiles, deleteFile, createFile, LANGUAGE_TEMPLATES, setCurrentFile } from "@/lib/file-storage";
import { useFocusEffect } from "@react-navigation/native";

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
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCreateFile = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Create New File", "Select a language:", [
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
      { text: "Cancel", onPress: () => {} },
    ]);
  }, []);

  const handleDeleteFile = useCallback(
    (id: string, name: string) => {
      Alert.alert("Delete File", `Are you sure you want to delete "${name}"?`, [
        { text: "Cancel", onPress: () => {} },
        {
          text: "Delete",
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
      ]);
    },
    []
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
        <Text className="text-2xl font-bold text-foreground mb-4">Files</Text>
        <View className="bg-background border border-border rounded-lg px-3 py-2 flex-row items-center">
          <Text className="text-muted mr-2">🔍</Text>
          <TextInput
            placeholder="Search files..."
            placeholderTextColor={colors.muted}
            value={searchText}
            onChangeText={setSearchText}
            className="flex-1 text-foreground"
            style={{ color: colors.foreground }}
          />
        </View>
      </View>

      {/* Files List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted">Loading files...</Text>
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
              <Text className="text-muted text-base">No files found</Text>
              <Text className="text-muted text-sm mt-2">Create a new file to get started</Text>
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
