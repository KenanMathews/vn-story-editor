/**
 * Variables section validation
 */

/**
 * Validate variables section
 */
export function validateVariables(variables, reporter) {
  if (!variables || typeof variables !== 'object') {
    reporter.addError(1, 1, 'VARIABLES_INVALID_TYPE', 'variables must be an object')
    return
  }

  const variableNames = Object.keys(variables)
  
  if (variableNames.length === 0) {
    reporter.addInfo(1, 1, 'VARIABLES_EMPTY', 'Variables section is empty')
    return
  }

  // Validate each variable
  variableNames.forEach(variableName => {
    validateVariable(variableName, variables[variableName], reporter)
  })

  // Check for common patterns and recommendations
  checkVariableRecommendations(variables, reporter)
}

/**
 * Validate individual variable
 */
function validateVariable(name, value, reporter) {
  // Validate variable name
  if (!isValidVariableName(name)) {
    reporter.addError(1, 1, 'VARIABLE_INVALID_NAME', 
      `Invalid variable name: "${name}". Must start with letter/underscore and contain only letters, numbers, underscores, and dots`)
  }

  // Check for reserved names
  if (isReservedVariableName(name)) {
    reporter.addWarning(1, 1, 'VARIABLE_RESERVED_NAME', 
      `Variable name "${name}" is reserved and may conflict with engine functionality`)
  }

  // Validate variable value
  validateVariableValue(name, value, reporter)

  // Check for common naming conventions
  checkVariableNamingConventions(name, reporter)
}

/**
 * Validate variable value
 */
function validateVariableValue(name, value, reporter) {
  // Check for supported types
  const supportedTypes = ['string', 'number', 'boolean', 'object']
  const valueType = Array.isArray(value) ? 'array' : typeof value
  
  if (value === null || value === undefined) {
    reporter.addInfo(1, 1, 'VARIABLE_NULL_VALUE', 
      `Variable "${name}" has null/undefined value`)
    return
  }

  if (!supportedTypes.includes(valueType) && valueType !== 'array') {
    reporter.addWarning(1, 1, 'VARIABLE_UNSUPPORTED_TYPE', 
      `Variable "${name}" has unsupported type: ${valueType}`)
  }

  // Validate specific value types
  switch (valueType) {
    case 'string':
      validateStringVariable(name, value, reporter)
      break
    case 'number':
      validateNumberVariable(name, value, reporter)
      break
    case 'object':
      validateObjectVariable(name, value, reporter)
      break
    case 'array':
      validateArrayVariable(name, value, reporter)
      break
  }
}

/**
 * Validate string variable
 */
function validateStringVariable(name, value, reporter) {

  // Check for potential handlebars expressions in initial values
  if (value.includes('{{') && value.includes('}}')) {
    reporter.addWarning(1, 1, 'VARIABLE_HANDLEBARS_IN_INITIAL', 
      `Variable "${name}" contains handlebars expressions in initial value. This will not be processed at initialization.`)
  }

  // Check for very long strings
  if (value.length > 1000) {
    reporter.addInfo(1, 1, 'VARIABLE_VERY_LONG_STRING', 
      `Variable "${name}" has a very long initial value (${value.length} characters)`)
  }
}

/**
 * Validate number variable
 */
function validateNumberVariable(name, value, reporter) {
  if (!isFinite(value)) {
    reporter.addError(1, 1, 'VARIABLE_INVALID_NUMBER', 
      `Variable "${name}" has invalid number value: ${value}`)
  }

  if (value < 0 && isHealthRelated(name)) {
    reporter.addWarning(1, 1, 'VARIABLE_NEGATIVE_HEALTH', 
      `Variable "${name}" appears to be health-related but has negative initial value`)
  }
}

/**
 * Validate object variable
 */
