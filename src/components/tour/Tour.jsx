// components/Tour.jsx - VS Code themed tour component with Tailwind
import React, { useState, useEffect } from 'react'
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen,
  FileText,
  Code,
  Palette,
  Terminal,
  CheckCircle,
  Download,
  Lightbulb,
  Zap,
  Layers,
  Target,
  Play
} from 'lucide-react'

const TOUR_STORAGE_KEY = 'story-editor-tour-completed'

// Tour steps data with VS Code theming
const TOUR_STEPS = [
  {
    id: 1,
    title: "Welcome to Story Editor! 🎉",
    icon: <BookOpen className="w-6 h-6 text-vscode-blue" />,
    content: (
      <div className="space-y-4">
        <p className="text-vscode-text">
          Welcome to the Story Editor - a powerful tool for creating interactive visual novels! 
          This VS Code-inspired interface lets you write, validate, and compile your stories into playable HTML games.
        </p>
        <div className="bg-vscode-bg border border-vscode-blue rounded-lg p-4">
          <h4 className="font-semibold text-vscode-text mb-2 text-sm">What you'll learn:</h4>
          <ul className="text-vscode-text-muted text-sm space-y-1 list-none">
            <li>• Creating and managing story projects</li>
            <li>• Writing YAML story scripts with auto-suggestions</li>
            <li>• Adding custom CSS and JavaScript</li>
            <li>• Validating and debugging your stories</li>
            <li>• Compiling to playable HTML games</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Creating Your First Project",
    icon: <Play className="w-6 h-6" style={{ color: 'var(--vscode-green)' }} />,
    highlight: "button:contains('New Project'), [title*='New Project']",
    content: (
      <div className="space-y-4">
        <p className="text-vscode-text">
          Let's start by creating a new story project. Click the "New Project" button in the header to get started.
        </p>
        <div className="bg-vscode-bg border-l-4 border-vscode-green rounded-r-lg p-4">
          <h4 className="font-semibold text-vscode-text mb-2 text-sm">Project Options:</h4>
          <ul className="text-vscode-text-muted text-sm space-y-2 list-none">
            <li><strong>Blank Project:</strong> Start with an empty project structure</li>
            <li><strong>Story Template:</strong> Begin with a sample story.yaml file with example scenes</li>
          </ul>
        </div>
        <div className="bg-vscode-bg border-l-4 border-vscode-yellow rounded-r-lg p-3">
          <p className="text-vscode-text-muted text-sm">
            💡 <strong>Tip:</strong> Choose "Story Template" for your first project to see example story structure!
          </p>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Understanding the Interface",
    icon: <Layers className="w-6 h-6" style={{ color: 'var(--vscode-purple)' }} />,
    content: (
      <div className="space-y-4">
        <p className="text-vscode-text">
          The Story Editor interface has four main areas designed for efficient workflow:
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-vscode-bg border border-vscode-border rounded-lg p-3">
            <h4 className="font-semibold text-vscode-text mb-1 text-sm">📁 File Explorer</h4>
            <p className="text-vscode-text-muted text-xs">Manage your project files and folders with drag-and-drop support</p>
          </div>
          <div className="bg-vscode-bg border border-vscode-border rounded-lg p-3">
            <h4 className="font-semibold text-vscode-text mb-1 text-sm">✏️ Editor</h4>
            <p className="text-vscode-text-muted text-xs">Write your story with syntax highlighting and auto-completion</p>
          </div>
          <div className="bg-vscode-bg border border-vscode-border rounded-lg p-3">
            <h4 className="font-semibold text-vscode-text mb-1 text-sm">✅ Validation Panel</h4>
            <p className="text-vscode-text-muted text-xs">Check for errors and get helpful suggestions</p>
          </div>
          <div className="bg-vscode-bg border border-vscode-border rounded-lg p-3">
            <h4 className="font-semibold text-vscode-text mb-1 text-sm">⚡ Command Panel</h4>
            <p className="text-vscode-text-muted text-xs">Compile and export your visual novel</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Writing Your Story with YAML",
    icon: <FileText className="w-6 h-6 text-vscode-blue" />,
    highlight: ".monaco-editor",
    content: (
      <div className="space-y-4">
        <p className="text-vscode-text">
          Stories are written in YAML format with a special structure for visual novels. The editor provides powerful features to help you write:
        </p>
        <div className="bg-vscode-bg border border-vscode-blue rounded-lg p-4">
          <h4 className="font-semibold text-vscode-text mb-2 text-sm">🎯 Editor Features:</h4>
          <ul className="text-vscode-text-muted text-sm space-y-1 list-none">
            <li>• <strong>Syntax Highlighting:</strong> Color-coded scenes, choices, and variables</li>
            <li>• <strong>Auto-completion:</strong> Press Ctrl+Space for helper suggestions</li>
            <li>• <strong>Live Validation:</strong> Instant error detection with red underlines</li>
            <li>• <strong>Handlebars Support:</strong> {"'{{variable}}'"} expressions with full helper library</li>
          </ul>
        </div>
        <div className="bg-vscode-bg border-l-4 border-vscode-yellow rounded-r-lg p-3">
          <p className="text-vscode-text-muted text-sm">
            💡 <strong>Pro Tip:</strong> Type {"'{{'"} anywhere to see the Handlebars helper suggestions!
          </p>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Handlebars & Helper System",
    icon: <Zap className="w-6 h-6 text-vscode-yellow" />,
    content: (
      <div className="space-y-4">
        <p className="text-vscode-text">
          The editor includes a comprehensive library of Handlebars helpers for dynamic stories:
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-vscode-bg border border-vscode-border rounded-lg p-3">
            <h4 className="font-semibold text-vscode-text mb-1 text-sm">🎮 Game Logic</h4>
            <div className="text-xs text-vscode-text-muted space-y-1">
              <div><code className="bg-vscode-panel px-1 rounded text-xs">{"'{{setVar 'name' value}}"}</code></div>
              <div><code className="bg-vscode-panel px-1 rounded text-xs">{"'{{hasFlag 'flag'}}"}</code></div>
              <div><code className="bg-vscode-panel px-1 rounded text-xs">{"'{{playerChose 'text'}}"}</code></div>
            </div>
          </div>
          <div className="bg-vscode-bg border border-vscode-border rounded-lg p-3">
            <h4 className="font-semibold text-vscode-text mb-1 text-sm">🔢 Math & Logic</h4>
            <div className="text-xs text-vscode-text-muted space-y-1">
              <div><code className="bg-vscode-panel px-1 rounded text-xs">{"'{{add num1 num2}}'"}</code></div>
              <div><code className="bg-vscode-panel px-1 rounded text-xs">{"'{{random 1 10}}'"}</code></div>
              <div><code className="bg-vscode-panel px-1 rounded text-xs">{"'{{eq value1 value2}}'"}</code></div>
            </div>
          </div>
          <div className="bg-vscode-bg border border-vscode-border rounded-lg p-3">
            <h4 className="font-semibold text-vscode-text mb-1 text-sm">📝 Text Processing</h4>
            <div className="text-xs text-vscode-text-muted space-y-1">
              <div><code className="bg-vscode-panel px-1 rounded text-xs">{"'{{uppercase text}}'"}</code></div>
              <div><code className="bg-vscode-panel px-1 rounded text-xs">{"'{{truncate text 50}}'"}</code></div>
              <div><code className="bg-vscode-panel px-1 rounded text-xs">{"'{{replace text old new}}'"}</code></div>
            </div>
          </div>
          <div className="bg-vscode-bg border border-vscode-border rounded-lg p-3">
            <h4 className="font-semibold text-vscode-text mb-1 text-sm">📊 Arrays & Objects</h4>
            <div className="text-xs text-vscode-text-muted space-y-1">
              <div><code className="bg-vscode-panel px-1 rounded text-xs">{"'{{first array}}'"}</code></div>
              <div><code className="bg-vscode-panel px-1 rounded text-xs">{"'{{length array}}'"}</code></div>
              <div><code className="bg-vscode-panel px-1 rounded text-xs">{"'{{join array \", \"}}'"}</code></div>
            </div>
          </div>
        </div>
        <div className="bg-vscode-bg border-l-4 border-vscode-yellow rounded-r-lg p-3">
          <p className="text-vscode-text-muted text-sm">
            💡 <strong>Pro Tip:</strong> Hover over any helper in the editor to see usage examples and documentation!
          </p>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "Adding Custom Styling & Scripts",
    icon: <Palette className="w-6 h-6" style={{ color: 'var(--vscode-purple)' }} />,
    content: (
      <div className="space-y-4">
        <p className="text-vscode-text">
          Enhance your visual novel with custom CSS styling and JavaScript functionality:
        </p>
        <div className="space-y-3">
          <div className="bg-vscode-bg border border-vscode-border rounded-lg p-4">
            <h4 className="font-semibold text-vscode-text mb-2 text-sm">🎨 CSS Files</h4>
            <p className="text-vscode-text-muted text-sm mb-2">
              Create custom themes, animations, and layouts for your visual novel.
            </p>
            <ul className="text-vscode-text-muted text-xs space-y-1 list-none">
              <li>• Full CSS3 support with syntax highlighting</li>
              <li>• Auto-completion for properties and values</li>
              <li>• Built-in snippets for common patterns</li>
              <li>• Live validation and error checking</li>
            </ul>
          </div>
          <div className="bg-vscode-bg border border-vscode-border rounded-lg p-4">
            <h4 className="font-semibold text-vscode-text mb-2 text-sm">⚡ JavaScript Files</h4>
            <p className="text-vscode-text-muted text-sm mb-2">
              Add custom game mechanics, save systems, or special effects.
            </p>
            <ul className="text-vscode-text-muted text-xs space-y-1 list-none">
              <li>• Modern ES6+ JavaScript support</li>
              <li>• IntelliSense and parameter hints</li>
              <li>• Error detection and debugging</li>
              <li>• Auto-formatting and code actions</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 7,
    title: "Validation & Error Checking",
    icon: <CheckCircle className="w-6 h-6" style={{ color: 'var(--vscode-green)' }} />,
    highlight: "button:contains('Validate')",
    content: (
      <div className="space-y-4">
        <p className="text-vscode-text">
          The built-in validation system helps you catch errors and improve your story quality:
        </p>
        <div className="bg-vscode-bg border-l-4 border-vscode-green rounded-r-lg p-4">
          <h4 className="font-semibold text-vscode-text mb-2 text-sm">🔍 Validation Features:</h4>
          <ul className="text-vscode-text-muted text-sm space-y-1 list-none">
            <li>• <strong>Real-time checking:</strong> Errors appear as you type</li>
            <li>• <strong>Detailed reports:</strong> Click "Validate" for comprehensive analysis</li>
            <li>• <strong>Smart suggestions:</strong> Get fixes for common issues</li>
            <li>• <strong>Scene validation:</strong> Check for unreachable scenes</li>
            <li>• <strong>Helper validation:</strong> Verify handlebars expressions</li>
          </ul>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center space-x-2 bg-vscode-bg border border-vscode-border p-2 rounded">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--vscode-red)' }}></div>
            <span className="text-vscode-text-muted">Errors (must fix)</span>
          </div>
          <div className="flex items-center space-x-2 bg-vscode-bg border border-vscode-border p-2 rounded">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--vscode-yellow)' }}></div>
            <span className="text-vscode-text-muted">Warnings (should fix)</span>
          </div>
          <div className="flex items-center space-x-2 bg-vscode-bg border border-vscode-border p-2 rounded">
            <div className="w-3 h-3 rounded-full bg-vscode-blue"></div>
            <span className="text-vscode-text-muted">Info (suggestions)</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 8,
    title: "VN Compiler Commands",
    icon: <Terminal className="w-6 h-6 text-vscode-yellow" />,
    highlight: "button:contains('Commands')",
    content: (
      <div className="space-y-4">
        <p className="text-vscode-text">
          The Command Panel connects to the VN Compiler server to build your visual novel:
        </p>
        <div className="space-y-3">
          <div className="bg-vscode-bg border border-vscode-border rounded-lg p-3">
            <h4 className="font-semibold text-vscode-text mb-2 text-sm">🏥 Health Check</h4>
            <p className="text-vscode-text-muted text-sm">
              Verify that the VN Compiler server is running and accessible.
            </p>
          </div>
          <div className="bg-vscode-bg border border-vscode-border rounded-lg p-3">
            <h4 className="font-semibold text-vscode-text mb-2 text-sm">✅ Validate Story</h4>
            <p className="text-vscode-text-muted text-sm">
              Server-side validation with comprehensive error checking.
            </p>
          </div>
          <div className="bg-vscode-bg border border-vscode-border rounded-lg p-3">
            <h4 className="font-semibold text-vscode-text mb-2 text-sm">🔨 Build Story</h4>
            <p className="text-vscode-text-muted text-sm">
              Compile your story into a playable HTML file for testing.
            </p>
          </div>
          <div className="bg-vscode-bg border border-vscode-border rounded-lg p-3">
            <h4 className="font-semibold text-vscode-text mb-2 text-sm">🚀 Production Build</h4>
            <p className="text-vscode-text-muted text-sm">
              Create an optimized, minified version ready for deployment.
            </p>
          </div>
        </div>
        <div className="bg-vscode-bg border-l-4 border-vscode-border rounded-r-lg p-3">
          <p className="text-vscode-text-muted text-sm">
            <strong>Prerequisites:</strong> Start the VN Compiler server with <code className="bg-vscode-panel px-1 rounded text-xs">vn-compiler server</code>
          </p>
        </div>
      </div>
    )
  },
  {
    id: 9,
    title: "Building & Downloading Your Game",
    icon: <Download className="w-6 h-6 text-vscode-blue" />,
    content: (
      <div className="space-y-4">
        <p className="text-vscode-text">
          Once your story is ready, compile it into a standalone HTML game that can be played anywhere:
        </p>
        <div className="bg-vscode-bg border border-vscode-blue rounded-lg p-4">
          <h4 className="font-semibold text-vscode-text mb-2 text-sm">📦 Build Process:</h4>
          <ol className="text-vscode-text-muted text-sm space-y-2 pl-4">
            <li><strong>1. Validation:</strong> Story format is checked for errors</li>
            <li><strong>2. Asset Processing:</strong> All files are bundled together</li>
            <li><strong>3. Compilation:</strong> YAML is converted to interactive HTML</li>
            <li><strong>4. Optimization:</strong> Code is minified (production builds)</li>
            <li><strong>5. Download:</strong> Complete game file is downloaded</li>
          </ol>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-vscode-bg border-l-4 border-vscode-green rounded-r-lg p-3">
            <h4 className="font-semibold text-vscode-text text-sm">🔨 Development Build</h4>
            <p className="text-vscode-text-muted text-xs mt-1">
              Unminified, includes debug info, fast compilation
            </p>
          </div>
          <div className="bg-vscode-bg border-l-4 border-vscode-purple rounded-r-lg p-3">
            <h4 className="font-semibold text-vscode-text text-sm">🚀 Production Build</h4>
            <p className="text-vscode-text-muted text-xs mt-1">
              Optimized, minified, ready for web deployment
            </p>
          </div>
        </div>
        <div className="bg-vscode-bg border-l-4 border-vscode-yellow rounded-r-lg p-3">
          <p className="text-vscode-text-muted text-sm">
            <strong>Output:</strong> A single HTML file containing your entire visual novel that works in any modern web browser!
          </p>
        </div>
      </div>
    )
  },
  {
    id: 10,
    title: "Tips & Next Steps",
    icon: <Lightbulb className="w-6 h-6 text-vscode-yellow" />,
    content: (
      <div className="space-y-4">
        <p className="text-vscode-text">
          Congratulations! You're ready to create amazing visual novels. Here are some pro tips:
        </p>
        <div className="space-y-3">
          <div className="bg-vscode-bg border-l-4 border-vscode-blue rounded-r-lg p-4">
            <h4 className="font-semibold text-vscode-text mb-2 text-sm">🎯 Best Practices:</h4>
            <ul className="text-vscode-text-muted text-sm space-y-1 list-none">
              <li>• Use descriptive scene names (intro, chapter1_choice, ending_good)</li>
              <li>• Organize assets in folders (images/, audio/, styles/)</li>
              <li>• Test frequently with development builds</li>
              <li>• Use variables for character names and stats</li>
              <li>• Write comments in your YAML for complex logic</li>
            </ul>
          </div>
          <div className="bg-vscode-bg border-l-4 border-vscode-green rounded-r-lg p-4">
            <h4 className="font-semibold text-vscode-text mb-2 text-sm">⚡ Power Features:</h4>
            <ul className="text-vscode-text-muted text-sm space-y-1 list-none">
              <li>• Drag & drop files in the explorer</li>
              <li>• Use Ctrl+Space for auto-completion everywhere</li>
              <li>• Right-click for context menus</li>
              <li>• Keyboard shortcuts (Ctrl+S to save, Ctrl+/ to comment)</li>
            </ul>
          </div>
        </div>
        <div className="text-center p-4 bg-vscode-bg border border-vscode-border rounded-lg">
          <h3 className="font-bold text-vscode-text mb-2">Ready to Create Amazing Stories! 🎉</h3>
          <p className="text-vscode-text-muted text-sm">
            Start with the story template, experiment with helpers, and don't forget to validate before building!
          </p>
        </div>
      </div>
    )
  }
]

// Main Tour Component
const Tour = ({ isActive, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = TOUR_STEPS.length

  const currentStepData = TOUR_STEPS.find(step => step.id === currentStep)

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      completeTour()
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeTour = () => {
    localStorage.setItem(TOUR_STORAGE_KEY, 'true')
    onClose()
    setCurrentStep(1)
  }

  const handleSkip = () => {
    completeTour()
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isActive) return
      
      switch (e.key) {
        case 'ArrowRight':
        case 'Enter':
          e.preventDefault()
          handleNext()
          break
        case 'ArrowLeft':
          e.preventDefault()
          handlePrev()
          break
        case 'Escape':
          e.preventDefault()
          handleSkip()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isActive, currentStep])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[9999] flex items-center justify-center p-4">
      <div className="bg-vscode-panel border border-vscode-border rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div 
          className="text-white p-6"
          style={{ 
            background: 'linear-gradient(135deg, var(--vscode-blue), var(--vscode-purple))'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                {currentStepData?.icon || <BookOpen className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-xl font-bold">{currentStepData?.title}</h2>
                <p className="text-blue-100 text-sm">Interactive Story Creation Workflow</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full transition-colors"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                ':hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-blue-100 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% complete</span>
            </div>
            <div 
              className="w-full rounded-full h-2"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {currentStepData?.content}
        </div>

        {/* Footer */}
        <div className="bg-vscode-bg px-6 py-4 flex items-center justify-between border-t border-vscode-border">
          <button
            onClick={handleSkip}
            className="text-vscode-text-muted hover:text-vscode-text text-sm transition-colors"
          >
            Skip Tour
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-4 py-2 border border-vscode-border rounded-lg hover:bg-vscode-panel disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-vscode-text"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-2 bg-vscode-blue text-white rounded-lg hover:opacity-90 transition-colors"
            >
              <span>{currentStep === totalSteps ? 'Finish Tour' : 'Next'}</span>
              {currentStep !== totalSteps && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook for managing tour state
export const useTour = () => {
  const [showTour, setShowTour] = useState(false)

  const startTour = () => setShowTour(true)
  const closeTour = () => setShowTour(false)

  const hasCompletedTour = () => {
    return localStorage.getItem(TOUR_STORAGE_KEY) === 'true'
  }

  const resetTour = () => {
    localStorage.removeItem(TOUR_STORAGE_KEY)
  }

  // Auto-show tour for first-time users
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasCompletedTour()) {
        setShowTour(true)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return {
    showTour,
    startTour,
    closeTour,
    hasCompletedTour,
    resetTour
  }
}

export default Tour