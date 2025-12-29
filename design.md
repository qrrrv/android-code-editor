# Android Code Editor - Design Document

## Overview
A beautiful, feature-rich code editor for Android with syntax highlighting, file management, and a modern Material Design 3 interface optimized for mobile development workflows.

## Screen List

### 1. **Home / File Browser Screen**
- **Purpose**: Display list of recent/saved code files
- **Content**: 
  - Search bar to filter files
  - List of files with thumbnails showing file type and last modified date
  - Floating action button (FAB) to create new file
  - Quick access to favorites
- **Functionality**: Tap file to open editor, long-press to delete/rename/share

### 2. **Code Editor Screen**
- **Purpose**: Main editing interface with syntax highlighting
- **Content**:
  - File name and path at top
  - Line numbers on left side
  - Code input area with syntax highlighting
  - Bottom toolbar with formatting options
  - Status bar showing cursor position and file info
- **Functionality**: 
  - Real-time syntax highlighting
  - Undo/Redo
  - Find and Replace
  - Copy/Paste
  - Auto-indentation

### 3. **Settings Screen**
- **Purpose**: Configure editor preferences
- **Content**:
  - Theme selection (Light/Dark)
  - Font size adjustment
  - Font family selection
  - Tab size preference
  - Line number visibility toggle
  - Syntax highlighting toggle
- **Functionality**: Settings persist across sessions

### 4. **File Details / Preview Screen**
- **Purpose**: Show file metadata and preview
- **Content**:
  - File name, size, type, creation/modification dates
  - Read-only preview of file content
  - File statistics (lines, characters, words)
- **Functionality**: Share, delete, or open for editing

## Primary Content and Functionality

### File Management
- Create new files with different language templates (JavaScript, Python, Java, C++, HTML, CSS)
- Open existing files from device storage
- Save files to local storage
- Delete, rename, and share files
- Recent files list with quick access

### Code Editor Features
- **Syntax Highlighting**: Support for multiple languages (JavaScript, Python, Java, C++, HTML, CSS, JSON, XML)
- **Line Numbers**: Toggleable line number display
- **Auto-indentation**: Automatic indentation on new lines
- **Find & Replace**: Search within file with case sensitivity options
- **Undo/Redo**: Full undo/redo history
- **Copy/Paste**: Clipboard integration
- **Keyboard Shortcuts**: Common shortcuts (Ctrl+S for save, Ctrl+Z for undo, etc.)

### UI/UX Features
- Dark and light theme support
- Customizable font size (12-24pt)
- Customizable font family (Monospace, Courier, Roboto Mono)
- Responsive layout for portrait orientation
- One-handed usage optimized (controls within thumb reach)
- Smooth animations and transitions

## Key User Flows

### Flow 1: Create and Edit a New File
1. User taps FAB on Home screen
2. Dialog appears to select file type/language
3. New file created with template
4. Editor screen opens with empty file
5. User types code with syntax highlighting
6. User taps Save button
7. File saved to local storage
8. Return to Home screen with new file in list

### Flow 2: Open and Edit Existing File
1. User taps file from Home screen list
2. Editor screen opens with file content
3. Syntax highlighting applied based on file type
4. User edits code
5. Changes auto-save or manual save via button
6. User can use Find/Replace to modify content
7. User taps Back to return to Home screen

### Flow 3: Customize Editor Settings
1. User taps Settings tab
2. User adjusts theme, font size, font family
3. Settings saved to AsyncStorage
4. Changes apply immediately to editor
5. Settings persist across app sessions

## Color Choices

### Light Theme
- **Background**: #FFFFFF (Clean white)
- **Surface**: #F5F5F5 (Light gray for cards/panels)
- **Foreground/Text**: #1A1A1A (Dark text)
- **Primary Accent**: #2563EB (Vibrant blue)
- **Secondary**: #7C3AED (Purple for highlights)
- **Code Syntax Colors**:
  - Keywords: #D946EF (Pink)
  - Strings: #16A34A (Green)
  - Numbers: #EA580C (Orange)
  - Comments: #6B7280 (Gray)
  - Functions: #0891B2 (Cyan)

### Dark Theme
- **Background**: #0F172A (Deep navy)
- **Surface**: #1E293B (Slate)
- **Foreground/Text**: #F1F5F9 (Light text)
- **Primary Accent**: #3B82F6 (Bright blue)
- **Secondary**: #A78BFA (Light purple)
- **Code Syntax Colors**:
  - Keywords: #EC4899 (Bright pink)
  - Strings: #4ADE80 (Bright green)
  - Numbers: #FB923C (Bright orange)
  - Comments: #9CA3AF (Light gray)
  - Functions: #06B6D4 (Bright cyan)

## Mobile-First Design Principles

- **Portrait Orientation**: All screens designed for 9:16 aspect ratio
- **One-Handed Usage**: Critical controls (FAB, Save, Back) positioned within thumb reach
- **Touch Targets**: Minimum 44x44pt for interactive elements
- **Spacing**: Consistent 8pt/16pt/24pt grid system
- **Typography**: Large, readable fonts optimized for mobile screens
- **Feedback**: Visual and haptic feedback for all interactions
- **Performance**: Smooth scrolling, fast file operations, efficient rendering