function validateObjectVariable(name, value, reporter) {
  try {
    JSON.stringify(value)
  } catch (error) {
    reporter.addError(1, 1, 'VARIABLE_NON_SERIALIZABLE', 
      `Variable "${name}" contains non-serializable object`)
  }

  // Check for circular references
  if (hasCircularReference(value)) {
    reporter.addError(1, 1, 'VARIABLE_CIRCULAR_REFERENCE', 
      `Variable "${name}" has circular reference`)
  }

  // Check for nested depth
  const depth = getObjectDepth(value)
  if (depth > 5) {
    reporter.addWarning(1, 1, 'VARIABLE_DEEP_NESTING', 
      `Variable "${name}" has deep nesting (${depth} levels). Consider flattening for better performance.`)
  }

  // Validate object properties
  Object.keys(value).forEach(key => {
    if (!isValidVariableName(key)) {
      reporter.addWarning(1, 1, 'VARIABLE_INVALID_PROPERTY_NAME', 
        `Object variable "${name}" has invalid property name: "${key}"`)
    }
  })
}

/**
 * Validate array variable
 */
function validateArrayVariable(name, value, reporter) {
  // Check for mixed types in array
  const types = [...new Set(value.map(item => typeof item))]
  if (types.length > 1) {
    reporter.addInfo(1, 1, 'VARIABLE_MIXED_ARRAY', 
      `Variable "${name}" contains mixed types: ${types.join(', ')}`)
  }

  // Check for very large arrays
  if (value.length > 100) {
    reporter.addWarning(1, 1, 'VARIABLE_LARGE_ARRAY', 
      `Variable "${name}" has large initial array (${value.length} items). Consider lazy loading.`)
  }

  // Validate array items
  value.forEach((item, index) => {
    if (typeof item === 'object' && item !== null) {
      try {
        JSON.stringify(item)
      } catch (error) {
        reporter.addError(1, 1, 'VARIABLE_NON_SERIALIZABLE_ARRAY_ITEM', 
          `Variable "${name}" array item ${index} is not serializable`)
      }
    }
  })
}

/**
 * Check variable recommendations
 */
function checkVariableRecommendations(variables, reporter) {
  const variableNames = Object.keys(variables)

  // Check for duplicate-like variables
  const duplicates = findDuplicateLikeVariables(variableNames)
  duplicates.forEach(group => {
    reporter.addWarning(1, 1, 'VARIABLE_SIMILAR_NAMES', 
      `Similar variable names detected: ${group.join(', ')}. Consider consistent naming.`)
  })

  // Check for very long variable names
  variableNames.forEach(name => {
    if (name.length > 30) {
      reporter.addInfo(1, 1, 'VARIABLE_LONG_NAME', 
        `Variable name "${name}" is quite long. Consider shorter names for better readability.`)
    }
  })
}

/**
 * Check variable naming conventions
 */
function checkVariableNamingConventions(name, reporter) {
  // Check for uppercase variables (might be constants)
  if (name === name.toUpperCase() && name.length > 2) {
    reporter.addInfo(1, 1, 'VARIABLE_UPPERCASE', 
      `Variable "${name}" is all uppercase. Consider if this should be a constant.`)
  }

  // Check for single letter variables
  if (name.length === 1) {
    reporter.addWarning(1, 1, 'VARIABLE_SINGLE_LETTER', 
      `Variable "${name}" is a single letter. Consider more descriptive names.`)
  }
}

/**
 * Check if variable name is valid
 */
function isValidVariableName(name) {
  return /^[a-zA-Z_][a-zA-Z0-9_.]*$/.test(name)
}

/**
 * Check if variable name is reserved
 */
function isReservedVariableName(name) {
  const reservedNames = [
    'this', 'that', 'root', 'parent', 'index', 'key', 'value', 'first', 'last',
    'length', 'size', 'empty', 'null', 'undefined', 'true', 'false',
    'storyFlags', 'variables', 'choiceHistory', 'gameTime', 'currentScene',
    'currentInstruction', 'computed', 'helpers', 'assets', 'scenes'
  ]
  
  return reservedNames.includes(name.toLowerCase())
}

/**
 * Check if variable name is health-related
 */
