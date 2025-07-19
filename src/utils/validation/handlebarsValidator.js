/**
 * Handlebars expression validation - Updated to be less strict
 */

/**
 * Valid VN Engine helpers categorized by type
 */
const VALID_HELPERS = {
  // VN-specific helpers
  vn: [
    'hasFlag', 'addFlag', 'removeFlag', 'toggleFlag', 'getVar', 'setVar', 
    'hasVar', 'incrementVar', 'playerChose', 'getLastChoice', 'choiceCount',
    'formatTime', 'randomBool', 'debug', 'timestamp', 'currentDate', 'currentTime',
    'input', 'saveGame', 'loadGame', 'quickSave', 'quickLoad', 'hasSave',
    'textInput', 'selectInput', 'checkboxInput', 'numberInput', 'component'
  ],
  
  // Comparison helpers
  comparison: [
    'eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'and', 'or', 'not', 'contains',
    'isEmpty', 'isString', 'isNumber', 'isArray', 'isObject', 'isBoolean',
    'compare', 'between', 'ifx', 'ternary', 'coalesce', 'default', 'eqw', 'neqw'
  ],
  
  // Math helpers
  math: [
    'add', 'subtract', 'multiply', 'divide', 'remainder', 'mod', 'abs', 'min', 'max',
    'round', 'ceil', 'floor', 'random', 'randomInt', 'clamp', 'sum', 'average',
    'percentage', 'statCheck', 'rollDice', 'lerp', 'normalize', 'formatNumber',
    'inRange', 'isEven', 'isOdd'
  ],
  
  // String helpers
  string: [
    'uppercase', 'lowercase', 'capitalize', 'capitalizeFirst', 'titleCase',
    'trim', 'truncate', 'ellipsis', 'replace', 'remove', 'reverse', 'repeat',
    'padStart', 'padEnd', 'center', 'startsWith', 'endsWith', 'includes',
    'substring', 'words', 'wordCount', 'slugify', 'stripTags', 'typewriter',
    'nameTag', 'dialogueFormat', 'parseMarkdown', 'sanitizeInput', 'colorText', 'charAt'
  ],
  
  // Array helpers
  array: [
    'first', 'last', 'length', 'size', 'includes', 'isEmpty', 'filter', 'find',
    'where', 'map', 'pluck', 'join', 'groupBy', 'chunk', 'unique', 'shuffle',
    'slice', 'take', 'sample', 'sampleSize', 'flatten', 'reverse', 'concat',
    'compact', 'without', 'randomChoice', 'weightedChoice', 'cycleNext',
    'findByProperty', 'array', 'range', 'times'
  ],
  
  // Asset helpers
  asset: [
    'hasAsset', 'getAsset', 'resolveAsset', 'getAssetInfo', 'getMediaType',
    'normalizeKey', 'assetCount', 'formatFileSize', 'validateAsset',
    'showImage', 'playAudio', 'playVideo'
  ],
  
  // Built-in Handlebars helpers
  handlebars: [
    'if', 'unless', 'each', 'with', 'lookup', 'log', 'blockHelperMissing',
    'helperMissing', 'noop'
  ],
  
  // Time/Date helpers (commonly used)
  time: [
    'currentTime', 'currentDate', 'formatDate', 'timeElapsed', 'addTime'
  ]
}

/**
 * All valid helpers flattened
 */
const ALL_VALID_HELPERS = Object.values(VALID_HELPERS).flat()

/**
 * Helpers that are commonly custom-defined by users
 */
const COMMONLY_CUSTOM_HELPERS = [
  'input', 'custom', 'gameSpecific', 'userDefined', 'scenario',
  'save', 'load', 'Input', 'Save', 'Load', 'Game', 'component'
]

/**
 * Helpers that expect specific argument patterns
 */
