/**
 * Advanced syntax highlighter with proper token classification
 * Supports multiple programming languages with accurate color coding
 */

export interface StyledToken {
  text: string;
  type:
    | "keyword"
    | "string"
    | "number"
    | "comment"
    | "function"
    | "operator"
    | "variable"
    | "class"
    | "property"
    | "tag"
    | "attribute"
    | "punctuation"
    | "default";
  color?: string;
}

// Language-specific keywords
const KEYWORDS: Record<string, Set<string>> = {
  javascript: new Set([
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
    "typeof",
    "instanceof",
    "in",
    "of",
    "delete",
    "void",
    "yield",
  ]),
  python: new Set([
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
    "and",
    "or",
    "not",
    "is",
    "in",
    "global",
    "nonlocal",
  ]),
  java: new Set([
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
    "abstract",
    "synchronized",
    "volatile",
    "transient",
  ]),
  cpp: new Set([
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
    "template",
    "typename",
    "using",
    "namespace",
  ]),
};

const BUILTIN_FUNCTIONS: Record<string, Set<string>> = {
  javascript: new Set([
    "console",
    "log",
    "alert",
    "parseInt",
    "parseFloat",
    "isNaN",
    "Array",
    "Object",
    "String",
    "Number",
    "Boolean",
    "Date",
    "Math",
    "JSON",
    "Promise",
    "setTimeout",
    "setInterval",
  ]),
  python: new Set([
    "print",
    "len",
    "range",
    "enumerate",
    "zip",
    "map",
    "filter",
    "sorted",
    "sum",
    "min",
    "max",
    "abs",
    "round",
    "open",
    "input",
    "str",
    "int",
    "float",
    "list",
    "dict",
    "set",
    "tuple",
  ]),
};

// Color palette for different themes
const COLORS = {
  light: {
    keyword: "#D946EF",
    string: "#16A34A",
    number: "#EA580C",
    comment: "#6B7280",
    function: "#0891B2",
    variable: "#1A1A1A",
    class: "#7C3AED",
    property: "#0891B2",
    tag: "#DC2626",
    attribute: "#7C3AED",
    operator: "#1A1A1A",
    punctuation: "#1A1A1A",
    default: "#1A1A1A",
  },
  dark: {
    keyword: "#EC4899",
    string: "#4ADE80",
    number: "#FB923C",
    comment: "#9CA3AF",
    function: "#06B6D4",
    variable: "#F1F5F9",
    class: "#C084FC",
    property: "#06B6D4",
    tag: "#F87171",
    attribute: "#C084FC",
    operator: "#F1F5F9",
    punctuation: "#F1F5F9",
    default: "#F1F5F9",
  },
};

export function highlightAdvanced(
  code: string,
  language: string = "javascript",
  isDark: boolean = false
): StyledToken[] {
  const tokens: StyledToken[] = [];
  const keywords = KEYWORDS[language.toLowerCase()] || KEYWORDS.javascript;
  const builtins = BUILTIN_FUNCTIONS[language.toLowerCase()] || new Set();
  const colorScheme = isDark ? COLORS.dark : COLORS.light;

  let i = 0;
  while (i < code.length) {
    // Skip whitespace
    if (/\s/.test(code[i])) {
      let whitespace = "";
      while (i < code.length && /\s/.test(code[i])) {
        whitespace += code[i];
        i++;
      }
      tokens.push({
        text: whitespace,
        type: "default",
        color: colorScheme.default,
      });
      continue;
    }

    // Single-line comments
    if (code.substring(i, i + 2) === "//") {
      let comment = "";
      while (i < code.length && code[i] !== "\n") {
        comment += code[i];
        i++;
      }
      tokens.push({
        text: comment,
        type: "comment",
        color: colorScheme.comment,
      });
      continue;
    }

    // Python comments
    if (code[i] === "#" && language === "python") {
      let comment = "";
      while (i < code.length && code[i] !== "\n") {
        comment += code[i];
        i++;
      }
      tokens.push({
        text: comment,
        type: "comment",
        color: colorScheme.comment,
      });
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
      tokens.push({
        text: comment,
        type: "comment",
        color: colorScheme.comment,
      });
      continue;
    }

    // Strings
    if (code[i] === '"' || code[i] === "'" || code[i] === "`") {
      const quote = code[i];
      let string = quote;
      i++;
      while (i < code.length && code[i] !== quote) {
        if (code[i] === "\\") {
          string += code[i] + (code[i + 1] || "");
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
      tokens.push({
        text: string,
        type: "string",
        color: colorScheme.string,
      });
      continue;
    }

    // Numbers
    if (/\d/.test(code[i])) {
      let number = "";
      while (i < code.length && /[\d.xXeE]/.test(code[i])) {
        number += code[i];
        i++;
      }
      tokens.push({
        text: number,
        type: "number",
        color: colorScheme.number,
      });
      continue;
    }

    // HTML/XML tags
    if (code[i] === "<" && (language === "html" || language === "xml")) {
      let tag = "";
      while (i < code.length && code[i] !== ">") {
        tag += code[i];
        i++;
      }
      if (i < code.length) {
        tag += code[i];
        i++;
      }
      tokens.push({
        text: tag,
        type: "tag",
        color: colorScheme.tag,
      });
      continue;
    }

    // Identifiers and keywords
    if (/[a-zA-Z_$]/.test(code[i])) {
      let identifier = "";
      while (i < code.length && /[a-zA-Z0-9_$]/.test(code[i])) {
        identifier += code[i];
        i++;
      }

      let type: StyledToken["type"] = "variable";
      let color = colorScheme.variable;

      if (keywords.has(identifier)) {
        type = "keyword";
        color = colorScheme.keyword;
      } else if (builtins.has(identifier)) {
        type = "function";
        color = colorScheme.function;
      } else if (/^[A-Z]/.test(identifier)) {
        type = "class";
        color = colorScheme.class;
      } else if (code[i] === "(") {
        type = "function";
        color = colorScheme.function;
      }

      tokens.push({
        text: identifier,
        type,
        color,
      });
      continue;
    }

    // Operators
    if (/[+\-*/%=<>!&|^~?:;,.]/.test(code[i])) {
      let operator = code[i];
      i++;

      // Handle multi-character operators
      if (
        /[+\-*/%=<>!&|^]/.test(operator) &&
        i < code.length &&
        /[=<>]/.test(code[i])
      ) {
        operator += code[i];
        i++;
      }

      tokens.push({
        text: operator,
        type: "operator",
        color: colorScheme.operator,
      });
      continue;
    }

    // Punctuation
    if (/[()[\]{}]/.test(code[i])) {
      tokens.push({
        text: code[i],
        type: "punctuation",
        color: colorScheme.punctuation,
      });
      i++;
      continue;
    }

    // Default
    tokens.push({
      text: code[i],
      type: "default",
      color: colorScheme.default,
    });
    i++;
  }

  return tokens;
}

export function getColorForToken(
  token: StyledToken,
  isDark: boolean = false
): string {
  return token.color || (isDark ? COLORS.dark.default : COLORS.light.default);
}
