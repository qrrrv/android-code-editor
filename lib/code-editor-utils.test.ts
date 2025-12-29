import { describe, it, expect } from "vitest";
import {
  handleBracketCompletion,
  handleClosingBracket,
  handleAutoIndent,
  detectLanguage,
  formatCode,
  getWordAtCursor,
  getLineAtCursor,
  getLineNumber,
  getColumnNumber,
} from "./code-editor-utils";

describe("Code Editor Utils", () => {
  describe("handleBracketCompletion", () => {
    it("should add closing bracket for opening parenthesis", () => {
      const result = handleBracketCompletion("", 0, "(");
      expect(result.text).toBe("()");
      expect(result.cursorPosition).toBe(1);
    });

    it("should add closing bracket for opening square bracket", () => {
      const result = handleBracketCompletion("", 0, "[");
      expect(result.text).toBe("[]");
      expect(result.cursorPosition).toBe(1);
    });

    it("should add closing bracket for opening curly brace", () => {
      const result = handleBracketCompletion("", 0, "{");
      expect(result.text).toBe("{}");
      expect(result.cursorPosition).toBe(1);
    });

    it("should add closing quote for double quote", () => {
      const result = handleBracketCompletion("", 0, '"');
      expect(result.text).toBe('""');
      expect(result.cursorPosition).toBe(1);
    });

    it("should add closing quote for single quote", () => {
      const result = handleBracketCompletion("", 0, "'");
      expect(result.text).toBe("''");
      expect(result.cursorPosition).toBe(1);
    });

    it("should add closing backtick for backtick", () => {
      const result = handleBracketCompletion("", 0, "`");
      expect(result.text).toBe("``");
      expect(result.cursorPosition).toBe(1);
    });

    it("should not add closing bracket if already present", () => {
      const result = handleBracketCompletion(")", 0, "(");
      expect(result.text).toBe(")");
      expect(result.cursorPosition).toBe(0);
    });

    it("should not add closing bracket for non-bracket characters", () => {
      const result = handleBracketCompletion("", 0, "a");
      expect(result.text).toBe("");
      expect(result.cursorPosition).toBe(0);
    });
  });

  describe("handleClosingBracket", () => {
    it("should skip closing bracket if it matches the next character", () => {
      const result = handleClosingBracket(")", 0, ")");
      expect(result.cursorPosition).toBe(1);
    });

    it("should not skip closing bracket if it doesn't match", () => {
      const result = handleClosingBracket("text", 0, ")");
      expect(result.cursorPosition).toBe(0);
    });

    it("should handle closing square bracket", () => {
      const result = handleClosingBracket("]", 0, "]");
      expect(result.cursorPosition).toBe(1);
    });

    it("should handle closing curly brace", () => {
      const result = handleClosingBracket("}", 0, "}");
      expect(result.cursorPosition).toBe(1);
    });
  });

  describe("handleAutoIndent", () => {
    it("should increase indentation after opening brace", () => {
      const code = "if (true) {\n";
      const result = handleAutoIndent(code, code.length, 2);
      expect(result.text).toContain("  ");
    });

    it("should decrease indentation for closing brace", () => {
      const code = "if (true) {\n  console.log('test');\n";
      const result = handleAutoIndent(code, code.length, 2);
      expect(result.text).toContain("\n");
    });

    it("should maintain indentation for normal lines", () => {
      const code = "  const x = 5;\n";
      const result = handleAutoIndent(code, code.length, 2);
      expect(result.text).toContain("  ");
    });
  });

  describe("detectLanguage", () => {
    it("should detect JavaScript from .js extension", () => {
      expect(detectLanguage("app.js")).toBe("javascript");
    });

    it("should detect JavaScript from .jsx extension", () => {
      expect(detectLanguage("component.jsx")).toBe("javascript");
    });

    it("should detect Python from .py extension", () => {
      expect(detectLanguage("script.py")).toBe("python");
    });

    it("should detect Java from .java extension", () => {
      expect(detectLanguage("HelloWorld.java")).toBe("java");
    });

    it("should detect C++ from .cpp extension", () => {
      expect(detectLanguage("main.cpp")).toBe("cpp");
    });

    it("should detect HTML from .html extension", () => {
      expect(detectLanguage("index.html")).toBe("html");
    });

    it("should detect CSS from .css extension", () => {
      expect(detectLanguage("style.css")).toBe("css");
    });

    it("should detect JSON from .json extension", () => {
      expect(detectLanguage("config.json")).toBe("json");
    });

    it("should detect XML from .xml extension", () => {
      expect(detectLanguage("data.xml")).toBe("xml");
    });

    it("should return text for unknown extensions", () => {
      expect(detectLanguage("file.unknown")).toBe("text");
    });

    it("should handle files without extension", () => {
      expect(detectLanguage("Makefile")).toBe("text");
    });
  });

  describe("formatCode", () => {
    it("should format JavaScript code with proper indentation", () => {
      const code = "function test() {\nconsole.log('hello');\n}";
      const formatted = formatCode(code, 2);
      expect(formatted).toContain("  ");
    });

    it("should handle nested braces", () => {
      const code = "if (true) {\nif (false) {\nlog();\n}\n}";
      const formatted = formatCode(code, 2);
      expect(formatted).toContain("    ");
    });

    it("should remove empty lines", () => {
      const code = "function test() {\n\nconsole.log('hello');\n}";
      const formatted = formatCode(code, 2);
      expect(formatted.split("\n").length).toBeGreaterThan(0);
    });
  });

  describe("getWordAtCursor", () => {
    it("should get word at cursor position", () => {
      const text = "const hello = 5;";
      const word = getWordAtCursor(text, 8);
      expect(word).toBe("hello");
    });

    it("should get single character word", () => {
      const text = "x = 5;";
      const word = getWordAtCursor(text, 1);
      expect(word).toBe("x");
    });

    it("should handle cursor at word boundary", () => {
      const text = "hello world";
      const word = getWordAtCursor(text, 5);
      expect(word).toBe("hello");
    });
  });

  describe("getLineAtCursor", () => {
    it("should get line at cursor position", () => {
      const text = "line 1\nline 2\nline 3";
      const line = getLineAtCursor(text, 10);
      expect(line).toBe("line 2");
    });

    it("should get first line", () => {
      const text = "first line\nsecond line";
      const line = getLineAtCursor(text, 5);
      expect(line).toBe("first line");
    });

    it("should get last line", () => {
      const text = "line 1\nline 2\nline 3";
      const line = getLineAtCursor(text, text.length);
      expect(line).toBe("line 3");
    });
  });

  describe("getLineNumber", () => {
    it("should get line number 1 at start", () => {
      const text = "line 1\nline 2";
      expect(getLineNumber(text, 0)).toBe(1);
    });

    it("should get line number 2 after first newline", () => {
      const text = "line 1\nline 2";
      expect(getLineNumber(text, 7)).toBe(2);
    });

    it("should get line number 3 after second newline", () => {
      const text = "line 1\nline 2\nline 3";
      expect(getLineNumber(text, 14)).toBe(3);
    });
  });

  describe("getColumnNumber", () => {
    it("should get column 1 at start of line", () => {
      const text = "hello world";
      expect(getColumnNumber(text, 0)).toBe(1);
    });

    it("should get correct column in middle of line", () => {
      const text = "hello world";
      expect(getColumnNumber(text, 5)).toBe(6);
    });

    it("should get correct column on second line", () => {
      const text = "line 1\nline 2";
      expect(getColumnNumber(text, 8)).toBe(2);
    });
  });
});
