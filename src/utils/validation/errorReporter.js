/**
 * Error severity levels
 */
export const ErrorSeverity = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

/**
 * Error categories for better organization
 */
export const ErrorCategory = {
  YAML_SYNTAX: 'yaml_syntax',
  STRUCTURE: 'structure',
  SCENE: 'scene',
  INSTRUCTION: 'instruction',
  ACTION: 'action',
  HANDLEBARS: 'handlebars',
  REFERENCE: 'reference',
  VALIDATION: 'validation'
}

/**
 * Comprehensive error reporter for story validation
 */
export class ErrorReporter {
  constructor() {
    this.errors = []
    this.warnings = []
    this.info = []
    this.context = null
  }

  /**
   * Set context for subsequent errors
   */
  setContext(context) {
    this.context = context
  }

  /**
   * Add an error
   */
  addError(line, column, code, message, details = {}) {
    this.errors.push({
      severity: ErrorSeverity.ERROR,
      line: line || 1,
      column: column || 1,
      code,
      message,
      category: this.getCategoryFromCode(code),
      context: this.context,
      details,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Add a warning
   */
  addWarning(line, column, code, message, details = {}) {
    this.warnings.push({
      severity: ErrorSeverity.WARNING,
      line: line || 1,
      column: column || 1,
      code,
      message,
      category: this.getCategoryFromCode(code),
      context: this.context,
      details,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Add an info message
   */
  addInfo(line, column, code, message, details = {}) {
    this.info.push({
      severity: ErrorSeverity.INFO,
      line: line || 1,
      column: column || 1,
      code,
      message,
      category: this.getCategoryFromCode(code),
      context: this.context,
      details,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Add YAML parsing error with enhanced details
   */
  addYAMLError(yamlError) {
    let line = 1
    let column = 1
    let message = 'YAML parsing error'
    let details = {}

    if (yamlError.mark) {
      line = yamlError.mark.line + 1
      column = yamlError.mark.column + 1
      
      if (yamlError.reason) {
        message = yamlError.reason
      }
      
      details = {
        buffer: yamlError.mark.buffer,
        position: yamlError.mark.position,
        snippet: yamlError.mark.get_snippet ? yamlError.mark.get_snippet() : null
      }
    } else if (yamlError.message) {
      message = yamlError.message
    }

    this.addError(line, column, 'YAML_PARSE_ERROR', message, details)
  }

  /**
   * Add scene-specific error
   */
  addSceneError(sceneName, instructionIndex, code, message, details = {}) {
    const context = `scene "${sceneName}"${instructionIndex !== undefined ? `, instruction ${instructionIndex + 1}` : ''}`
    
    this.addError(1, 1, code, `In ${context}: ${message}`, {
      sceneName,
      instructionIndex,
      ...details
    })
  }

  /**
   * Add choice-specific error
   */
  addChoiceError(sceneName, instructionIndex, choiceIndex, code, message, details = {}) {
    const context = `scene "${sceneName}", instruction ${instructionIndex + 1}, choice ${choiceIndex + 1}`
    
    this.addError(1, 1, code, `In ${context}: ${message}`, {
      sceneName,
      instructionIndex,
      choiceIndex,
      ...details
    })
  }

  /**
   * Add action-specific error
   */
  addActionError(sceneName, instructionIndex, actionIndex, code, message, details = {}) {
    const context = `scene "${sceneName}", instruction ${instructionIndex + 1}, action ${actionIndex + 1}`
    
    this.addError(1, 1, code, `In ${context}: ${message}`, {
      sceneName,
      instructionIndex,
      actionIndex,
      ...details
    })
  }

  /**
   * Add handlebars-specific error
   */
  addHandlebarsError(line, column, code, message, expression, details = {}) {
    this.addError(line, column, code, `Handlebars expression "${expression}": ${message}`, {
      expression,
      ...details
    })
  }

  /**
   * Add handlebars-specific warning
   */
  addHandlebarsWarning(line, column, code, message, expression, details = {}) {
    this.addWarning(line, column, code, `Handlebars expression "${expression}": ${message}`, {
      expression,
      ...details
    })
  }

  /**
   * Add handlebars-specific info
   */
  addHandlebarsInfo(line, column, code, message, expression, details = {}) {
    this.addInfo(line, column, code, `Handlebars expression "${expression}": ${message}`, {
      expression,
      ...details
    })
  }

  /**
   * Get all messages (errors, warnings, info)
   */
  getAllMessages() {
    return [...this.errors, ...this.warnings, ...this.info]
      .sort((a, b) => a.line - b.line || a.column - b.column)
  }

  /**
   * Get messages by severity
   */
  getMessagesBySeverity(severity) {
    return this.getAllMessages().filter(msg => msg.severity === severity)
  }

  /**
   * Get messages by category
   */
  getMessagesByCategory(category) {
    return this.getAllMessages().filter(msg => msg.category === category)
  }

  /**
   * Check if there are any errors
   */
  hasErrors() {
    return this.errors.length > 0
  }

  /**
   * Check if there are any warnings
   */
  hasWarnings() {
    return this.warnings.length > 0
  }

  /**
   * Get validation result
   */
  getResult() {
    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      info: this.info,
      summary: {
        totalIssues: this.errors.length + this.warnings.length + this.info.length,
        errorCount: this.errors.length,
        warningCount: this.warnings.length,
        infoCount: this.info.length,
        categories: this.getCategorySummary()
      }
    }
  }

  /**
   * Get summary by category
   */
  getCategorySummary() {
    const categories = {}
    
    this.getAllMessages().forEach(msg => {
      if (!categories[msg.category]) {
        categories[msg.category] = {
          errors: 0,
          warnings: 0,
          info: 0
        }
      }
      categories[msg.category][msg.severity]++
    })
    
    return categories
  }

  /**
   * Get category from error code
   */
  getCategoryFromCode(code) {
    if (code.includes('YAML')) return ErrorCategory.YAML_SYNTAX
    if (code.includes('SCENE')) return ErrorCategory.SCENE
    if (code.includes('INSTRUCTION')) return ErrorCategory.INSTRUCTION
    if (code.includes('ACTION')) return ErrorCategory.ACTION
    if (code.includes('HANDLEBARS')) return ErrorCategory.HANDLEBARS
    if (code.includes('REFERENCE')) return ErrorCategory.REFERENCE
    if (code.includes('STRUCTURE')) return ErrorCategory.STRUCTURE
    return ErrorCategory.VALIDATION
  }

  /**
   * Format error for display
   */
  formatError(error) {
    const prefix = error.severity.toUpperCase()
    const location = `${error.line}:${error.column}`
    return `[${prefix}] ${location} ${error.code}: ${error.message}`
  }

  /**
   * Format all errors for display
   */
  formatAllErrors() {
    return this.getAllMessages().map(error => this.formatError(error))
  }

  /**
   * Get detailed report
   */
  getDetailedReport() {
    const report = {
      summary: this.getResult().summary,
      errors: this.errors.map(e => this.formatError(e)),
      warnings: this.warnings.map(w => this.formatError(w)),
      info: this.info.map(i => this.formatError(i)),
      byCategory: {}
    }

    // Group by category
    Object.values(ErrorCategory).forEach(category => {
      const categoryMessages = this.getMessagesByCategory(category)
      if (categoryMessages.length > 0) {
        report.byCategory[category] = categoryMessages.map(m => this.formatError(m))
      }
    })

    return report
  }

  /**
   * Clear all messages
   */
  clear() {
    this.errors = []
    this.warnings = []
    this.info = []
    this.context = null
  }

  /**
   * Add multiple errors at once
   */
  addErrors(errors) {
    errors.forEach(error => {
      if (error.severity === ErrorSeverity.WARNING) {
        this.addWarning(error.line, error.column, error.code, error.message, error.details)
      } else if (error.severity === ErrorSeverity.INFO) {
        this.addInfo(error.line, error.column, error.code, error.message, error.details)
      } else {
        this.addError(error.line, error.column, error.code, error.message, error.details)
      }
    })
  }

  /**
   * Create a suggestion for fixing an error
   */
  createSuggestion(code, suggestion) {
    return {
      code,
      suggestion,
      canAutoFix: false // Could be enhanced to support auto-fixing
    }
  }

  /**
   * Get error statistics
   */
  getStatistics() {
    return {
      total: this.getAllMessages().length,
      errors: this.errors.length,
      warnings: this.warnings.length,
      info: this.info.length,
      mostCommonCode: this.getMostCommonErrorCode(),
      categoryCounts: this.getCategorySummary()
    }
  }

  /**
   * Get most common error code
   */
  getMostCommonErrorCode() {
    const codeCounts = {}
    
    this.getAllMessages().forEach(msg => {
      codeCounts[msg.code] = (codeCounts[msg.code] || 0) + 1
    })
    
    return Object.keys(codeCounts).reduce((a, b) => 
      codeCounts[a] > codeCounts[b] ? a : b, null
    )
  }
}