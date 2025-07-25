// components/ui/Header.jsx - Fixed with stable panel toggle
import React from 'react'
import { 
  Save, 
  BookOpen,
  FolderOpen, 
  Code, 
  CheckCircle, 
  Map, 
  FileText,
  AlertCircle,
  AlertTriangle,
  Info,
  Eye,
  EyeOff,
  Plus,
  Terminal,
  ChevronDown,
  Wifi,
  WifiOff,
  Loader
} from 'lucide-react'

const Header = ({ 
  currentProject,
  projects,
  selectedFile,
  validationResult,
  showMinimap,
  onValidate,
  onToggleMinimap,
  onToggleValidation,
  onCreateProject,
  onSelectProject,
  onToggleCommandPanel,
  showCommandPanel,
  onStartTour,
  healthStatus
}) => {
  const getFileTypeIcon = (fileType) => {
    switch (fileType) {
      case 'yaml':
        return <FileText className="w-4 h-4 text-blue-400" />
      case 'javascript':
        return <Code className="w-4 h-4 text-yellow-400" />
      case 'css':
        return <Code className="w-4 h-4 text-purple-400" />
      default:
        return <FileText className="w-4 h-4 text-gray-400" />
    }
  }

  const getHealthIcon = () => {
    switch (healthStatus?.status) {
      case 'healthy':
        return <Wifi className="w-4 h-4 text-green-400" />
      case 'error':
        return <WifiOff className="w-4 h-4 text-red-400" />
      case 'checking':
        return <Loader className="w-4 h-4 text-yellow-400 animate-spin" />
      default:
        return <WifiOff className="w-4 h-4 text-gray-400" />
    }
  }

  const getHealthTooltip = () => {
    switch (healthStatus?.status) {
      case 'healthy':
        return 'VN Compiler is running'
      case 'error':
        return `VN Compiler error: ${healthStatus?.message || 'Not responding'}`
      case 'checking':
        return 'Checking VN Compiler status...'
      default:
        return 'VN Compiler status unknown'
    }
  }

  const getValidationDisplay = () => {
    if (!validationResult || !selectedFile || selectedFile.fileType !== 'yaml') return null
    
    const { errors, warnings, info } = validationResult
    const hasErrors = errors.length > 0
    const hasWarnings = warnings.length > 0
    const hasInfo = info.length > 0
    
    if (hasErrors) {
      return (
        <div className="flex items-center space-x-2">
          <div className="bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            {errors.length} error{errors.length !== 1 ? 's' : ''}
          </div>
          {hasWarnings && (
            <div className="bg-yellow-600 text-white px-2 py-1 rounded text-xs flex items-center">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {warnings.length}
            </div>
          )}
          {hasInfo && (
            <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center">
              <Info className="w-3 h-3 mr-1" />
              {info.length}
            </div>
          )}
        </div>
      )
    } else if (hasWarnings) {
      return (
        <div className="flex items-center space-x-2">
          <div className="bg-yellow-600 text-white px-2 py-1 rounded text-xs flex items-center">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {warnings.length} warning{warnings.length !== 1 ? 's' : ''}
          </div>
          {hasInfo && (
            <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center">
              <Info className="w-3 h-3 mr-1" />
              {info.length}
            </div>
          )}
        </div>
      )
    } else if (hasInfo) {
      return (
        <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center">
          <Info className="w-3 h-3 mr-1" />
          {info.length} info
        </div>
      )
    } else {
      return (
        <div className="bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center">
          <CheckCircle className="w-3 h-3 mr-1" />
          Valid
        </div>
      )
    }
  }

  const handleCreateProject = () => {
    const projectName = prompt('Enter project name:')
    if (projectName) {
      const template = confirm('Create with story template?') ? 'story' : 'blank'
      onCreateProject(projectName, template)
    }
  }

  // Stable command panel toggle handler
  const handleCommandPanelToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Header: Command panel toggle clicked, current state:', showCommandPanel)
    onToggleCommandPanel()
  }

  return (
    <header className="bg-vscode-panel border-b border-vscode-border px-4 py-2 flex items-center justify-between h-12">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {selectedFile ? getFileTypeIcon(selectedFile.fileType) : <FileText className="w-5 h-5 text-blue-400" />}
          <span className="text-sm font-medium">
            {selectedFile ? `${selectedFile.name} - Story Editor` : 'Story Editor'}
          </span>
        </div>
        
        {/* Project Selector */}
        {projects && projects.length > 0 && (
          <div className="flex items-center space-x-2">
            <div className="relative">
              <select
                value={currentProject?.id || ''}
                onChange={(e) => onSelectProject && onSelectProject(e.target.value)}
                className="bg-vscode-bg border border-vscode-border rounded px-3 py-1 pr-8 text-xs text-vscode-text focus:outline-none focus:border-vscode-blue hover:border-vscode-blue transition-colors appearance-none cursor-pointer"
              >
                <option value="">Select Project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 transform -translate-y-1/2 text-vscode-text-muted pointer-events-none" />
            </div>
          </div>
        )}
        
        {currentProject && (
          <div className="flex items-center space-x-2 text-xs text-vscode-text-muted">
            <span>{currentProject.name}</span>
            {selectedFile && getValidationDisplay()}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={handleCreateProject}
          className="flex items-center space-x-1 px-3 py-1 bg-vscode-bg hover:bg-gray-600 rounded text-xs transition-colors"
          title="New Project"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
        
        {selectedFile && selectedFile.fileType === 'yaml' && (
          <button
            onClick={onValidate}
            className="flex items-center space-x-1 px-3 py-1 bg-vscode-bg hover:bg-gray-600 rounded text-xs transition-colors"
            title="Validate Story Format"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Validate</span>
          </button>
        )}
        
        {validationResult && selectedFile && selectedFile.fileType === 'yaml' && (
          <button
            onClick={onToggleValidation}
            className="flex items-center space-x-1 px-3 py-1 bg-vscode-bg hover:bg-gray-600 rounded text-xs transition-colors"
            title="Toggle Validation Details"
          >
            <Eye className="w-4 h-4" />
            <span>Details</span>
          </button>
        )}
        
        <button
          onClick={handleCommandPanelToggle}
          className={`flex items-center space-x-1 px-3 py-1 rounded text-xs transition-colors ${
            showCommandPanel
              ? 'bg-vscode-blue hover:bg-vscode-blue-hover text-white'
              : 'bg-vscode-bg hover:bg-gray-600'
          }`}
          title="Toggle Command Panel"
        >
          <Terminal className="w-4 h-4" />
          <span>Commands</span>
        </button>

        <button
          onClick={onStartTour}
          className="flex items-center space-x-1 px-3 py-1 bg-vscode-bg hover:bg-gray-600 rounded text-xs transition-colors"
          title="Take a tour of the Story Editor"
        >
          <BookOpen className="w-4 h-4" />
          <span>Tour</span>
        </button>
        <div 
          className={`health-status flex items-center space-x-1 px-2 py-1 rounded text-xs border ${
            healthStatus?.status || 'unknown'
          }`}
          title={getHealthTooltip()}
        >
          {getHealthIcon()}
          <span className="text-xs text-vscode-text">
            {healthStatus?.status === 'healthy' ? 'Online' : 
             healthStatus?.status === 'checking' ? 'Checking' : 'Offline'}
          </span>
        </div>
        <button
          onClick={onToggleMinimap}
          className={`flex items-center space-x-1 px-3 py-1 rounded text-xs transition-colors ${
            showMinimap 
              ? 'bg-vscode-blue hover:bg-vscode-blue-hover text-white' 
              : 'bg-vscode-bg hover:bg-gray-600'
          }`}
          title="Toggle Minimap"
        >
          <Map className="w-4 h-4" />
          <span>Minimap</span>
        </button>
      </div>
    </header>
  )
}

export default Header