const HELPER_SIGNATURES = {
  // VN helpers
  'hasFlag': { args: 1, types: ['string'] },
  'addFlag': { args: 1, types: ['string'] },
  'removeFlag': { args: 1, types: ['string'] },
  'toggleFlag': { args: 1, types: ['string'] },
  'getVar': { args: [1, 2], types: ['string', 'any'] },
  'setVar': { args: 2, types: ['string', 'any'] },
  'incrementVar': { args: 2, types: ['string', 'number'] },
  'playerChose': { args: [1, 2], types: ['string', 'string'] },
  'formatTime': { args: 1, types: ['number'] },
  'randomBool': { args: [0, 1], types: ['number'] },
  'input': { args: [2, 4], types: ['string', 'string', 'string', 'any'] },
  
  // Save/Load helpers
  'saveGame': { args: 1, types: ['number'] },
  'loadGame': { args: 1, types: ['number'] },
  'quickSave': { args: 0, types: [] },
  'quickLoad': { args: 0, types: [] },
  'hasSave': { args: 1, types: ['number'] },
  
  // Input helpers
  'textInput': { args: [2, 3], types: ['string', 'string', 'string'] },
  'selectInput': { args: 3, types: ['string', 'string', 'string'] },
  'checkboxInput': { args: 2, types: ['string', 'string'] },
  'numberInput': { args: [2, 4], types: ['string', 'string', 'number', 'number'] },
  'component': { args: [1, 2], types: ['string', 'any'] },
  
  // Comparison helpers
  'eq': { args: 2, types: ['any', 'any'] },
  'ne': { args: 2, types: ['any', 'any'] },
  'gt': { args: 2, types: ['number', 'number'] },
  'gte': { args: 2, types: ['number', 'number'] },
  'lt': { args: 2, types: ['number', 'number'] },
  'lte': { args: 2, types: ['number', 'number'] },
  'and': { args: '2+', types: ['any'] },
  'or': { args: '2+', types: ['any'] },
  'not': { args: 1, types: ['any'] },
  'contains': { args: 2, types: ['any', 'any'] },
  'between': { args: 3, types: ['number', 'number', 'number'] },
  
  // Math helpers
  'add': { args: '2+', types: ['number'] },
  'subtract': { args: 2, types: ['number', 'number'] },
  'multiply': { args: '2+', types: ['number'] },
  'divide': { args: 2, types: ['number', 'number'] },
  'random': { args: 2, types: ['number', 'number'] },
  'randomInt': { args: 2, types: ['number', 'number'] },
  'clamp': { args: 3, types: ['number', 'number', 'number'] },
  'rollDice': { args: [1, 2], types: ['number', 'number'] },
  
  // String helpers
  'truncate': { args: [2, 3], types: ['string', 'number', 'string'] },
  'replace': { args: 3, types: ['string', 'string', 'string'] },
  'repeat': { args: 2, types: ['string', 'number'] },
  'padStart': { args: [2, 3], types: ['string', 'number', 'string'] },
  'padEnd': { args: [2, 3], types: ['string', 'number', 'string'] },
  'substring': { args: [2, 3], types: ['string', 'number', 'number'] },
  
  // Array helpers
  'first': { args: [1, 2], types: ['array', 'number'] },
  'last': { args: [1, 2], types: ['array', 'number'] },
  'take': { args: 2, types: ['array', 'number'] },
  'slice': { args: [2, 3], types: ['array', 'number', 'number'] },
  'join': { args: [1, 2], types: ['array', 'string'] },
  
  // Asset helpers
  'hasAsset': { args: 2, types: ['string', 'array'] },
  'getAsset': { args: 2, types: ['string', 'array'] },
  'resolveAsset': { args: 2, types: ['string', 'array'] },
  'showImage': { args: [2, 4], types: ['string', 'array', 'string', 'string'] },
  'playAudio': { args: [2, 4], types: ['string', 'array', 'boolean', 'boolean'] }
}

/**
 * Block helpers that use different syntax
 */
const BLOCK_HELPERS = new Set([
  'if', 'unless', 'each', 'with', 'hasFlag', 'hasVar', 'playerChose',
  'eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'and', 'or', 'not', 'contains',
  'isEmpty', 'compare', 'between', 'randomBool', 'toggleFlag', 'statCheck',
  'startsWith', 'endsWith', 'includes', 'hasAsset', 'validateAsset',
  'hasSave', 'component'
])

/**
 * Validate handlebars expressions throughout the content
 */
export function validateHandlebars(content, reporter) {
  const lines = content.split('\n')
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1
    const expressions = line.match(/\{\{[^}]*\}\}/g) || []
    
    expressions.forEach(expression => {
      const column = line.indexOf(expression) + 1
      validateHandlebarsExpression(expression, lineNumber, column, reporter)
    })
  })
}

