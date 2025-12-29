/**
 * Simple syntax highlighter for common programming languages
 * Returns styled tokens for rendering syntax-highlighted code
 */

export interface HighlightToken {
  text: string;
  type: "keyword" | "string" | "number" | "comment" | "function" | "operator" | "default";
}

const KEYWORDS: Record<string, string[]> = {
  javascript: [
    "function",
    "const",
    "let",
    "var",
    "return",
    "if",
    "else",
    "for",
    "while",
    "do",
    "switch",
    "case",
    "break",
    "continue",
    "try",
    "catch",
    "finally",
    "throw",
    "new",
    "this",
    "class",
    "extends",
    "import",
    "export",
    "default",
    "async",
    "await",
    "true",
    "false",
    "null",
    "undefined",
  ],
  python: [
    "def",
    "class",
    "if",
    "elif",
    "else",
    "for",
    "while",
    "break",
    "continue",
    "return",
    "import",
    "from",
    "as",
    "try",
    "except",
    "finally",
    "with",
    "lambda",
    "yield",
    "assert",
    "pass",
    "raise",
    "True",
    "False",
    "None",
  ],
  java: [
    "public",
    "private",
    "protected",
    "static",
    "final",
    "class",
    "interface",
    "extends",
    "implements",
    "new",
    "return",
    "if",
    "else",
    "for",
    "while",
    "do",
    "switch",
    "case",
    "break",
    "continue",
    "try",
    "catch",
    "finally",
    "throw",
    "throws",
    "import",
    "package",
    "void",
    "int",
    "String",
    "boolean",
    "true",
    "false",
    "null",
  ],
  cpp: [
    "int",
    "float",
    "double",
    "char",
    "bool",
    "void",
    "return",
    "if",
    "else",
    "for",
    "while",
    "do",
    "switch",
    "case",
    "break",
    "continue",
    "class",
    "struct",
    "public",
    "private",
    "protected",
    "new",
    "delete",
    "const",
    "static",
    "virtual",
    "true",
    "false",
    "nullptr",
  ],
  html: [
    "html",
    "head",
    "body",
    "div",
    "span",
    "p",
    "a",
    "img",
    "button",
    "input",
    "form",
    "script",
    "style",
    "meta",
    "title",
    "link",
    "class",
    "id",
    "href",
    "src",
    "type",
  ],
  css: [
    "color",
    "background",
    "margin",
    "padding",
    "border",
    "width",
    "height",
    "display",
    "flex",
    "grid",
    "position",
    "absolute",
    "relative",
    "fixed",
    "font-size",
    "font-weight",
    "text-align",
  ],
};

export function highlightCode(code: string, language: string = "javascript"): HighlightToken[] {
  const tokens: HighlightToken[] = [];
  const keywords = KEYWORDS[language.toLowerCase()] || KEYWORDS.javascript;

  let i = 0;
  while (i < code.length) {
    // Skip whitespace
    if (/\s/.test(code[i])) {
      let whitespace = "";
      while (i < code.length && /\s/.test(code[i])) {
        whitespace += code[i];
        i++;
      }
      tokens.push({ text: whitespace, type: "default" });
      continue;
    }

    // Comments
    if (code.substring(i, i + 2) === "//" || code.substring(i, i + 2) === "#") {
      let comment = "";
      const commentStart = code[i] === "#" ? "#" : "//";
      while (i < code.length && code[i] !== "\n") {
        comment += code[i];
        i++;
      }
      tokens.push({ text: comment, type: "comment" });
      continue;
    }

    // Block comments
    if (code.substring(i, i + 2) === "/*") {
      let comment = "";
      while (i < code.length && code.substring(i, i + 2) !== "*/") {
        comment += code[i];
        i++;
      }
      if (i < code.length) {
        comment += code[i] + code[i + 1];
        i += 2;
      }
      tokens.push({ text: comment, type: "comment" });
      continue;
    }

    // Strings
    if (code[i] === '"' || code[i] === "'" || code[i] === "`") {
      const quote = code[i];
      let string = quote;
      i++;
      while (i < code.length && code[i] !== quote) {
        if (code[i] === "\\") {
          string += code[i] + code[i + 1];
          i += 2;
        } else {
          string += code[i];
          i++;
        }
      }
      if (i < code.length) {
        string += code[i];
        i++;
      }
      tokens.push({ text: string, type: "string" });
      continue;
    }

    // Numbers
    if (/\d/.test(code[i])) {
      let number = "";
      while (i < code.length && /[\d.]/.test(code[i])) {
        number += code[i];
        i++;
      }
      tokens.push({ text: number, type: "number" });
      continue;
    }

    // Identifiers and keywords
    if (/[a-zA-Z_]/.test(code[i])) {
      let identifier = "";
      while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) {
        identifier += code[i];
        i++;
      }

      if (keywords.includes(identifier)) {
        tokens.push({ text: identifier, type: "keyword" });
      } else if (code[i] === "(") {
        tokens.push({ text: identifier, type: "function" });
      } else {
        tokens.push({ text: identifier, type: "default" });
      }
      continue;
    }

    // Operators
    if (/[+\-*/%=<>!&|^~?:]/.test(code[i])) {
      let operator = code[i];
      i++;
      tokens.push({ text: operator, type: "operator" });
      continue;
    }

    // Default
    tokens.push({ text: code[i], type: "default" });
    i++;
  }

  return tokens;
}

export function getTokenColor(
  type: HighlightToken["type"],
  isDark: boolean
): string {
  const lightColors: Record<HighlightToken["type"], string> = {
    keyword: "#D946EF",
    string: "#16A34A",
    number: "#EA580C",
    comment: "#6B7280",
    function: "#0891B2",
    operator: "#1A1A1A",
    default: "#1A1A1A",
  };

  const darkColors: Record<HighlightToken["type"], string> = {
    keyword: "#EC4899",
    string: "#4ADE80",
    number: "#FB923C",
    comment: "#9CA3AF",
    function: "#06B6D4",
    operator: "#F1F5F9",
    default: "#F1F5F9",
  };

  return isDark ? darkColors[type] : lightColors[type];
}
