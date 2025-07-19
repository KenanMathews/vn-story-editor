// validation/index.js - Quick fix for the issues shown in screenshots

import * as yaml from 'js-yaml'
import { validateScenes } from './sceneValidator'
import { validateVariables } from './variableValidator' 
import { validateAssets } from './assetValidator'
import { ErrorReporter } from './errorReporter'

export const validateStoryFormat = (content) => {
  const reporter = new ErrorReporter()
  
  // Validate YAML syntax
  let parsed
  try {
    parsed = yaml.load(content)
  } catch (yamlError) {
    reporter.addYAMLError(yamlError)
    return reporter.getResult()
  }
  
  // Validate document structure
  if (!parsed || typeof parsed !== 'object') {
    reporter.addError(1, 1, 'INVALID_DOCUMENT', 'Document must be a valid YAML object')
    return reporter.getResult()
  }
  
  // Validate top-level structure
  validateTopLevel(parsed, reporter)
  
  // Validate sections with better handling
  if (parsed.scenes) {
    validateScenesImproved(parsed.scenes, reporter)
  }
  
  if (parsed.variables) {
    validateVariables(parsed.variables, reporter)
  }
  
  if (parsed.assets) {
    validateAssets(parsed.assets, reporter)
  }
  
  // Improved handlebars validation
  validateHandlebarsImproved(content, reporter)
  
  return reporter.getResult()
}

function validateTopLevel(parsed, reporter) {
  const validTopLevelKeys = [
    'title', 'description', 'scenes', 'variables', 'assets', 'styles'
  ]
  
  if (!parsed.scenes) {
    reporter.addError(1, 1, 'MISSING_SCENES', 'Required section "scenes" is missing')
  }
  
  Object.keys(parsed).forEach(key => {
    if (!validTopLevelKeys.includes(key)) {
      reporter.addWarning(1, 1, 'UNKNOWN_TOP_LEVEL_KEY', `Unknown top-level key: "${key}"`)
    }
  })
}

function validateScenesImproved(scenes, reporter) {
  if (!scenes || typeof scenes !== 'object') {
    reporter.addError(1, 1, 'SCENES_INVALID_TYPE', 'scenes must be an object')
    return
  }

  const sceneNames = Object.keys(scenes)
  
  if (sceneNames.length === 0) {
    reporter.addWarning(1, 1, 'SCENES_EMPTY', 'No scenes defined')
    return
  }

  // Validate each scene
  sceneNames.forEach(sceneName => {
    const sceneData = scenes[sceneName]
    
    if (!Array.isArray(sceneData)) {
      reporter.addError(1, 1, 'SCENE_INVALID_STRUCTURE', 
        `Scene "${sceneName}" must be an array of instructions`)
      return
    }

    sceneData.forEach((instruction, index) => {
      validateInstructionImproved(sceneName, instruction, index, reporter)
    })
  })
}

function validateInstructionImproved(sceneName, instruction, index, reporter) {
  if (typeof instruction === 'string') {
    // String instructions are valid - just check they're not empty
    if (instruction.trim() === '') {
      reporter.addWarning(1, 1, 'INSTRUCTION_EMPTY_STRING', 
        `Empty string instruction in scene "${sceneName}" at position ${index + 1}`)
    }
    return
  }
  
  if (typeof instruction !== 'object' || instruction === null) {
    reporter.addError(1, 1, 'INSTRUCTION_INVALID_TYPE', 
      `Instruction in scene "${sceneName}" at position ${index + 1} must be a string or object`)
    return
  }
}

function validateHandlebarsImproved(content, reporter) {
  // More lenient handlebars validation
  const expressions = content.match(/\{\{[^}]*\}\}/g) || []
  
  expressions.forEach(expression => {
    const innerContent = expression.slice(2, -2).trim()
    
    if (innerContent === '') {
      reporter.addWarning(1, 1, 'HANDLEBARS_EMPTY', 
        'Empty handlebars expression found')
      return
    }

    // Check for nested braces (actual syntax error)
    if (innerContent.includes('{{') || innerContent.includes('}}')) {
      reporter.addError(1, 1, 'HANDLEBARS_NESTED_BRACES', 
        'Nested handlebars braces are not allowed')
      return
    }
  })
}

export const validateYAMLSyntax = (content) => {
  const reporter = new ErrorReporter()
  
  try {
    yaml.load(content)
    return { valid: true, errors: [] }
  } catch (yamlError) {
    reporter.addYAMLError(yamlError)
    return reporter.getResult()
  }
}

export const getStoryStatistics = (content) => {
  const lines = content.split('\n')
  const stats = {
    totalLines: lines.length,
    codeLines: lines.filter(line => line.trim() && !line.trim().startsWith('#')).length,
    commentLines: lines.filter(line => line.trim().startsWith('#')).length,
    scenes: 0,
    instructions: 0,
    choices: 0,
    handlebarsExpressions: 0
  }
  
  try {
    const parsed = yaml.load(content)
    
    if (parsed && parsed.scenes && typeof parsed.scenes === 'object') {
      stats.scenes = Object.keys(parsed.scenes).length
      
      Object.values(parsed.scenes).forEach(sceneData => {
        if (Array.isArray(sceneData)) {
          stats.instructions += sceneData.length
          sceneData.forEach(instruction => {
            if (typeof instruction === 'object' && instruction.choices) {
              stats.choices += Array.isArray(instruction.choices) ? instruction.choices.length : 0
            }
          })
        }
      })
    }
    
    // Count handlebars expressions
    const handlebarsMatches = content.match(/\{\{[^}]*\}\}/g)
    if (handlebarsMatches) {
      stats.handlebarsExpressions = handlebarsMatches.length
    }
  } catch (error) {
    // Return basic stats if parsing fails
  }
  
  return stats
}

export const formatStoryContent = (content) => {
  try {
    const parsed = yaml.load(content)
    return yaml.dump(parsed, {
      indent: 2,
      lineWidth: 120,
      noRefs: true,
      sortKeys: false,
      flowLevel: -1
    })
  } catch (error) {
    return content
  }
}

export { ErrorReporter } from './errorReporter'