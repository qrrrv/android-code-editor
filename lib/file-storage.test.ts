import { describe, it, expect, beforeEach, vi } from "vitest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  saveFile,
  getAllFiles,
  getFile,
  deleteFile,
  renameFile,
  getRecentFiles,
  searchFiles,
  setCurrentFile,
  getCurrentFile,
  createFile,
  LANGUAGE_TEMPLATES,
} from "./file-storage";

// Mock AsyncStorage
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe("File Storage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("saveFile", () => {
    it("should save a new file to storage", async () => {
      const mockSetItem = vi.spyOn(AsyncStorage, "setItem");
      const mockGetItem = vi.spyOn(AsyncStorage, "getItem").mockResolvedValue(null);

      const file = {
        id: "1",
        name: "test.js",
        language: "javascript",
        content: "console.log('test');",
        size: 0,
        modified: Date.now(),
        created: Date.now(),
      };

      await saveFile(file);

      expect(mockSetItem).toHaveBeenCalled();
      expect(mockGetItem).toHaveBeenCalled();
    });

    it("should update an existing file", async () => {
      const existingFile = {
        id: "1",
        name: "test.js",
        language: "javascript",
        content: "console.log('test');",
        size: 20,
        modified: Date.now(),
        created: Date.now(),
      };

      const mockGetItem = vi
        .spyOn(AsyncStorage, "getItem")
        .mockResolvedValue(JSON.stringify([existingFile]));
      const mockSetItem = vi.spyOn(AsyncStorage, "setItem");

      const updatedFile = {
        ...existingFile,
        content: "console.log('updated');",
        size: 0,
        modified: Date.now(),
        created: Date.now(),
      };

      await saveFile(updatedFile);

      expect(mockSetItem).toHaveBeenCalled();
    });
  });

  describe("getAllFiles", () => {
    it("should return all files from storage", async () => {
      const mockFiles = [
        {
          id: "1",
          name: "test.js",
          language: "javascript",
          content: "console.log('test');",
          size: 20,
          modified: Date.now(),
          created: Date.now(),
        },
      ];

      vi.spyOn(AsyncStorage, "getItem").mockResolvedValue(JSON.stringify(mockFiles));

      const files = await getAllFiles();

      expect(files).toEqual(mockFiles);
    });

    it("should return empty array if no files exist", async () => {
      vi.spyOn(AsyncStorage, "getItem").mockResolvedValue(null);

      const files = await getAllFiles();

      expect(files).toEqual([]);
    });
  });

  describe("getFile", () => {
    it("should return a file by ID", async () => {
      const mockFile = {
        id: "1",
        name: "test.js",
        language: "javascript",
        content: "console.log('test');",
        size: 20,
        modified: Date.now(),
        created: Date.now(),
      };

      vi.spyOn(AsyncStorage, "getItem").mockResolvedValue(JSON.stringify([mockFile]));

      const file = await getFile("1");

      expect(file).toEqual(mockFile);
    });

    it("should return null if file not found", async () => {
      vi.spyOn(AsyncStorage, "getItem").mockResolvedValue(JSON.stringify([]));

      const file = await getFile("nonexistent");

      expect(file).toBeNull();
    });
  });

  describe("deleteFile", () => {
    it("should delete a file by ID", async () => {
      const mockFiles = [
        {
          id: "1",
          name: "test.js",
          language: "javascript",
          content: "console.log('test');",
          size: 20,
          modified: Date.now(),
          created: Date.now(),
        },
        {
          id: "2",
          name: "test2.js",
          language: "javascript",
          content: "console.log('test2');",
          size: 21,
          modified: Date.now(),
          created: Date.now(),
        },
      ];

      vi.spyOn(AsyncStorage, "getItem").mockResolvedValue(JSON.stringify(mockFiles));
      const mockSetItem = vi.spyOn(AsyncStorage, "setItem");

      await deleteFile("1");

      expect(mockSetItem).toHaveBeenCalled();
    });
  });

  describe("renameFile", () => {
    it("should rename a file", async () => {
      const mockFile = {
        id: "1",
        name: "test.js",
        language: "javascript",
        content: "console.log('test');",
        size: 20,
        modified: Date.now(),
        created: Date.now(),
      };

      vi.spyOn(AsyncStorage, "getItem").mockResolvedValue(JSON.stringify([mockFile]));
      const mockSetItem = vi.spyOn(AsyncStorage, "setItem");

      await renameFile("1", "renamed.js");

      expect(mockSetItem).toHaveBeenCalled();
    });
  });

  describe("getRecentFiles", () => {
    it("should return recent files sorted by modification time", async () => {
      const now = Date.now();
      const mockFiles = [
        {
          id: "1",
          name: "test1.js",
          language: "javascript",
          content: "console.log('test1');",
          size: 20,
          modified: now - 1000,
          created: now - 2000,
        },
        {
          id: "2",
          name: "test2.js",
          language: "javascript",
          content: "console.log('test2');",
          size: 21,
          modified: now,
          created: now - 1000,
        },
      ];

      vi.spyOn(AsyncStorage, "getItem").mockResolvedValue(JSON.stringify(mockFiles));

      const recentFiles = await getRecentFiles(10);

      expect(recentFiles[0].id).toBe("2");
      expect(recentFiles[1].id).toBe("1");
    });
  });

  describe("searchFiles", () => {
    it("should search files by name", async () => {
      const mockFiles = [
        {
          id: "1",
          name: "test.js",
          language: "javascript",
          content: "console.log('test');",
          size: 20,
          modified: Date.now(),
          created: Date.now(),
        },
        {
          id: "2",
          name: "app.js",
          language: "javascript",
          content: "console.log('app');",
          size: 19,
          modified: Date.now(),
          created: Date.now(),
        },
      ];

      vi.spyOn(AsyncStorage, "getItem").mockResolvedValue(JSON.stringify(mockFiles));

      const results = await searchFiles("test");

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe("test.js");
    });

    it("should search files by content", async () => {
      const mockFiles = [
        {
          id: "1",
          name: "test.js",
          language: "javascript",
          content: "console.log('hello');",
          size: 20,
          modified: Date.now(),
          created: Date.now(),
        },
        {
          id: "2",
          name: "app.js",
          language: "javascript",
          content: "console.log('world');",
          size: 19,
          modified: Date.now(),
          created: Date.now(),
        },
      ];

      vi.spyOn(AsyncStorage, "getItem").mockResolvedValue(JSON.stringify(mockFiles));

      const results = await searchFiles("hello");

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe("1");
    });
  });

  describe("setCurrentFile and getCurrentFile", () => {
    it("should set and get current file ID", async () => {
      const mockSetItem = vi.spyOn(AsyncStorage, "setItem");
      const mockGetItem = vi.spyOn(AsyncStorage, "getItem").mockResolvedValue("file-123");

      await setCurrentFile("file-123");
      const currentFileId = await getCurrentFile();

      expect(mockSetItem).toHaveBeenCalledWith("code_editor_current_file", "file-123");
      expect(currentFileId).toBe("file-123");
    });
  });

  describe("createFile", () => {
    it("should create a new file with template", async () => {
      const mockSetItem = vi.spyOn(AsyncStorage, "setItem");
      const mockGetItem = vi.spyOn(AsyncStorage, "getItem").mockResolvedValue(null);

      const file = await createFile("test.js", "JavaScript", LANGUAGE_TEMPLATES.javascript);

      expect(file.name).toBe("test.js");
      expect(file.language).toBe("JavaScript");
      expect(file.content).toBe(LANGUAGE_TEMPLATES.javascript);
      expect(mockSetItem).toHaveBeenCalled();
    });
  });

  describe("LANGUAGE_TEMPLATES", () => {
    it("should have templates for all major languages", () => {
      expect(LANGUAGE_TEMPLATES.javascript).toBeDefined();
      expect(LANGUAGE_TEMPLATES.python).toBeDefined();
      expect(LANGUAGE_TEMPLATES.java).toBeDefined();
      expect(LANGUAGE_TEMPLATES.cpp).toBeDefined();
      expect(LANGUAGE_TEMPLATES.html).toBeDefined();
      expect(LANGUAGE_TEMPLATES.css).toBeDefined();
      expect(LANGUAGE_TEMPLATES.json).toBeDefined();
      expect(LANGUAGE_TEMPLATES.xml).toBeDefined();
    });

    it("should have non-empty templates", () => {
      Object.entries(LANGUAGE_TEMPLATES).forEach(([language, template]) => {
        expect(template.length).toBeGreaterThan(0);
      });
    });
  });
});
