const VALID_ACTION_TYPES = [
  'setVar', 'addVar', 'setFlag', 'clearFlag', 'addToList', 'addTime', 'helper'
]

export function validateScenes(scenes, reporter) {
  if (!scenes || typeof scenes !== 'object') {
    reporter.addError(1, 1, 'SCENES_INVALID_TYPE', 'scenes must be an object')
    return
  }

  const sceneNames = Object.keys(scenes)
  
  if (sceneNames.length === 0) {
    reporter.addWarning(1, 1, 'SCENES_EMPTY', 'No scenes defined')
    return
  }

  // Store scene names for cross-reference validation
  const allSceneNames = new Set(sceneNames)

  sceneNames.forEach(sceneName => {
    validateScene(sceneName, scenes[sceneName], reporter, allSceneNames)
  })
}

function validateScene(sceneName, sceneData, reporter, allSceneNames) {
  if (!isValidSceneName(sceneName)) {
    reporter.addError(1, 1, 'SCENE_INVALID_NAME', 
      `Scene name "${sceneName}" is invalid. Use letters, numbers, underscores, and hyphens only`)
  }

  if (!Array.isArray(sceneData)) {
    reporter.addSceneError(sceneName, undefined, 'SCENE_INVALID_STRUCTURE', 
      'Scene must be an array of instructions')
    return
  }

  if (sceneData.length === 0) {
    reporter.addSceneError(sceneName, undefined, 'SCENE_EMPTY', 
      'Scene contains no instructions')
    return
  }

  sceneData.forEach((instruction, index) => {
    validateInstruction(sceneName, instruction, index, reporter, allSceneNames)
  })
}

function validateInstruction(sceneName, instruction, index, reporter, allSceneNames) {
  if (typeof instruction === 'string') {
    validateStringInstruction(sceneName, instruction, index, reporter)
  } else if (typeof instruction === 'object' && instruction !== null) {
    validateObjectInstruction(sceneName, instruction, index, reporter, allSceneNames)
  } else {
    reporter.addSceneError(sceneName, index, 'INSTRUCTION_INVALID_TYPE', 
      'Instruction must be a string or object')
  }
}

function validateStringInstruction(sceneName, instruction, index, reporter) {
  if (typeof instruction !== 'string') {
    reporter.addSceneError(sceneName, index, 'INSTRUCTION_INVALID_TYPE', 
      'String instruction must be a string')
    return
  }

  if (instruction.trim() === '') {
    reporter.addSceneError(sceneName, index, 'INSTRUCTION_EMPTY_STRING', 
      'String instruction cannot be empty')
    return
  }

  // Improved handlebars validation for multiline strings
  validateHandlebarsInString(sceneName, instruction, index, reporter)
}

function validateObjectInstruction(sceneName, instruction, index, reporter, allSceneNames) {
  const instructionType = determineInstructionType(instruction)
  
  switch (instructionType) {
    case 'dialogue':
      validateDialogueInstruction(sceneName, instruction, index, reporter, allSceneNames)
      break
    case 'action':
      validateActionInstruction(sceneName, instruction, index, reporter)
      break
    case 'conditional':
      validateConditionalInstruction(sceneName, instruction, index, reporter, allSceneNames)
      break
    case 'jump':
      validateJumpInstruction(sceneName, instruction, index, reporter, allSceneNames)
      break
    default:
      reporter.addSceneError(sceneName, index, 'INSTRUCTION_UNKNOWN_TYPE', 
        'Unable to determine instruction type')
  }
}

function determineInstructionType(instruction) {
  if (instruction.action || instruction.actions) return 'action'
  if (instruction.if || instruction.condition) return 'conditional'
  if (instruction.goto || instruction.jump) return 'jump'
  if (instruction.say || instruction.text || instruction.speaker || 
      instruction.choices || instruction.choice) return 'dialogue'
  return 'unknown'
}

