/**
 * Advanced code editor utilities similar to VS Code
 * Includes bracket completion, auto-indentation, and smart editing
 */

export interface EditResult {
  text: string;
  cursorPosition: number;
}

const BRACKET_PAIRS: Record<string, string> = {
  "(": ")",
  "[": "]",
  "{": "}",
  '"': '"',
  "'": "'",
  "`": "`",
};

const CLOSING_BRACKETS = [")", "]", "}", '"', "'", "`"];

/**
 * Handle bracket completion when user types an opening bracket
 */
export function handleBracketCompletion(
  text: string,
  cursorPos: number,
  typedChar: string
): EditResult {
  if (!(typedChar in BRACKET_PAIRS)) {
    return { text, cursorPosition: cursorPos };
  }

  const closingBracket = BRACKET_PAIRS[typedChar];
  const before = text.substring(0, cursorPos);
  const after = text.substring(cursorPos);

  // Check if we should auto-complete
  const shouldAutoComplete =
    !after.startsWith(closingBracket) &&
    (after.length === 0 || /[\s\n\r,;:})\]"]/.test(after[0]));

  if (shouldAutoComplete) {
    const newText = before + typedChar + closingBracket + after;
    return {
      text: newText,
      cursorPosition: cursorPos + 1,
    };
  }

  return { text, cursorPosition: cursorPos };
}

/**
 * Handle closing bracket - if user types a closing bracket that matches the next character, skip it
 */
export function handleClosingBracket(
  text: string,
  cursorPos: number,
  typedChar: string
): EditResult {
  if (!CLOSING_BRACKETS.includes(typedChar)) {
    return { text, cursorPosition: cursorPos };
  }

  const after = text.substring(cursorPos);
  if (after.startsWith(typedChar)) {
    // Skip the closing bracket
    return {
      text,
      cursorPosition: cursorPos + 1,
    };
  }

  return { text, cursorPosition: cursorPos };
}

/**
 * Get the indentation level for the current line
 */
export function getIndentationLevel(text: string, cursorPos: number): string {
  const lineStart = text.lastIndexOf("\n", cursorPos - 1) + 1;
  const lineText = text.substring(lineStart, cursorPos);
  const match = lineText.match(/^(\s*)/);
  return match ? match[1] : "";
}

/**
 * Handle auto-indentation on new line
 */
export function handleAutoIndent(
  text: string,
  cursorPos: number,
  tabSize: number = 2
): EditResult {
  const before = text.substring(0, cursorPos);
  const after = text.substring(cursorPos);

  // Get the indentation of the previous line
  const lineStart = before.lastIndexOf("\n");
  const previousLineStart = before.lastIndexOf("\n", lineStart - 1) + 1;
  const previousLine = before.substring(previousLineStart, lineStart);
  const previousIndent = previousLine.match(/^(\s*)/)?.[1] || "";

  // Check if we need to increase indentation
  let newIndent = previousIndent;
  const trimmedPrevious = previousLine.trim();

  if (
    trimmedPrevious.endsWith("{") ||
    trimmedPrevious.endsWith("[") ||
    trimmedPrevious.endsWith("(")
  ) {
    newIndent += " ".repeat(tabSize);
  }

  // Check if the next line starts with a closing bracket
  const nextLineStart = after.indexOf("\n") + 1 || after.length;
  const nextLine = after.substring(0, nextLineStart);
  const trimmedNext = nextLine.trim();

  if (trimmedNext.startsWith("}") || trimmedNext.startsWith("]") || trimmedNext.startsWith(")")) {
    // Decrease indentation
    if (newIndent.length >= tabSize) {
      newIndent = newIndent.substring(0, newIndent.length - tabSize);
    }
  }

  const newText = before + "\n" + newIndent + after;
  return {
    text: newText,
    cursorPosition: cursorPos + 1 + newIndent.length,
  };
}

/**
 * Detect the language based on file extension
 */
export function detectLanguage(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";

  const languageMap: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "javascript",
    tsx: "javascript",
    py: "python",
    java: "java",
    cpp: "cpp",
    cc: "cpp",
    cxx: "cpp",
    h: "cpp",
    hpp: "cpp",
    html: "html",
    htm: "html",
    css: "css",
    scss: "css",
    less: "css",
    json: "json",
    xml: "xml",
    svg: "xml",
    php: "php",
    rb: "ruby",
    go: "go",
    rs: "rust",
    c: "c",
    cs: "csharp",
    swift: "swift",
    kt: "kotlin",
    scala: "scala",
    sh: "bash",
    bash: "bash",
    sql: "sql",
    yml: "yaml",
    yaml: "yaml",
    md: "markdown",
    txt: "text",
  };

  return languageMap[ext] || "text";
}

/**
 * Format code with proper indentation
 */
export function formatCode(code: string, tabSize: number = 2): string {
  const lines = code.split("\n");
  const formatted: string[] = [];
  let indentLevel = 0;
  const indent = " ".repeat(tabSize);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      formatted.push("");
      continue;
    }

    // Decrease indent for closing brackets
    if (trimmed.startsWith("}") || trimmed.startsWith("]") || trimmed.startsWith(")")) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Add the line with proper indentation
    formatted.push(indent.repeat(indentLevel) + trimmed);

    // Increase indent for opening brackets
    if (trimmed.endsWith("{") || trimmed.endsWith("[") || trimmed.endsWith("(")) {
      indentLevel++;
    }
  }

  return formatted.join("\n");
}

/**
 * Get word at cursor position
 */
export function getWordAtCursor(text: string, cursorPos: number): string {
  let start = cursorPos;
  let end = cursorPos;

  // Find word boundaries
  while (start > 0 && /\w/.test(text[start - 1])) {
    start--;
  }

  while (end < text.length && /\w/.test(text[end])) {
    end++;
  }

  return text.substring(start, end);
}

/**
 * Get line content at cursor position
 */
export function getLineAtCursor(text: string, cursorPos: number): string {
  const lineStart = text.lastIndexOf("\n", cursorPos - 1) + 1;
  const lineEnd = text.indexOf("\n", cursorPos);
  return text.substring(lineStart, lineEnd === -1 ? text.length : lineEnd);
}

/**
 * Get line number at cursor position
 */
export function getLineNumber(text: string, cursorPos: number): number {
  return text.substring(0, cursorPos).split("\n").length;
}

/**
 * Get column number at cursor position
 */
export function getColumnNumber(text: string, cursorPos: number): number {
  const lineStart = text.lastIndexOf("\n", cursorPos - 1) + 1;
  return cursorPos - lineStart + 1;
}
