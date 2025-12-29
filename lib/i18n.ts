export type Language = "en" | "ru";

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Tabs
    "tab.editor": "Editor",
    "tab.files": "Files",
    "tab.settings": "Settings",

    // Editor
    "editor.welcome": "Welcome to Code Editor",
    "editor.startTyping": "Start typing your code here...",
    "editor.unsaved": "Unsaved changes",
    "editor.saved": "Saved",
    "editor.line": "Line",
    "editor.chars": "chars",
    "editor.undo": "Undo",
    "editor.redo": "Redo",
    "editor.save": "Save",

    // Files
    "files.title": "Files",
    "files.search": "Search files...",
    "files.noFiles": "No files found",
    "files.createNew": "Create a new file",
    "files.selectLanguage": "Select a language:",
    "files.deleteConfirm": "Are you sure you want to delete",
    "files.cancel": "Cancel",
    "files.delete": "Delete",

    // Settings
    "settings.title": "Settings",
    "settings.editor": "Editor",
    "settings.lineNumbers": "Line Numbers",
    "settings.syntaxHighlight": "Syntax Highlighting",
    "settings.autoSave": "Auto Save",
    "settings.font": "Font",
    "settings.fontSize": "Font Size",
    "settings.fontFamily": "Font Family",
    "settings.theme": "Theme",
    "settings.language": "Language",
    "settings.about": "About",
    "settings.version": "Version",
    "settings.description": "A beautiful code editor for Android with syntax highlighting, file management, and modern design.",

    // Languages
    "lang.javascript": "JavaScript",
    "lang.python": "Python",
    "lang.java": "Java",
    "lang.cpp": "C++",
    "lang.html": "HTML",
    "lang.css": "CSS",
    "lang.json": "JSON",
    "lang.xml": "XML",

    // Themes
    "theme.light": "Light",
    "theme.dark": "Dark",

    // Messages
    "msg.fileSaved": "File saved successfully",
    "msg.fileDeleted": "File deleted",
    "msg.errorSaving": "Error saving file",
    "msg.errorDeleting": "Error deleting file",
  },
  ru: {
    // Tabs
    "tab.editor": "Редактор",
    "tab.files": "Файлы",
    "tab.settings": "Настройки",

    // Editor
    "editor.welcome": "Добро пожаловать в редактор кода",
    "editor.startTyping": "Начните писать ваш код здесь...",
    "editor.unsaved": "Несохраненные изменения",
    "editor.saved": "Сохранено",
    "editor.line": "Строка",
    "editor.chars": "символов",
    "editor.undo": "Отменить",
    "editor.redo": "Повторить",
    "editor.save": "Сохранить",

    // Files
    "files.title": "Файлы",
    "files.search": "Поиск файлов...",
    "files.noFiles": "Файлы не найдены",
    "files.createNew": "Создать новый файл",
    "files.selectLanguage": "Выберите язык:",
    "files.deleteConfirm": "Вы уверены, что хотите удалить",
    "files.cancel": "Отмена",
    "files.delete": "Удалить",

    // Settings
    "settings.title": "Настройки",
    "settings.editor": "Редактор",
    "settings.lineNumbers": "Номера строк",
    "settings.syntaxHighlight": "Подсветка синтаксиса",
    "settings.autoSave": "Автосохранение",
    "settings.font": "Шрифт",
    "settings.fontSize": "Размер шрифта",
    "settings.fontFamily": "Семейство шрифтов",
    "settings.theme": "Тема",
    "settings.language": "Язык",
    "settings.about": "О приложении",
    "settings.version": "Версия",
    "settings.description": "Красивый редактор кода для Android с подсветкой синтаксиса, управлением файлами и современным дизайном.",

    // Languages
    "lang.javascript": "JavaScript",
    "lang.python": "Python",
    "lang.java": "Java",
    "lang.cpp": "C++",
    "lang.html": "HTML",
    "lang.css": "CSS",
    "lang.json": "JSON",
    "lang.xml": "XML",

    // Themes
    "theme.light": "Светлая",
    "theme.dark": "Темная",

    // Messages
    "msg.fileSaved": "Файл успешно сохранен",
    "msg.fileDeleted": "Файл удален",
    "msg.errorSaving": "Ошибка при сохранении файла",
    "msg.errorDeleting": "Ошибка при удалении файла",
  },
};

export function t(key: string, language: Language = "en"): string {
  return translations[language]?.[key] || key;
}
