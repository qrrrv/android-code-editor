import { describe, it, expect } from "vitest";
import { highlightCode, getTokenColor, HighlightToken } from "./syntax-highlighter";

describe("Syntax Highlighter", () => {
  describe("highlightCode", () => {
    it("should highlight JavaScript keywords", () => {
      const code = "const x = 5;";
      const tokens = highlightCode(code, "javascript");

      const keywordTokens = tokens.filter((t) => t.type === "keyword");
      expect(keywordTokens.length).toBeGreaterThan(0);
      expect(keywordTokens.some((t) => t.text === "const")).toBe(true);
    });

    it("should highlight strings", () => {
      const code = 'const message = "Hello, World!";';
      const tokens = highlightCode(code, "javascript");

      const stringTokens = tokens.filter((t) => t.type === "string");
      expect(stringTokens.length).toBeGreaterThan(0);
    });

    it("should highlight numbers", () => {
      const code = "const num = 42;";
      const tokens = highlightCode(code, "javascript");

      const numberTokens = tokens.filter((t) => t.type === "number");
      expect(numberTokens.some((t) => t.text === "42")).toBe(true);
    });

    it("should highlight comments", () => {
      const code = "// This is a comment\nconst x = 5;";
      const tokens = highlightCode(code, "javascript");

      const commentTokens = tokens.filter((t) => t.type === "comment");
      expect(commentTokens.length).toBeGreaterThan(0);
    });

    it("should highlight block comments", () => {
      const code = "/* Block comment */ const x = 5;";
      const tokens = highlightCode(code, "javascript");

      const commentTokens = tokens.filter((t) => t.type === "comment");
      expect(commentTokens.length).toBeGreaterThan(0);
    });

    it("should handle Python syntax", () => {
      const code = "def hello():\n    print('Hello')";
      const tokens = highlightCode(code, "python");

      const keywordTokens = tokens.filter((t) => t.type === "keyword");
      expect(keywordTokens.some((t) => t.text === "def")).toBe(true);
    });

    it("should handle Java syntax", () => {
      const code = "public class HelloWorld {}";
      const tokens = highlightCode(code, "java");

      const keywordTokens = tokens.filter((t) => t.type === "keyword");
      expect(keywordTokens.some((t) => t.text === "public")).toBe(true);
      expect(keywordTokens.some((t) => t.text === "class")).toBe(true);
    });

    it("should handle C++ syntax", () => {
      const code = "int main() { return 0; }";
      const tokens = highlightCode(code, "cpp");

      const keywordTokens = tokens.filter((t) => t.type === "keyword");
      expect(keywordTokens.some((t) => t.text === "int")).toBe(true);
      expect(keywordTokens.some((t) => t.text === "return")).toBe(true);
    });

    it("should handle HTML syntax", () => {
      const code = "<div class='container'>Hello</div>";
      const tokens = highlightCode(code, "html");

      expect(tokens.length).toBeGreaterThan(0);
    });

    it("should handle CSS syntax", () => {
      const code = "body { color: red; }";
      const tokens = highlightCode(code, "css");

      expect(tokens.length).toBeGreaterThan(0);
    });

    it("should handle single-quoted strings", () => {
      const code = "const str = 'hello';";
      const tokens = highlightCode(code, "javascript");

      const stringTokens = tokens.filter((t) => t.type === "string");
      expect(stringTokens.length).toBeGreaterThan(0);
    });

    it("should handle backtick strings", () => {
      const code = "const str = `hello ${name}`;";
      const tokens = highlightCode(code, "javascript");

      const stringTokens = tokens.filter((t) => t.type === "string");
      expect(stringTokens.length).toBeGreaterThan(0);
    });

    it("should handle escaped quotes in strings", () => {
      const code = 'const str = "hello \\"world\\"";';
      const tokens = highlightCode(code, "javascript");

      const stringTokens = tokens.filter((t) => t.type === "string");
      expect(stringTokens.length).toBeGreaterThan(0);
    });

    it("should handle function calls", () => {
      const code = "console.log('test');";
      const tokens = highlightCode(code, "javascript");

      const functionTokens = tokens.filter((t) => t.type === "function");
      expect(functionTokens.length).toBeGreaterThan(0);
    });

    it("should return tokens with correct structure", () => {
      const code = "const x = 5;";
      const tokens = highlightCode(code, "javascript");

      tokens.forEach((token) => {
        expect(token).toHaveProperty("text");
        expect(token).toHaveProperty("type");
        expect(typeof token.text).toBe("string");
        expect(
          ["keyword", "string", "number", "comment", "function", "operator", "default"].includes(
            token.type
          )
        ).toBe(true);
      });
    });

    it("should handle empty code", () => {
      const code = "";
      const tokens = highlightCode(code, "javascript");

      expect(tokens).toEqual([]);
    });

    it("should handle whitespace", () => {
      const code = "const   x   =   5;";
      const tokens = highlightCode(code, "javascript");

      const whitespaceTokens = tokens.filter((t) => t.type === "default" && /\s+/.test(t.text));
      expect(whitespaceTokens.length).toBeGreaterThan(0);
    });
  });

  describe("getTokenColor", () => {
    it("should return correct color for keyword in light theme", () => {
      const color = getTokenColor("keyword", false);
      expect(color).toBe("#D946EF");
    });

    it("should return correct color for keyword in dark theme", () => {
      const color = getTokenColor("keyword", true);
      expect(color).toBe("#EC4899");
    });

    it("should return correct color for string in light theme", () => {
      const color = getTokenColor("string", false);
      expect(color).toBe("#16A34A");
    });

    it("should return correct color for string in dark theme", () => {
      const color = getTokenColor("string", true);
      expect(color).toBe("#4ADE80");
    });

    it("should return correct color for number in light theme", () => {
      const color = getTokenColor("number", false);
      expect(color).toBe("#EA580C");
    });

    it("should return correct color for number in dark theme", () => {
      const color = getTokenColor("number", true);
      expect(color).toBe("#FB923C");
    });

    it("should return correct color for comment in light theme", () => {
      const color = getTokenColor("comment", false);
      expect(color).toBe("#6B7280");
    });

    it("should return correct color for comment in dark theme", () => {
      const color = getTokenColor("comment", true);
      expect(color).toBe("#9CA3AF");
    });

    it("should return correct color for function in light theme", () => {
      const color = getTokenColor("function", false);
      expect(color).toBe("#0891B2");
    });

    it("should return correct color for function in dark theme", () => {
      const color = getTokenColor("function", true);
      expect(color).toBe("#06B6D4");
    });

    it("should return correct color for operator in light theme", () => {
      const color = getTokenColor("operator", false);
      expect(color).toBe("#1A1A1A");
    });

    it("should return correct color for operator in dark theme", () => {
      const color = getTokenColor("operator", true);
      expect(color).toBe("#F1F5F9");
    });

    it("should return correct color for default in light theme", () => {
      const color = getTokenColor("default", false);
      expect(color).toBe("#1A1A1A");
    });

    it("should return correct color for default in dark theme", () => {
      const color = getTokenColor("default", true);
      expect(color).toBe("#F1F5F9");
    });
  });

  describe("Complex code samples", () => {
    it("should highlight a complete JavaScript function", () => {
      const code = `
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
      `;
      const tokens = highlightCode(code, "javascript");

      expect(tokens.length).toBeGreaterThan(0);
      const keywordTokens = tokens.filter((t) => t.type === "keyword");
      expect(keywordTokens.length).toBeGreaterThan(0);
    });

    it("should highlight a complete Python function", () => {
      const code = `
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)
      `;
      const tokens = highlightCode(code, "python");

      expect(tokens.length).toBeGreaterThan(0);
      const keywordTokens = tokens.filter((t) => t.type === "keyword");
      expect(keywordTokens.length).toBeGreaterThan(0);
    });
  });
});