function validateDialogueInstruction(sceneName, instruction, index, reporter, allSceneNames) {
  if (instruction.speaker !== undefined) {
    if (typeof instruction.speaker !== 'string') {
      reporter.addSceneError(sceneName, index, 'DIALOGUE_INVALID_SPEAKER', 
        'speaker must be a string')
    } else if (instruction.speaker.trim() === '') {
      reporter.addSceneError(sceneName, index, 'DIALOGUE_EMPTY_SPEAKER', 
        'speaker cannot be empty')
    }
  }

  const text = instruction.text || instruction.say
  if (text !== undefined) {
    if (typeof text !== 'string') {
      reporter.addSceneError(sceneName, index, 'DIALOGUE_INVALID_TEXT', 
        'text/say must be a string')
    } else if (text.trim() === '') {
      reporter.addSceneError(sceneName, index, 'DIALOGUE_EMPTY_TEXT', 
        'text/say cannot be empty')
    } else {
      validateHandlebarsInString(sceneName, text, index, reporter)
    }
  }

  const choices = instruction.choices || instruction.choice
  if (choices !== undefined) {
    validateChoices(sceneName, choices, index, reporter, allSceneNames)
  }

  if (instruction.actions !== undefined) {
    validateActions(sceneName, instruction.actions, index, reporter)
  }
}

function validateChoices(sceneName, choices, instructionIndex, reporter, allSceneNames) {
  if (!Array.isArray(choices)) {
    reporter.addSceneError(sceneName, instructionIndex, 'CHOICES_INVALID_TYPE', 
      'choices must be an array')
    return
  }

  if (choices.length === 0) {
    reporter.addSceneError(sceneName, instructionIndex, 'CHOICES_EMPTY', 
      'choices array cannot be empty')
    return
  }

  choices.forEach((choice, choiceIndex) => {
    validateChoice(sceneName, choice, instructionIndex, choiceIndex, reporter, allSceneNames)
  })
}

function validateChoice(sceneName, choice, instructionIndex, choiceIndex, reporter, allSceneNames) {
  if (typeof choice !== 'object' || choice === null) {
    reporter.addChoiceError(sceneName, instructionIndex, choiceIndex, 
      'CHOICE_INVALID_TYPE', 'choice must be an object')
    return
  }

  if (!choice.text) {
    reporter.addChoiceError(sceneName, instructionIndex, choiceIndex, 
      'CHOICE_MISSING_TEXT', 'choice must have a "text" property')
  } else if (typeof choice.text !== 'string') {
    reporter.addChoiceError(sceneName, instructionIndex, choiceIndex, 
      'CHOICE_INVALID_TEXT', 'choice text must be a string')
  } else if (choice.text.trim() === '') {
    reporter.addChoiceError(sceneName, instructionIndex, choiceIndex, 
      'CHOICE_EMPTY_TEXT', 'choice text cannot be empty')
  }

  if (choice.condition !== undefined) {
    if (typeof choice.condition !== 'string') {
      reporter.addChoiceError(sceneName, instructionIndex, choiceIndex, 
        'CHOICE_INVALID_CONDITION', 'choice condition must be a string')
    } else {
      validateHandlebarsInString(sceneName, choice.condition, instructionIndex, reporter)
    }
  }

  if (choice.goto !== undefined) {
    if (typeof choice.goto !== 'string') {
      reporter.addChoiceError(sceneName, instructionIndex, choiceIndex, 
        'CHOICE_INVALID_GOTO', 'choice goto must be a string')
    } else if (choice.goto.trim() === '') {
      reporter.addChoiceError(sceneName, instructionIndex, choiceIndex, 
        'CHOICE_EMPTY_GOTO', 'choice goto cannot be empty')
    }
  }

  if (choice.actions !== undefined) {
    validateActions(sceneName, choice.actions, instructionIndex, reporter)
  }
}

