// utils/storyValidator.js - Updated main export file

export { 
  validateStoryFormat, 
  validateYAMLSyntax, 
  getStoryStatistics, 
  formatStoryContent 
} from './validation/index.js'

export { ErrorReporter, ErrorSeverity, ErrorCategory } from './validation/errorReporter.js'
export { getAllValidHelpers, getHelpersByCategory } from './validation/handlebarsValidator.js'
export { getVariableTypeRecommendation } from './validation/variableValidator.js'
export { getAssetRecommendations, getAssetStatistics } from './validation/assetValidator.js'

// Legacy compatibility wrapper
export const validateStoryStructure = (content) => {
  const result = validateStoryFormat(content)
  return result.warnings || []
}

// Additional utility functions
export const getValidationSummary = (validationResult) => {
  const { summary } = validationResult
  
  return {
    isValid: validationResult.valid,
    totalIssues: summary.totalIssues,
    errors: summary.errorCount,
    warnings: summary.warningCount,
    info: summary.infoCount,
    categoriesAffected: Object.keys(summary.categories).length,
    mostCommonCategory: getMostCommonCategory(summary.categories),
    severity: summary.errorCount > 0 ? 'error' : 
              summary.warningCount > 0 ? 'warning' : 'info'
  }
}

function getMostCommonCategory(categories) {
  let maxCount = 0
  let maxCategory = null
  
  Object.entries(categories).forEach(([category, counts]) => {
    const total = counts.errors + counts.warnings + counts.info
    if (total > maxCount) {
      maxCount = total
      maxCategory = category
    }
  })
  
  return maxCategory
}

export const getQuickFixes = (validationResult) => {
  const fixes = []
  
  validationResult.errors.forEach(error => {
    switch (error.code) {
      case 'SCENES_EMPTY':
        fixes.push({
          code: error.code,
          message: 'Add a basic scene structure',
          suggestion: 'Add an "intro" scene with dialogue',
          autoFixable: true
        })
        break
      case 'SCENE_INVALID_NAME':
        fixes.push({
          code: error.code,
          message: 'Fix scene name format',
          suggestion: 'Use letters, numbers, underscores, and hyphens only',
          autoFixable: false
        })
        break
      case 'HANDLEBARS_UNKNOWN_HELPER':
        fixes.push({
          code: error.code,
          message: 'Replace with valid helper or define custom helper',
          suggestion: 'Check available helpers in autocomplete or ensure custom helper is properly defined',
          autoFixable: false
        })
        break
      case 'JUMP_INVALID_SCENE_REFERENCE':
      case 'CHOICE_INVALID_SCENE_REFERENCE':
        fixes.push({
          code: error.code,
          message: 'Add missing scene or fix reference',
          suggestion: 'Create the referenced scene or correct the scene name',
          autoFixable: false
        })
        break
    }
  })
  
  return fixes
}

export const getValidationTips = (validationResult) => {
  const tips = []
  
  // Scene-related tips
  if (validationResult.summary.categories.scene) {
    tips.push({
      category: 'scenes',
      tip: 'Use descriptive scene names and ensure all scenes are reachable',
      priority: 'high'
    })
  }
  
  // Handlebars tips
  if (validationResult.summary.categories.handlebars) {
    tips.push({
      category: 'handlebars',
      tip: 'Custom helpers should be properly documented and defined in your VN engine',
      priority: 'medium'
    })
  }
  
  // Structure tips
  if (validationResult.summary.categories.structure) {
    tips.push({
      category: 'structure',
      tip: 'Ensure required sections like "scenes" are present',
      priority: 'high'
    })
  }
  
  // Reference tips
  if (validationResult.summary.categories.reference) {
    tips.push({
      category: 'references',
      tip: 'All scene references in goto statements should point to existing scenes',
      priority: 'high'
    })
  }
  
  return tips
}

export const formatValidationForDisplay = (validationResult) => {
  const formatted = {
    summary: getValidationSummary(validationResult),
    errors: validationResult.errors.map(error => ({
      line: error.line,
      column: error.column,
      message: error.message,
      code: error.code,
      category: error.category,
      severity: 'error'
    })),
    warnings: validationResult.warnings.map(warning => ({
      line: warning.line,
      column: warning.column,
      message: warning.message,
      code: warning.code,
      category: warning.category,
      severity: 'warning'
    })),
    info: validationResult.info.map(info => ({
      line: info.line,
      column: info.column,
      message: info.message,
      code: info.code,
      category: info.category,
      severity: 'info'
    })),
    quickFixes: getQuickFixes(validationResult),
    tips: getValidationTips(validationResult)
  }
  
  return formatted
}