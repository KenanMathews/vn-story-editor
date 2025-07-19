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
import { formatValidationForDisplay } from '../utils/storyValidator'

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
        return 'border-l-red-500 bg-red-50 dark:bg-red-950 dark:border-l-red-400'
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950 dark:border-l-yellow-400'
      case 'info':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-l-blue-400'
      default:
        return 'border-l-green-500 bg-green-50 dark:bg-green-950 dark:border-l-green-400'
    }
  }

  const allMessages = [
    ...formatted.errors,
    ...formatted.warnings,
    ...formatted.info
  ].sort((a, b) => a.line - b.line || a.column - b.column)

  return (
    <div className="fixed right-0 top-12 bottom-0 w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col shadow-lg z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Validation Results</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
            title="Close validation panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Summary */}
        <div className="mt-3 flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-gray-700 dark:text-gray-300">{formatted.summary.errors} errors</span>
          </div>
          <div className="flex items-center space-x-1">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-700 dark:text-gray-300">{formatted.summary.warnings} warnings</span>
          </div>
          <div className="flex items-center space-x-1">
            <Info className="w-4 h-4 text-blue-500" />
            <span className="text-gray-700 dark:text-gray-300">{formatted.summary.info} info</span>
          </div>
        </div>
        
        {/* Status */}
        <div className="mt-2">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            formatted.summary.isValid 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
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
            <h4 className="font-medium text-gray-800 dark:text-gray-200">Issues Found:</h4>
            {allMessages.map((message, index) => (
              <div 
                key={index} 
                className={`border-l-4 p-3 rounded-r ${getSeverityColor(message.severity)}`}
              >
                <div className="flex items-start space-x-2">
                  {getSeverityIcon(message.severity)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-mono text-gray-600 dark:text-gray-400 text-xs">
                        {message.line}:{message.column}
                      </span>
                      <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                        {message.code}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 break-words">{message.message}</p>
                    {message.category && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                        Category: {message.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
            <p>No validation issues found!</p>
          </div>
        )}

        {/* Quick Fixes */}
        {formatted.quickFixes.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              <Bug className="w-4 h-4 mr-1" />
              Quick Fixes:
            </h4>
            <div className="space-y-2">
              {formatted.quickFixes.map((fix, index) => (
                <div key={index} className="bg-blue-50 dark:bg-blue-950 p-3 rounded border-l-4 border-l-blue-500">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-blue-200 dark:bg-blue-700 px-2 py-1 rounded text-blue-800 dark:text-blue-200">{fix.code}</span>
                    {fix.autoFixable && (
                      <span className="text-xs bg-green-200 dark:bg-green-700 px-2 py-1 rounded text-green-800 dark:text-green-200">Auto-fixable</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{fix.message}</p>
                  <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
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
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              <Lightbulb className="w-4 h-4 mr-1" />
              Tips:
            </h4>
            <div className="space-y-2">
              {formatted.tips.map((tip, index) => (
                <div key={index} className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded border-l-4 border-l-yellow-500">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-yellow-200 dark:bg-yellow-700 px-2 py-1 rounded text-yellow-800 dark:text-yellow-200">{tip.category}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      tip.priority === 'high' 
                        ? 'bg-red-200 dark:bg-red-700 text-red-800 dark:text-red-200' 
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                    }`}>
                      {tip.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{tip.tip}</p>
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