function validateActionInstruction(sceneName, instruction, index, reporter) {
  const actions = instruction.actions || [instruction.action]
  
  if (!Array.isArray(actions)) {
    reporter.addSceneError(sceneName, index, 'ACTION_INVALID_TYPE', 
      'actions must be an array')
    return
  }

  if (actions.length === 0) {
    reporter.addSceneError(sceneName, index, 'ACTION_EMPTY', 
      'actions array cannot be empty')
    return
  }

  validateActions(sceneName, actions, index, reporter)
}

function validateActions(sceneName, actions, instructionIndex, reporter) {
  if (!Array.isArray(actions)) {
    reporter.addSceneError(sceneName, instructionIndex, 'ACTIONS_INVALID_TYPE', 
      'actions must be an array')
    return
  }

  actions.forEach((action, actionIndex) => {
    validateAction(sceneName, action, instructionIndex, actionIndex, reporter)
  })
}

function validateAction(sceneName, action, instructionIndex, actionIndex, reporter) {
  if (typeof action !== 'object' || action === null) {
    reporter.addActionError(sceneName, instructionIndex, actionIndex, 
      'ACTION_INVALID_TYPE', 'action must be an object')
    return
  }

  if (!action.type) {
    reporter.addActionError(sceneName, instructionIndex, actionIndex, 
      'ACTION_MISSING_TYPE', 'action must have a "type" property')
    return
  }

  if (!VALID_ACTION_TYPES.includes(action.type)) {
    reporter.addActionError(sceneName, instructionIndex, actionIndex, 
      'ACTION_INVALID_TYPE_VALUE', 
      `Invalid action type: "${action.type}". Valid types: ${VALID_ACTION_TYPES.join(', ')}`)
    return
  }

  validateActionProperties(sceneName, action, instructionIndex, actionIndex, reporter)
}

function validateActionProperties(sceneName, action, instructionIndex, actionIndex, reporter) {
  switch (action.type) {
    case 'setVar':
    case 'addVar':
      if (!action.key) {
        reporter.addActionError(sceneName, instructionIndex, actionIndex, 
          'ACTION_MISSING_KEY', `${action.type} action must have a "key" property`)
      }
      if (action.value === undefined) {
        reporter.addActionError(sceneName, instructionIndex, actionIndex, 
          'ACTION_MISSING_VALUE', `${action.type} action must have a "value" property`)
      }
      break
    case 'setFlag':
    case 'clearFlag':
      if (!action.flag) {
        reporter.addActionError(sceneName, instructionIndex, actionIndex, 
          'ACTION_MISSING_FLAG', `${action.type} action must have a "flag" property`)
      }
      break
    case 'addToList':
      if (!action.list) {
        reporter.addActionError(sceneName, instructionIndex, actionIndex, 
          'ACTION_MISSING_LIST', 'addToList action must have a "list" property')
      }
      if (action.item === undefined) {
        reporter.addActionError(sceneName, instructionIndex, actionIndex, 
          'ACTION_MISSING_ITEM', 'addToList action must have an "item" property')
      }
      break
    case 'addTime':
      if (action.minutes === undefined) {
        reporter.addActionError(sceneName, instructionIndex, actionIndex, 
          'ACTION_MISSING_MINUTES', 'addTime action must have a "minutes" property')
      }
      break
    case 'helper':
      if (!action.helper) {
        reporter.addActionError(sceneName, instructionIndex, actionIndex, 
          'ACTION_MISSING_HELPER', 'helper action must have a "helper" property')
      }
      break
  }
}

function validateConditionalInstruction(sceneName, instruction, index, reporter, allSceneNames) {
  const condition = instruction.condition || instruction.if
  
  if (!condition) {
    reporter.addSceneError(sceneName, index, 'CONDITIONAL_MISSING_CONDITION', 
      'Conditional instruction must have a "condition" or "if" property')
  } else if (typeof condition !== 'string') {
    reporter.addSceneError(sceneName, index, 'CONDITIONAL_INVALID_CONDITION', 
      'Conditional condition must be a string')
  } else {
    validateHandlebarsInString(sceneName, condition, index, reporter)
  }

  if (instruction.then !== undefined) {
    validateConditionalBranch(sceneName, instruction.then, index, reporter, allSceneNames)
  }

  if (instruction.else !== undefined) {
    validateConditionalBranch(sceneName, instruction.else, index, reporter, allSceneNames)
  }
}

