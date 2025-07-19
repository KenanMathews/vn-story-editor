import { 
  X, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Bug, 
  Lightbulb,
  ArrowRight
} from 'lucide-react'
import { formatValidationForDisplay } from '../../utils/storyValidator'

const ValidationPanel = ({ validationResult, onClose }) => {
  const formatted = formatValidationForDisplay(validationResult)
  
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />
    }
  }
  
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error':
        return 'border-l-red-500 bg-red-950 bg-opacity-20'
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-950 bg-opacity-20'
      case 'info':
        return 'border-l-blue-500 bg-blue-950 bg-opacity-20'
      default:
        return 'border-l-green-500 bg-green-950 bg-opacity-20'
    }
  }

  const allMessages = [
    ...formatted.errors,
    ...formatted.warnings,
    ...formatted.info
  ].sort((a, b) => a.line - b.line || a.column - b.column)

  return (
    <div className="fixed right-0 top-12 bottom-0 w-96 bg-vscode-panel border-l border-vscode-border flex flex-col shadow-lg z-50">
      {/* Header */}
      <div className="p-4 border-b border-vscode-border bg-vscode-bg flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-vscode-text">Validation Results</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-vscode-panel rounded text-vscode-text-muted"
            title="Close validation panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Summary */}
        <div className="mt-3 flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-vscode-text">{formatted.summary.errors} errors</span>
          </div>
          <div className="flex items-center space-x-1">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-vscode-text">{formatted.summary.warnings} warnings</span>
          </div>
          <div className="flex items-center space-x-1">
            <Info className="w-4 h-4 text-blue-500" />
            <span className="text-vscode-text">{formatted.summary.info} info</span>
          </div>
        </div>
        
        {/* Status */}
        <div className="mt-2">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
            formatted.summary.isValid 
              ? 'bg-green-900 text-green-200 border-green-700' 
              : 'bg-red-900 text-red-200 border-red-700'
          }`}>
            {formatted.summary.isValid ? (
              <>
                <CheckCircle className="w-4 h-4 mr-1" />
                Valid
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 mr-1" />
                Invalid
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Messages */}
        {allMessages.length > 0 ? (
          <div className="p-4 space-y-3">
            <h4 className="font-medium text-vscode-text">Issues Found:</h4>
            {allMessages.map((message, index) => (
              <div 
                key={index} 
                className={`border-l-4 p-3 rounded-r ${getSeverityColor(message.severity)}`}
              >
                <div className="flex items-start space-x-2">
                  {getSeverityIcon(message.severity)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-mono text-vscode-text-muted text-xs">
                        {message.line}:{message.column}
                      </span>
                      <span className="text-xs bg-vscode-bg px-2 py-1 rounded text-vscode-text border border-vscode-border">
                        {message.code}
                      </span>
                    </div>
                    <p className="text-sm text-vscode-text mt-1 break-words">{message.message}</p>
                    {message.category && (
                      <span className="text-xs text-vscode-text-muted mt-1 block">
                        Category: {message.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-vscode-text-muted">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
            <p>No validation issues found!</p>
          </div>
        )}

        {/* Quick Fixes */}
        {formatted.quickFixes.length > 0 && (
          <div className="p-4 border-t border-vscode-border">
            <h4 className="font-medium text-vscode-text mb-3 flex items-center">
              <Bug className="w-4 h-4 mr-1" />
              Quick Fixes:
            </h4>
            <div className="space-y-2">
              {formatted.quickFixes.map((fix, index) => (
                <div key={index} className="bg-blue-950 bg-opacity-20 p-3 rounded border-l-4 border-l-blue-500">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-vscode-bg px-2 py-1 rounded text-blue-400 border border-blue-700">{fix.code}</span>
                    {fix.autoFixable && (
                      <span className="text-xs bg-vscode-bg px-2 py-1 rounded text-green-400 border border-green-700">Auto-fixable</span>
                    )}
                  </div>
                  <p className="text-sm text-vscode-text mt-1">{fix.message}</p>
                  <div className="flex items-center text-xs text-vscode-text-muted mt-1">
                    <ArrowRight className="w-3 h-3 mr-1" />
                    {fix.suggestion}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        {formatted.tips.length > 0 && (
          <div className="p-4 border-t border-vscode-border">
            <h4 className="font-medium text-vscode-text mb-3 flex items-center">
              <Lightbulb className="w-4 h-4 mr-1" />
              Tips:
            </h4>
            <div className="space-y-2">
              {formatted.tips.map((tip, index) => (
                <div key={index} className="bg-yellow-950 bg-opacity-20 p-3 rounded border-l-4 border-l-yellow-500">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-vscode-bg px-2 py-1 rounded text-yellow-400 border border-yellow-700">{tip.category}</span>
                    <span className={`text-xs px-2 py-1 rounded border ${
                      tip.priority === 'high' 
                        ? 'bg-vscode-bg text-red-400 border-red-700' 
                        : 'bg-vscode-bg text-vscode-text border-vscode-border'
                    }`}>
                      {tip.priority}
                    </span>
                  </div>
                  <p className="text-sm text-vscode-text mt-1">{tip.tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ValidationPanel