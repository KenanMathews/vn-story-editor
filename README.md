# Story Editor

A powerful, web-based visual novel script editor designed for creating interactive stories that integrate with [VN Engine](https://github.com/KenanMathews/vn-engine) and [VN Compiler](https://github.com/KenanMathews/vn-compiler-fresh).

## 🎯 Overview

Story Editor provides a VS Code-like environment for creating YAML-based visual novel scripts. It features real-time validation, syntax highlighting, and seamless integration with the VN Compiler to build playable HTML games from your stories.

## 🔗 Ecosystem Integration

This editor is part of a complete visual novel development ecosystem:

- **[VN Engine](https://github.com/KenanMathews/vn-engine)** - The runtime engine that powers your stories
- **[VN Compiler](https://github.com/KenanMathews/vn-compiler-fresh)** - Compiles YAML stories into standalone HTML games
- **Story Editor** (this project) - The authoring environment for creating stories

## ✨ Features

### 📝 Advanced Text Editing
- **Monaco Editor** integration with VS Code-like experience
- **Custom YAML syntax highlighting** optimized for visual novel scripts
- **Intelligent autocomplete** with 100+ VN-specific helpers
- **Real-time validation** with detailed error reporting
- **Multi-file support** with tabbed interface

### 🎮 Visual Novel Specific
- **Scene management** with drag-and-drop file organization
- **Handlebars helper validation** for VN Engine functions
- **Asset management** for images, audio, and video files
- **Story structure validation** ensuring proper scene references
- **Variable and flag tracking** across your story

### 🛠 Development Tools
- **Project management** with template support
- **File tree explorer** with context menus
- **Validation panel** showing errors, warnings, and suggestions
- **Command panel** for VN Compiler integration
- **Real-time compilation** and HTML export

### 🎨 User Experience
- **VS Code dark theme** for comfortable editing
- **Responsive design** works on desktop and mobile
- **IndexedDB storage** for offline project persistence
- **Minimap support** for large files
- **Keyboard shortcuts** for power users

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- [VN Compiler](https://github.com/KenanMathews/vn-compiler-fresh) (optional, for compilation)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/story-editor.git
cd story-editor

# Install dependencies
npm install

# Start development server
npm run dev
```

### VN Compiler Integration (Optional)

To enable story compilation features:

1. Install and start the VN Compiler server:
```bash
npm install -g vn-compiler
vn-compiler server
```

2. Set the compiler URL (defaults to `http://localhost:8080`):
```bash
# In your .env file
VITE_VN_COMPILER_URL=http://localhost:8080
```

## 📖 Usage Guide

### Creating Your First Story

1. **Create a New Project**
   - Click "New Project" in the header
   - Choose "Story Template" for a pre-configured setup
   - Or "Blank" to start from scratch

2. **Edit Your Story**
   - Open `story.yaml` in the file explorer
   - Use the intelligent autocomplete for VN helpers
   - Validate your story with Ctrl+Shift+V

3. **Add Assets**
   - Create folders for organization (images, audio, etc.)
   - Upload your media files
   - Reference them in your YAML using asset helpers

4. **Compile and Test**
   - Open the Command Panel (📟 icon)
   - Click "🔨 Build Story" to compile to HTML
   - Download and open the generated game file

### Story Format Example

```yaml
title: "My Interactive Story"
description: "A demo visual novel"

variables:
  playerName: ""
  score: 0

assets:
  - key: "hero"
    url: "images/hero.png"
    type: "image"
  - key: "bgm"
    url: "audio/background.mp3"
    type: "audio"

scenes:
  start:
    - "Welcome to my story!"
    - "{{input \"playerName\" \"What's your name?\" \"text\"}}"
    - "Hello, {{playerName}}! Let's begin."
    - text: "Ready to start?"
      choices:
        - text: "Yes!"
          goto: chapter1
        - text: "Tell me more"
          goto: info

  chapter1:
    - speaker: "Hero"
      say: "The adventure begins..."
    - "{{showImage \"hero\" gameAssets \"character-portrait\"}}"
    - "{{playAudio \"bgm\" gameAssets true true}}"
```

## 🏗 Project Structure

```
story-editor/
├── src/
│   ├── components/
│   │   ├── editors/          # Monaco editor configurations
│   │   ├── panels/           # UI panels (validation, commands)
│   │   └── ui/               # Common UI components
│   ├── hooks/
│   │   ├── useCLI.js        # VN Compiler integration
│   │   └── useFileSystem.js  # IndexedDB file management
│   ├── utils/
│   │   ├── fileSystem.js     # Virtual file system
│   │   ├── storyLanguage.js  # Custom YAML language definition
│   │   └── validation/       # Story validation engine
│   └── App.jsx
├── public/
└── package.json
```

## 🎛 VN Helper Functions

The editor includes autocomplete and validation for 100+ helper functions:

### Variable Management
- `{{setVar "name" value}}` - Set variable
- `{{getVar "name" default}}` - Get variable with default
- `{{hasVar "name"}}` - Check if variable exists

### Story Flow
- `{{hasFlag "flag_name"}}` - Check story flags
- `{{playerChose "choice" scene}}` - Check previous choices
- `{{randomBool 0.5}}` - Random boolean with probability

### User Input
- `{{input "var" "prompt" "type" "options"}}` - Generic input
- `{{textInput "var" "prompt" "default"}}` - Text input
- `{{selectInput "var" "prompt" "options"}}` - Dropdown select

### Media & Assets
- `{{showImage "key" assets "css-class"}}` - Display image
- `{{playAudio "key" assets autoplay loop}}` - Play audio
- `{{playVideo "key" assets autoplay loop}}` - Play video

### String & Math Helpers
- `{{uppercase "text"}}`, `{{lowercase "text"}}` - Text formatting
- `{{add num1 num2}}`, `{{multiply num1 num2}}` - Math operations
- `{{random min max}}` - Random number generation

## 🔧 Development

### Tech Stack
- **React 18** with hooks
- **Vite** for fast development
- **Monaco Editor** for code editing
- **Tailwind CSS** for styling
- **IndexedDB** for client-side storage
- **React Arborist** for file tree management

### Key Dependencies
```json
{
  "@monaco-editor/react": "^4.6.0",
  "react-arborist": "^3.7.1",
  "js-yaml": "^4.1.0",
  "idb": "^8.0.0",
  "lucide-react": "^0.263.1"
}
```

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Local Development Tips

- Use `npm run dev` for hot reloading
- Monaco Editor loads asynchronously - check browser console for errors
- IndexedDB storage persists between sessions
- Use browser dev tools to inspect the virtual file system

## 🐛 Troubleshooting

### Common Issues

**Editor not loading properly**
- Check browser console for Monaco Editor errors
- Ensure all dependencies are installed: `npm install`

**VN Compiler connection failed**
- Verify the compiler server is running: `vn-compiler server`
- Check the URL in your environment variables
- Ensure CORS is properly configured

**Validation errors**
- Check YAML syntax for proper indentation
- Verify all scene references exist
- Use the validation panel for detailed error information

**File operations not working**
- Check browser storage permissions
- Clear IndexedDB if corruption is suspected
- Ensure project is properly loaded

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Acknowledgments

- Monaco Editor team for the excellent code editor
- React and Vite communities for the development tools
- Visual novel development community for inspiration

## 📞 Support

- Open an issue for bug reports
- Check the [VN Engine docs](https://github.com/KenanMathews/vn-engine) for story format details
- See [VN Compiler docs](https://github.com/KenanMathews/vn-compiler-fresh) for compilation options

---

**Happy story writing! 📚✨**