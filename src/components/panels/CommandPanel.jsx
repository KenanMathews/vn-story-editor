// components/panels/CommandPanel.jsx - Updated with VN Compiler integration
import React from 'react'
import { useCLI } from '../../hooks/useCLI'
import { 
  Play, 
  Terminal, 
  X, 
  CheckCircle, 
  Download, 
  Rocket, 
  Heart,
  AlertCircle,
  Loader
} from 'lucide-react'

const CommandPanel = ({ currentProject, files, selectedFile, onClose }) => {
  const { executeCommand, isRunning, output, clearOutput, error } = useCLI()

  const getProjectData = () => {
    if (!currentProject || !files) return null

    // Find the main YAML file
    let yamlContent = ''
    let yamlFile = null
    let mainYamlPath = null

    // Look for story.yaml or the currently selected YAML file
    const findYamlFile = (fileObj, path = '') => {
      for (const [key, value] of Object.entries(fileObj)) {
        if (value && typeof value === 'object' && 'type' in value) {
          if (value.type === 'yaml' || value.name?.endsWith('.yaml') || value.name?.endsWith('.yml')) {
            // Prefer story.yaml, but accept any YAML file
            if (value.name === 'story.yaml' || !yamlFile) {
              yamlFile = value
              yamlContent = value.content || ''
              // Store the path to exclude from assets
              if (value.path) {
                const pathParts = value.path.split('/')
                mainYamlPath = pathParts.slice(1).join('/')
              } else {
                mainYamlPath = value.name
              }
            }
          }
        } else if (typeof value === 'object') {
          findYamlFile(value, path ? `${path}/${key}` : key)
        }
      }
    }

    findYamlFile(files)

    // If we have a selected YAML file, use that instead
    if (selectedFile && selectedFile.fileType === 'yaml') {
      yamlContent = selectedFile.content || ''
      mainYamlPath = selectedFile.key
    }

    if (!yamlContent) {
      return null
    }

    // Binary file extensions to skip
    const binaryExtensions = new Set([
      'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff',
      'mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'wma',
      'mp4', 'webm', 'avi', 'mov', 'wmv', 'flv', 'mkv',
      'pdf', 'zip', 'rar', '7z', 'tar', 'gz',
      'exe', 'dll', 'so', 'dylib',
      'bin', 'dat', 'db', 'sqlite'
    ])

    // Check if file is a text file (not binary)
    const isTextFile = (filename, type) => {
      if (!filename) return false
      
      const extension = filename.split('.').pop()?.toLowerCase()
      if (!extension) return false
      
      // Skip binary file extensions
      if (binaryExtensions.has(extension)) return false
      
      // Include all text-based files
      return true
    }

    // Properly traverse the file tree structure
    const assets = []
    const traverseFileTree = (fileObj) => {

      for (const [key, value] of Object.entries(fileObj)) {
        if (value && typeof value === 'object' && 'type' in value && 'name' in value) {
          if (value.type === 'folder') {
            const folderContents = {}
            Object.keys(value).forEach(prop => {
              if (prop !== 'type' && prop !== 'name' && prop !== 'path' && 
                  prop !== 'projectId' && prop !== 'children' && prop !== 'content' && 
                  prop !== 'size' && prop !== 'lastModified' && 
                  value[prop] && typeof value[prop] === 'object' && 'type' in value[prop]) {
                console.log(`📄 DEBUG: Found file in folder: ${prop}`)
                folderContents[prop] = value[prop]
              }
            })
            
            if (Object.keys(folderContents).length > 0) {
              traverseFileTree(folderContents)
            }
            continue
          }
          
          let relativePath = value.name 
          
          if (value.path) {
            const pathParts = value.path.split('/')
            if (pathParts.length > 1) {
              relativePath = pathParts.slice(1).join('/') 
            }
          }
          
          
          if (relativePath === mainYamlPath) {
            continue
          }
          
          const isText = isTextFile(value.name, value.type)
          const hasContent = !!value.content
          console.log(`✅ DEBUG: File check:`, {
            relativePath,
            isTextFile: isText,
            hasContent,
            contentLength: value.content?.length || 0
          })
          
          if (isText && hasContent) {
            const blob = new Blob([value.content], { 
              type: getContentType(value.name || value.type) 
            })
            
            assets.push({
              filename: relativePath,
              file: blob
            })
          } else {
            console.log(`❌ DEBUG: Skipping file - isText: ${isText}, hasContent: ${hasContent}`)
          }
        } else if (typeof value === 'object' && value !== null) {
          console.log(`🔄 DEBUG: Recursing into nested structure for key: ${key}`)
          // This is a nested structure, traverse it
          traverseFileTree(value)
        } else {
          console.log(`⚠️  DEBUG: Unhandled value type for key "${key}":`, typeof value)
        }
      }
    }

    traverseFileTree(files)

    return {
      title: currentProject.name || 'My Visual Novel',
      author: 'Story Editor User',
      description: `A visual novel created with Story Editor`,
      yamlContent,
      assets
    }
  }

  const getContentType = (filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase()
    const mimeTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg',
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'css': 'text/css',
      'js': 'application/javascript'
    }
    return mimeTypes[ext] || 'application/octet-stream'
  }

  const commands = [
    { 
      id: 'health-check',
      name: '🏥 Health Check', 
      command: 'health-check', 
      description: 'Check VN Compiler server status',
      icon: Heart,
      variant: 'info'
    },
    { 
      id: 'validate',
      name: '✅ Validate Story', 
      command: 'validate:story', 
      description: 'Validate YAML story format',
      icon: CheckCircle,
      variant: 'success',
      requiresProject: true
    },
    { 
      id: 'build',
      name: '🔨 Build Story', 
      command: 'build:story', 
      description: 'Compile story to HTML (development)',
      icon: Download,
      variant: 'primary',
      requiresProject: true
    },
    { 
      id: 'production',
      name: '🚀 Production Build', 
      command: 'build:production', 
      description: 'Compile optimized story for deployment',
      icon: Rocket,
      variant: 'warning',
      requiresProject: true
    }
  ]

  const handleRunCommand = (cmd) => {
    if (cmd.requiresProject) {
      const projectData = getProjectData()
      if (!projectData) {
        const message = 'No YAML story file found. Please create a story.yaml file or select a YAML file.'
        setOutput(prev => prev + `❌ Error: ${message}\n`)
        return
      }
      executeCommand(cmd.command, projectData)
    } else {
      executeCommand(cmd.command)
    }
  }

  const canRunCommand = (cmd) => {
    if (!cmd.requiresProject) return true
    return currentProject && files && Object.keys(files).length > 0
  }

  const getButtonStyle = (variant, disabled) => {
    const baseStyle = "w-full p-2 text-left rounded border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    
    if (disabled) {
      return `${baseStyle} bg-vscode-bg border-vscode-border text-vscode-text-muted`
    }

    switch (variant) {
      case 'primary':
        return `${baseStyle} bg-blue-600 hover:bg-blue-700 border-blue-500 text-white shadow-sm hover:shadow-md`
      case 'success':
        return `${baseStyle} bg-green-600 hover:bg-green-700 border-green-500 text-white shadow-sm hover:shadow-md`
      case 'warning':
        return `${baseStyle} bg-orange-600 hover:bg-orange-700 border-orange-500 text-white shadow-sm hover:shadow-md`
      case 'info':
        return `${baseStyle} bg-vscode-blue hover:bg-vscode-blue-hover border-vscode-blue text-white shadow-sm hover:shadow-md`
      default:
        return `${baseStyle} bg-vscode-bg hover:bg-gray-600 border-vscode-border text-vscode-text`
    }
  }

  return (
    <div className="fixed right-0 top-12 bottom-0 w-80 bg-vscode-panel border-l border-vscode-border flex flex-col shadow-lg z-40">
      {/* Header - Fixed */}
      <div className="p-2 border-b border-vscode-border flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3 h-3" />
          <span className="text-xs font-medium">VN Compiler</span>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-vscode-bg rounded"
          title="Close command panel"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      
      {/* Project Info - Fixed */}
      <div className="px-2 py-1 border-b border-vscode-border bg-vscode-bg flex-shrink-0">
        <div className="text-xs text-vscode-text-muted">Project:</div>
        <div className="text-xs text-vscode-text font-medium truncate">
          {currentProject ? currentProject.name : 'No project'}
        </div>
        {currentProject && (
          <div className="text-xs text-vscode-text-muted">
            {Object.keys(files).length} files
          </div>
        )}
      </div>

      {/* Commands Section - Scrollable */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          <div className="text-xs text-vscode-text-muted mb-1">Commands:</div>
          {commands.map((cmd) => {
            const Icon = cmd.icon
            const canRun = canRunCommand(cmd)
            
            return (
              <button
                key={cmd.id}
                onClick={() => handleRunCommand(cmd)}
                disabled={isRunning || !canRun}
                className={getButtonStyle(cmd.variant, isRunning || !canRun)}
                title={!canRun ? 'Requires a project with YAML files' : cmd.description}
              >
                <div className="flex items-center space-x-2">
                  <div className="flex-shrink-0">
                    {isRunning ? (
                      <Loader className="w-3 h-3 animate-spin" />
                    ) : (
                      <Icon className="w-3 h-3" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-xs font-medium leading-tight">{cmd.name}</div>
                    <div className="text-xs opacity-75 leading-tight">{cmd.description}</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
        
        {/* Output Terminal - Fixed height, scrollable */}
        <div className="border-t border-vscode-border flex flex-col bg-black" style={{ height: '400px' }}>
          <div className="p-1 border-b border-vscode-border flex items-center justify-between bg-vscode-bg flex-shrink-0">
            <span className="text-xs text-vscode-text-muted flex items-center">
              <Terminal className="w-3 h-3 mr-1" />
              Output
            </span>
            <button 
              onClick={clearOutput}
              className="text-xs text-vscode-text-muted hover:text-vscode-text transition-colors px-1"
              disabled={isRunning}
            >
              Clear
            </button>
          </div>
          <div className="flex-1 p-2 font-mono text-xs text-green-400 overflow-y-auto overflow-x-hidden">
            {output ? (
              <pre className="whitespace-pre-wrap break-words leading-tight">{output}</pre>
            ) : (
              <div className="text-gray-500 italic text-xs">
                Command output will appear here...
              </div>
            )}
            {isRunning && (
              <div className="flex items-center space-x-2 text-yellow-400 mt-1">
                <Loader className="w-3 h-3 animate-spin" />
                <span className="text-xs">Processing...</span>
              </div>
            )}
            {error && (
              <div className="flex items-center space-x-2 text-red-400 mt-1">
                <AlertCircle className="w-3 h-3" />
                <span className="text-xs">Error occurred. Check output above.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommandPanel