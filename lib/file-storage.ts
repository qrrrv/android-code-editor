import AsyncStorage from "@react-native-async-storage/async-storage";

export interface StoredFile {
  id: string;
  name: string;
  language: string;
  content: string;
  size: number;
  modified: number;
  created: number;
}

const FILES_KEY = "code_editor_files";
const CURRENT_FILE_KEY = "code_editor_current_file";

/**
 * Save a file to local storage
 */
export async function saveFile(file: StoredFile): Promise<void> {
  try {
    const files = await getAllFiles();
    const existingIndex = files.findIndex((f) => f.id === file.id);

    const updatedFile = {
      ...file,
      size: file.content.length,
      modified: Date.now(),
    };

    if (existingIndex >= 0) {
      files[existingIndex] = updatedFile;
    } else {
      files.push({
        ...updatedFile,
        created: Date.now(),
      });
    }

    await AsyncStorage.setItem(FILES_KEY, JSON.stringify(files));
  } catch (error) {
    console.error("Error saving file:", error);
    throw error;
  }
}

/**
 * Get all files from local storage
 */
export async function getAllFiles(): Promise<StoredFile[]> {
  try {
    const data = await AsyncStorage.getItem(FILES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting files:", error);
    return [];
  }
}

/**
 * Get a specific file by ID
 */
export async function getFile(id: string): Promise<StoredFile | null> {
  try {
    const files = await getAllFiles();
    return files.find((f) => f.id === id) || null;
  } catch (error) {
    console.error("Error getting file:", error);
    return null;
  }
}

/**
 * Delete a file by ID
 */
export async function deleteFile(id: string): Promise<void> {
  try {
    const files = await getAllFiles();
    const filtered = files.filter((f) => f.id !== id);
    await AsyncStorage.setItem(FILES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

/**
 * Rename a file
 */
export async function renameFile(id: string, newName: string): Promise<void> {
  try {
    const file = await getFile(id);
    if (file) {
      file.name = newName;
      await saveFile(file);
    }
  } catch (error) {
    console.error("Error renaming file:", error);
    throw error;
  }
}

/**
 * Get recent files (sorted by modification time)
 */
export async function getRecentFiles(limit: number = 10): Promise<StoredFile[]> {
  try {
    const files = await getAllFiles();
    return files.sort((a, b) => b.modified - a.modified).slice(0, limit);
  } catch (error) {
    console.error("Error getting recent files:", error);
    return [];
  }
}

/**
 * Search files by name or content
 */
export async function searchFiles(query: string): Promise<StoredFile[]> {
  try {
    const files = await getAllFiles();
    const lowerQuery = query.toLowerCase();
    return files.filter(
      (f) =>
        f.name.toLowerCase().includes(lowerQuery) ||
        f.content.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error("Error searching files:", error);
    return [];
  }
}

/**
 * Save current file ID for quick access
 */
export async function setCurrentFile(id: string): Promise<void> {
  try {
    await AsyncStorage.setItem(CURRENT_FILE_KEY, id);
  } catch (error) {
    console.error("Error setting current file:", error);
  }
}

/**
 * Get current file ID
 */
export async function getCurrentFile(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(CURRENT_FILE_KEY);
  } catch (error) {
    console.error("Error getting current file:", error);
    return null;
  }
}

/**
 * Create a new file with a template
 */
export async function createFile(
  name: string,
  language: string,
  template: string = ""
): Promise<StoredFile> {
  const file: StoredFile = {
    id: Date.now().toString(),
    name,
    language,
    content: template,
    size: template.length,
    modified: Date.now(),
    created: Date.now(),
  };

  await saveFile(file);
  return file;
}

/**
 * Get language templates
 */
export const LANGUAGE_TEMPLATES: Record<string, string> = {
  javascript: `// JavaScript Template
function hello() {
  console.log('Hello, World!');
}

hello();
`,
  python: `# Python Template
def hello():
    print('Hello, World!')

if __name__ == '__main__':
    hello()
`,
  java: `// Java Template
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`,
  cpp: `// C++ Template
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>
`,
  css: `/* CSS Template */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
}

h1 {
    color: #333;
    text-align: center;
}
`,
  json: `{
  "name": "example",
  "version": "1.0.0",
  "description": "JSON Template"
}
`,
  xml: `<?xml version="1.0" encoding="UTF-8"?>
<root>
    <element>Hello, World!</element>
</root>
`,
};
