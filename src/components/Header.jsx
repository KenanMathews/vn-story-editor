import { 
  Save, 
  FolderOpen, 
  Code, 
  CheckCircle, 
  Map, 
  FileText,
  AlertCircle,
  AlertTriangle,
  Info,
  Eye,
  EyeOff
} from 'lucide-react'

const Header = ({ 
  status, 
  wordCount, 
  validationResult, 
  onFormat, 
  onValidate, 
  onSave, 
  onLoadFile, 
  onToggleMinimap,
  onToggleValidationDetails,
  isMinimapVisible,
  showValidationDetails 
}) => {
  const handleLoadClick = () => {
    document.getElementById('fileInput').click()
  }

  const getValidationDisplay = () => {
    if (!validationResult) return null
    
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

  return (
    <header className="bg-vscode-panel border-b border-vscode-border px-4 py-2 flex items-center justify-between h-12">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-medium">Story Chronicle Editor</span>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-vscode-text-muted">
          <span>{status}</span>
          {validationResult && getValidationDisplay()}
          <span className="text-vscode-text-muted">
            {wordCount.toLocaleString()} words
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={onFormat}
          className="flex items-center space-x-1 px-3 py-1 bg-vscode-bg hover:bg-gray-600 rounded text-xs transition-colors"
          title="Format Document"
        >
          <Code className="w-4 h-4" />
          <span>Format</span>
        </button>
        
        <button
          onClick={onValidate}
          className="flex items-center space-x-1 px-3 py-1 bg-vscode-bg hover:bg-gray-600 rounded text-xs transition-colors"
          title="Validate Story Format"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Validate</span>
        </button>
        
        {validationResult && (
          <button
            onClick={onToggleValidationDetails}
            className={`flex items-center space-x-1 px-3 py-1 rounded text-xs transition-colors ${
              showValidationDetails
                ? 'bg-vscode-blue hover:bg-vscode-blue-hover text-white'
                : 'bg-vscode-bg hover:bg-gray-600'
            }`}
            title={showValidationDetails ? 'Hide Validation Details' : 'Show Validation Details'}
          >
            {showValidationDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>Details</span>
          </button>
        )}
        
        <button
          onClick={onToggleMinimap}
          className={`flex items-center space-x-1 px-3 py-1 rounded text-xs transition-colors ${
            isMinimapVisible 
              ? 'bg-vscode-blue hover:bg-vscode-blue-hover text-white' 
              : 'bg-vscode-bg hover:bg-gray-600'
          }`}
          title="Toggle Minimap"
        >
          <Map className="w-4 h-4" />
          <span>Minimap</span>
        </button>
        
        <button
          onClick={handleLoadClick}
          className="flex items-center space-x-1 px-3 py-1 bg-vscode-bg hover:bg-gray-600 rounded text-xs transition-colors"
          title="Load File"
        >
          <FolderOpen className="w-4 h-4" />
          <span>Load</span>
        </button>
        
        <button
          onClick={onSave}
          className="flex items-center space-x-1 px-3 py-1 bg-vscode-blue hover:bg-vscode-blue-hover text-white rounded text-xs transition-colors"
          title="Save File"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
      </div>
    </header>
  )
}

export default Header