function isHealthRelated(name) {
  const healthKeywords = ['health', 'hp', 'life', 'lives', 'stamina', 'energy']
  return healthKeywords.some(keyword => name.toLowerCase().includes(keyword))
}

/**
 * Check for circular references
 */
function hasCircularReference(obj, seen = new WeakSet()) {
  if (obj === null || typeof obj !== 'object') return false
  if (seen.has(obj)) return true
  
  seen.add(obj)
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && hasCircularReference(obj[key], seen)) {
      return true
    }
  }
  
  seen.delete(obj)
  return false
}

/**
 * Get object depth
 */
function getObjectDepth(obj) {
  if (obj === null || typeof obj !== 'object') return 0
  
  let maxDepth = 0
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const depth = getObjectDepth(obj[key])
      maxDepth = Math.max(maxDepth, depth)
    }
  }
  
  return maxDepth + 1
}

/**
 * Find duplicate-like variables
 */
function findDuplicateLikeVariables(names) {
  const groups = []
  const processed = new Set()
  
  names.forEach(name => {
    if (processed.has(name)) return
    
    const similar = names.filter(otherName => 
      otherName !== name && 
      !processed.has(otherName) &&
      areSimilarVariableNames(name, otherName)
    )
    
    if (similar.length > 0) {
      groups.push([name, ...similar])
      processed.add(name)
      similar.forEach(s => processed.add(s))
    }
  })
  
  return groups
}

/**
 * Check if two variable names are similar
 */
function areSimilarVariableNames(name1, name2) {
  // Convert to lowercase for comparison
  const lower1 = name1.toLowerCase()
  const lower2 = name2.toLowerCase()
  
  // Check if one is a variant of the other
  if (lower1.includes(lower2) || lower2.includes(lower1)) {
    return true
  }
  
  // Check for camelCase vs snake_case variants
  const camelToSnake = (str) => str.replace(/([A-Z])/g, '_$1').toLowerCase()
  const snakeToCamel = (str) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
  
  if (camelToSnake(name1) === lower2 || camelToSnake(name2) === lower1) {
    return true
  }
  
  if (snakeToCamel(name1.toLowerCase()) === name2 || snakeToCamel(name2.toLowerCase()) === name1) {
    return true
  }
  
  return false
}

/**
 * Get variable type recommendation
 */
export function getVariableTypeRecommendation(name) {
  const nameUpper = name.toUpperCase()
  
  if (nameUpper.includes('SCORE') || nameUpper.includes('POINTS')) {
    return { type: 'number', defaultValue: 0 }
  }
  
  if (nameUpper.includes('HEALTH') || nameUpper.includes('HP')) {
    return { type: 'number', defaultValue: 100 }
  }
  
  if (nameUpper.includes('NAME') || nameUpper.includes('TITLE')) {
    return { type: 'string', defaultValue: '' }
  }
  
  if (nameUpper.includes('INVENTORY') || nameUpper.includes('ITEMS')) {
    return { type: 'array', defaultValue: [] }
  }
  
  if (nameUpper.includes('SETTINGS') || nameUpper.includes('CONFIG')) {
    return { type: 'object', defaultValue: {} }
  }
  
  if (nameUpper.includes('ENABLED') || nameUpper.includes('ACTIVE') || nameUpper.includes('VISIBLE')) {
    return { type: 'boolean', defaultValue: false }
  }
  
  return { type: 'string', defaultValue: '' }
}

/**
 * Get variable usage suggestions
 */
export function getVariableUsageSuggestions(variables) {
  const suggestions = []
  
  Object.entries(variables).forEach(([name, value]) => {
    if (typeof value === 'number' && value === 0) {
      suggestions.push(`Variable "${name}" could be used with incrementVar helper`)
    }
    
    if (typeof value === 'string' && value === '') {
      suggestions.push(`Variable "${name}" could be set with player input`)
    }
    
    if (Array.isArray(value) && value.length === 0) {
      suggestions.push(`Variable "${name}" could be populated with addToList action`)
    }
  })
  
  return suggestions
}