/**
 * Validate individual handlebars expression
 */
function validateHandlebarsExpression(expression, line, column, reporter) {
  // Remove braces and trim
  const content = expression.slice(2, -2).trim()
  
  if (content === '') {
    reporter.addHandlebarsError(line, column, 'HANDLEBARS_EMPTY', 
      'Empty handlebars expression', expression)
    return
  }

  // Check for basic syntax errors
  if (content.includes('{{') || content.includes('}}')) {
    reporter.addHandlebarsError(line, column, 'HANDLEBARS_NESTED_BRACES', 
      'Nested handlebars braces are not allowed', expression)
    return
  }

  // Parse the expression
  const parsed = parseHandlebarsExpression(content)
  
  if (parsed.error) {
    reporter.addHandlebarsError(line, column, 'HANDLEBARS_PARSE_ERROR', 
      parsed.error, expression)
    return
  }

  // Validate the parsed expression
  validateParsedExpression(parsed, expression, line, column, reporter)
}

/**
 * Parse handlebars expression into components
 */
function parseHandlebarsExpression(content) {
  try {
    // Handle block helpers ({{#helper}}, {{/helper}})
    const blockStartMatch = content.match(/^#(\w+)(\s+.*)?$/)
    if (blockStartMatch) {
      const helperName = blockStartMatch[1]
      const args = blockStartMatch[2] ? parseArguments(blockStartMatch[2].trim()) : []
      return {
        type: 'block_start',
        helper: helperName,
        args: args
      }
    }

    const blockEndMatch = content.match(/^\/(\w+)$/)
    if (blockEndMatch) {
      return {
        type: 'block_end',
        helper: blockEndMatch[1]
      }
    }

    // Handle regular helpers and variables
    const parts = content.split(/\s+/)
    const helperName = parts[0]
    const args = parts.slice(1)

    // Check if it's a variable reference
    if (parts.length === 1 && isVariableReference(helperName)) {
      return {
        type: 'variable',
        name: helperName
      }
    }

    // It's a helper call
    return {
      type: 'helper',
      helper: helperName,
      args: parseArguments(args.join(' '))
    }
  } catch (error) {
    return {
      error: `Parse error: ${error.message}`
    }
  }
}

/**
 * Parse arguments from string
 */
function parseArguments(argsString) {
  if (!argsString.trim()) return []
  
  const args = []
  let current = ''
  let inString = false
  let stringChar = null
  let depth = 0
  
  for (let i = 0; i < argsString.length; i++) {
    const char = argsString[i]
    
    if (!inString) {
      if (char === '"' || char === "'") {
        inString = true
        stringChar = char
        current += char
      } else if (char === '(' || char === '[') {
        depth++
        current += char
      } else if (char === ')' || char === ']') {
        depth--
        current += char
      } else if (char === ' ' && depth === 0) {
        if (current.trim()) {
          args.push(current.trim())
          current = ''
        }
      } else {
        current += char
      }
    } else {
      current += char
      if (char === stringChar && argsString[i - 1] !== '\\') {
        inString = false
        stringChar = null
      }
    }
  }
  
  if (current.trim()) {
    args.push(current.trim())
  }
  
  return args
}

/**
 * Check if a name is a variable reference
 */
function isVariableReference(name) {
  return /^[a-zA-Z_][a-zA-Z0-9_.]*$/.test(name) && !ALL_VALID_HELPERS.includes(name)
}

/**
 * Validate parsed expression - Updated to be less strict
 */
function validateParsedExpression(parsed, expression, line, column, reporter) {
  switch (parsed.type) {
    case 'variable':
      validateVariableReference(parsed, expression, line, column, reporter)
      break
    case 'helper':
      validateHelperCall(parsed, expression, line, column, reporter)
      break
    case 'block_start':
      validateBlockHelper(parsed, expression, line, column, reporter)
      break
    case 'block_end':
      // Block end validation is minimal
      if (!ALL_VALID_HELPERS.includes(parsed.helper) && !isLikelyCustomHelper(parsed.helper)) {
        reporter.addHandlebarsWarning(line, column, 'HANDLEBARS_UNKNOWN_HELPER', 
          `Unknown helper in block end: ${parsed.helper}`, expression)
      }
      break
  }
}

/**
 * Check if a helper name looks like it could be a valid custom helper
 */
function isLikelyCustomHelper(helperName) {
  // Allow helpers that follow common naming patterns
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(helperName) || 
         COMMONLY_CUSTOM_HELPERS.some(pattern => helperName.includes(pattern))
}

/**
 * Validate variable reference
 */
function validateVariableReference(parsed, expression, line, column, reporter) {
  const name = parsed.name
  
  // Check for valid variable name format
  if (!isValidVariableName(name)) {
    reporter.addHandlebarsError(line, column, 'HANDLEBARS_INVALID_VARIABLE', 
      `Invalid variable name: ${name}`, expression)
  }
  
  // Check for common typos - only warn, don't error
  const suggestions = getVariableSuggestions(name)
  if (suggestions.length > 0) {
    reporter.addInfo(line, column, 'HANDLEBARS_VARIABLE_SUGGESTION', 
      `Did you mean: ${suggestions.join(', ')}?`, { suggestions })
  }
}

/**
 * Validate helper call - Updated to be less strict
 */
function validateHelperCall(parsed, expression, line, column, reporter) {
  const helperName = parsed.helper
  const args = parsed.args
  
  // Check if helper exists in our known list
  if (!ALL_VALID_HELPERS.includes(helperName)) {
    // Check if it looks like a valid custom helper
    if (isLikelyCustomHelper(helperName)) {
      // Just add an info message for potentially custom helpers
      reporter.addInfo(line, column, 'HANDLEBARS_CUSTOM_HELPER', 
        `Custom helper detected: ${helperName}`, expression)
    } else {
      // Only warn for unknown helpers that don't look like valid custom helpers
      reporter.addHandlebarsWarning(line, column, 'HANDLEBARS_UNKNOWN_HELPER', 
        `Unknown helper: ${helperName}`, expression)
      
      // Suggest similar helpers
      const suggestions = getHelperSuggestions(helperName)
      if (suggestions.length > 0) {
        reporter.addInfo(line, column, 'HANDLEBARS_HELPER_SUGGESTION', 
          `Did you mean: ${suggestions.join(', ')}?`, { suggestions })
      }
    }
    return
  }
  
  // Validate arguments only for known helpers
  validateHelperArguments(helperName, args, expression, line, column, reporter)
}

/**
 * Validate block helper
 */
function validateBlockHelper(parsed, expression, line, column, reporter) {
  const helperName = parsed.helper
  const args = parsed.args
  
  // Check if helper exists
  if (!ALL_VALID_HELPERS.includes(helperName) && !isLikelyCustomHelper(helperName)) {
    reporter.addHandlebarsWarning(line, column, 'HANDLEBARS_UNKNOWN_HELPER', 
      `Unknown block helper: ${helperName}`, expression)
    return
  }
  
  // Check if helper can be used as block helper
  if (ALL_VALID_HELPERS.includes(helperName) && !BLOCK_HELPERS.has(helperName)) {
    reporter.addHandlebarsWarning(line, column, 'HANDLEBARS_INVALID_BLOCK_HELPER', 
      `Helper ${helperName} is not typically used as a block helper`, expression)
    return
  }
  
  // Validate arguments only for known helpers
  if (ALL_VALID_HELPERS.includes(helperName)) {
    validateHelperArguments(helperName, args, expression, line, column, reporter)
  }
}

/**
 * Validate helper arguments - Only for known helpers
 */
function validateHelperArguments(helperName, args, expression, line, column, reporter) {
  const signature = HELPER_SIGNATURES[helperName]
  
  if (!signature) {
    // No specific signature defined, skip validation
    return
  }
  
  // Check argument count
  const expectedArgs = signature.args
  const actualArgCount = args.length
  
  if (typeof expectedArgs === 'number') {
    if (actualArgCount !== expectedArgs) {
      reporter.addHandlebarsWarning(line, column, 'HANDLEBARS_WRONG_ARG_COUNT', 
        `Helper ${helperName} typically expects ${expectedArgs} arguments, got ${actualArgCount}`, expression)
    }
  } else if (Array.isArray(expectedArgs)) {
    if (!expectedArgs.includes(actualArgCount)) {
      reporter.addHandlebarsWarning(line, column, 'HANDLEBARS_WRONG_ARG_COUNT', 
        `Helper ${helperName} typically expects ${expectedArgs.join(' or ')} arguments, got ${actualArgCount}`, expression)
    }
  } else if (expectedArgs === '2+') {
    if (actualArgCount < 2) {
      reporter.addHandlebarsWarning(line, column, 'HANDLEBARS_WRONG_ARG_COUNT', 
        `Helper ${helperName} typically expects at least 2 arguments, got ${actualArgCount}`, expression)
    }
  }
  
  // Validate argument types (basic validation) - only warn, don't error
  if (signature.types && args.length > 0) {
    validateArgumentTypes(helperName, args, signature.types, expression, line, column, reporter)
  }
}

/**
 * Validate argument types - Updated to only warn
 */
function validateArgumentTypes(helperName, args, expectedTypes, expression, line, column, reporter) {
  args.forEach((arg, index) => {
    if (index < expectedTypes.length) {
      const expectedType = expectedTypes[index]
      const actualType = inferArgumentType(arg)
      
      if (expectedType !== 'any' && actualType !== expectedType && actualType !== 'unknown') {
        reporter.addInfo(line, column, 'HANDLEBARS_TYPE_MISMATCH', 
          `Helper ${helperName} argument ${index + 1} typically expects ${expectedType}, got ${actualType}`, 
          { helperName, argumentIndex: index, expectedType, actualType })
      }
    }
  })
}

/**
 * Infer argument type from string representation
 */
function inferArgumentType(arg) {
  if (arg.startsWith('"') && arg.endsWith('"')) return 'string'
  if (arg.startsWith("'") && arg.endsWith("'")) return 'string'
  if (/^-?\d+$/.test(arg)) return 'number'
  if (/^-?\d*\.\d+$/.test(arg)) return 'number'
  if (arg === 'true' || arg === 'false') return 'boolean'
  if (arg === 'null') return 'null'
  if (arg === 'undefined') return 'undefined'
  if (arg.startsWith('[') && arg.endsWith(']')) return 'array'
  if (arg.startsWith('{') && arg.endsWith('}')) return 'object'
  return 'unknown'
}

/**
 * Check if variable name is valid
 */
function isValidVariableName(name) {
  return /^[a-zA-Z_][a-zA-Z0-9_.]*$/.test(name)
}

/**
 * Get helper suggestions for typos
 */
function getHelperSuggestions(helperName) {
  const suggestions = []
  const lowerHelper = helperName.toLowerCase()
  
  ALL_VALID_HELPERS.forEach(validHelper => {
    if (levenshteinDistance(lowerHelper, validHelper.toLowerCase()) <= 2) {
      suggestions.push(validHelper)
    }
  })
  
  return suggestions.slice(0, 3) // Limit to 3 suggestions
}

/**
 * Get variable suggestions
 */
function getVariableSuggestions(variableName) {
  const commonVariables = [
    'player', 'gameTime', 'currentScene', 'score', 'health', 'inventory',
    'flags', 'variables', 'choiceHistory', 'storyFlags', 'keeper_name', 
    'current_time_period', 'session_start_time', 'saveSlot', 'currentSave',
    'playerInput', 'userChoice', 'selectedOption'
  ]
  
  const suggestions = []
  const lowerVar = variableName.toLowerCase()
  
  commonVariables.forEach(commonVar => {
    if (levenshteinDistance(lowerVar, commonVar.toLowerCase()) <= 2) {
      suggestions.push(commonVar)
    }
  })
  
  return suggestions.slice(0, 3)
}

/**
 * Calculate Levenshtein distance for suggestions
 */
function levenshteinDistance(str1, str2) {
  const matrix = []
  
  if (str1.length === 0) return str2.length
  if (str2.length === 0) return str1.length
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  
  return matrix[str2.length][str1.length]
}

/**
 * Get helper category
 */
export function getHelperCategory(helperName) {
  for (const [category, helpers] of Object.entries(VALID_HELPERS)) {
    if (helpers.includes(helperName)) {
      return category
    }
  }
  return null
}

/**
 * Get all valid helpers
 */
export function getAllValidHelpers() {
  return ALL_VALID_HELPERS
}

/**
 * Get helpers by category
 */
export function getHelpersByCategory(category) {
  return VALID_HELPERS[category] || []
}