function validateConditionalBranch(sceneName, branch, instructionIndex, reporter, allSceneNames) {
  if (Array.isArray(branch)) {
    branch.forEach((subInstruction, subIndex) => {
      validateInstruction(sceneName, subInstruction, `${instructionIndex}.${subIndex}`, reporter, allSceneNames)
    })
  } else {
    validateInstruction(sceneName, branch, `${instructionIndex}`, reporter, allSceneNames)
  }
}

function validateJumpInstruction(sceneName, instruction, index, reporter, allSceneNames) {
  const target = instruction.goto || instruction.jump
  
  if (!target) {
    reporter.addSceneError(sceneName, index, 'JUMP_MISSING_TARGET', 
      'Jump instruction must have a "goto" or "jump" property')
  } else if (typeof target !== 'string') {
    reporter.addSceneError(sceneName, index, 'JUMP_INVALID_TARGET', 
      'Jump target must be a string')
  } else if (target.trim() === '') {
    reporter.addSceneError(sceneName, index, 'JUMP_EMPTY_TARGET', 
      'Jump target cannot be empty')
  } else {
    // Cross-reference validation - check if target scene exists
    const targetScene = target.trim()
    if (!allSceneNames.has(targetScene)) {
      reporter.addSceneError(sceneName, index, 'JUMP_INVALID_SCENE_REFERENCE', 
        `Referenced scene "${targetScene}" does not exist`)
    }
  }
}

function validateHandlebarsInString(sceneName, str, instructionIndex, reporter) {
  if (!str.includes('{{') || !str.includes('}}')) {
    return
  }

  // Count braces more carefully, handling multiline strings
  const lines = str.split('\n')
  let totalOpenBraces = 0
  let totalCloseBraces = 0
  
  lines.forEach((line, lineIndex) => {
    const openBraces = (line.match(/\{\{/g) || []).length
    const closeBraces = (line.match(/\}\}/g) || []).length
    totalOpenBraces += openBraces
    totalCloseBraces += closeBraces
    
    // Check for unmatched braces on individual lines (for better error reporting)
    if (openBraces !== closeBraces && (openBraces > 0 || closeBraces > 0)) {
      // Only report if the line has incomplete expressions
      const lineExpressions = line.match(/\{\{[^}]*\}\}/g) || []
      const incompleteOpen = (line.match(/\{\{[^}]*$/g) || []).length
      const incompleteClose = (line.match(/^[^{]*\}\}/g) || []).length
      
      if (incompleteOpen > 0 || incompleteClose > 0) {
        reporter.addSceneError(sceneName, instructionIndex, 'HANDLEBARS_UNMATCHED_BRACES', 
          `Unmatched handlebars braces in line ${lineIndex + 1}`)
      }
    }
  })
  
  // Check overall balance for multiline expressions
  if (totalOpenBraces !== totalCloseBraces) {
    reporter.addSceneError(sceneName, instructionIndex, 'HANDLEBARS_UNMATCHED_BRACES', 
      'Unmatched handlebars braces in multiline string')
  }

  // Extract and validate complete expressions
  const expressions = str.match(/\{\{[^}]*\}\}/g) || []
  expressions.forEach(expr => {
    const content = expr.slice(2, -2).trim()
    
    if (content === '') {
      reporter.addSceneError(sceneName, instructionIndex, 'HANDLEBARS_EMPTY_EXPRESSION', 
        'Empty handlebars expression')
    }
    
    // Check for nested braces within expressions
    if (content.includes('{{') || content.includes('}}')) {
      reporter.addSceneError(sceneName, instructionIndex, 'HANDLEBARS_NESTED_BRACES', 
        'Nested handlebars braces are not allowed')
    }
  })
}

function isValidSceneName(name) {
  return /^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(name)
}