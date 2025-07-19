export const setupStoryLanguage = (monaco) => {
  // Register the story format language
  monaco.languages.register({ id: 'story-format' })

  // Define the language tokens with proper YAML support
  monaco.languages.setMonarchTokensProvider('story-format', {
    defaultToken: '',
    tokenPostfix: '.yaml',
    
    brackets: [
      { open: '{', close: '}', token: 'delimiter.curly' },
      { open: '[', close: ']', token: 'delimiter.square' },
      { open: '(', close: ')', token: 'delimiter.parenthesis' }
    ],
    
    keywords: [
      'true', 'false', 'null', 'True', 'False', 'Null', 'NULL',
      'title', 'description', 'scenes', 'variables', 'assets', 'styles'
    ],
    
    storyKeywords: [
      'text', 'choices', 'goto', 'jump', 'speaker', 'say', 'condition',
      'if', 'then', 'else', 'action', 'actions', 'type', 'key', 'value',
      'flag', 'list', 'item', 'minutes', 'helper', 'args', 'result'
    ],
    
    actionTypes: [
      'setVar', 'addVar', 'setFlag', 'clearFlag', 'addToList', 'addTime', 'helper'
    ],
    
    vnHelpers: [
      'hasFlag', 'addFlag', 'removeFlag', 'toggleFlag', 'getVar', 'setVar',
      'hasVar', 'incrementVar', 'playerChose', 'getLastChoice', 'choiceCount',
      'formatTime', 'randomBool', 'debug', 'input', 'currentTime', 'currentDate',
      'saveGame', 'loadGame', 'quickSave', 'quickLoad', 'hasSave',
      'textInput', 'selectInput', 'checkboxInput', 'numberInput', 'component'
    ],
    
    comparisonHelpers: [
      'eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'and', 'or', 'not',
      'contains', 'isEmpty', 'compare', 'between', 'ifx', 'ternary'
    ],
    
    mathHelpers: [
      'add', 'subtract', 'multiply', 'divide', 'mod', 'abs', 'min', 'max',
      'round', 'ceil', 'floor', 'random', 'randomInt', 'clamp', 'sum',
      'average', 'percentage', 'rollDice', 'lerp'
    ],
    
    stringHelpers: [
      'uppercase', 'lowercase', 'capitalize', 'titleCase', 'trim',
      'truncate', 'replace', 'repeat', 'padStart', 'padEnd', 'center',
      'substring', 'words', 'wordCount', 'slugify', 'stripTags'
    ],
    
    arrayHelpers: [
      'first', 'last', 'length', 'size', 'includes', 'where', 'pluck',
      'join', 'groupBy', 'chunk', 'unique', 'shuffle', 'slice', 'take',
      'sample', 'flatten', 'reverse', 'compact', 'without'
    ],
    
    assetHelpers: [
      'hasAsset', 'getAsset', 'resolveAsset', 'showImage', 'playAudio',
      'playVideo', 'getAssetInfo', 'getMediaType'
    ],
    
    tokenizer: {
      root: [
        // Comments
        [/#.*$/, 'comment'],
        
        // Document separators
        [/^---\s*$/, 'operators'],
        [/^\.\.\./, 'operators'],
        
        // Handlebars expressions with proper nesting
        [/\{\{/, { token: 'delimiter.handlebars', bracket: '@open', next: '@handlebars' }],
        
        // YAML keys (allowing hyphens and underscores)
        [/^(\s*)([\w_-]+)(\s*)(:)(\s*)/, ['white', 'key', 'white', 'operators', 'white']],
        
        // Scene names (can contain hyphens and underscores)
        [/^(\s*)([\w_-]+)(:)$/, ['white', 'type.scene-name', 'operators']],
        
        // Multiline string indicators
        [/(\||\>)(\+|\-)?(\s*)$/, 'operators'],
        
        // String values - quoted
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/'([^'\\]|\\.)*$/, 'string.invalid'],
        [/"/, 'string', '@doubleQuotedString'],
        [/'/, 'string', '@singleQuotedString'],
        
        // Unquoted string values (YAML allows these)
        [/(\s+)([a-zA-Z_][\w_-]*)\s*$/, ['white', 'string']],
        [/(\s+)([a-zA-Z_][\w_-]*)\s*(?=[,\]\}])/, ['white', 'string']],
        
        // Numbers
        [/[+-]?[0-9]+(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/, 'number'],
        
        // Arrays
        [/\[/, 'delimiter.square'],
        [/\]/, 'delimiter.square'],
        
        // Objects
        [/\{/, 'delimiter.curly'],
        [/\}/, 'delimiter.curly'],
        
        // YAML specific
        [/^(\s*)(-\s+)/, ['white', 'operators']], // Array items
        [/[&*][\w-]+/, 'tag'], // References and anchors
        [/\|[-+]?/, 'operators'], // Literal scalars
        [/>[-+]?/, 'operators'], // Folded scalars
        
        // Keywords
        [/\b(?:true|false|null|True|False|Null|NULL)\b/, 'keyword'],
        
        // Story keywords
        [/\b(?:text|choices|goto|jump|speaker|say|condition|if|then|else|action|actions)\b/, 'keyword.story'],
        
        // Action types
        [/\b(?:setVar|addVar|setFlag|clearFlag|addToList|addTime|helper)\b/, 'keyword.action'],
        
        // VN helpers in context
        [/\b(?:hasFlag|addFlag|removeFlag|toggleFlag|getVar|setVar|hasVar|incrementVar|playerChose|getLastChoice|choiceCount|formatTime|randomBool|debug|input|currentTime|currentDate|saveGame|loadGame|quickSave|quickLoad|hasSave|textInput|selectInput|checkboxInput|numberInput|component)\b/, 'keyword.vn'],
        
        // Operators
        [/[:,[\]{}]/, 'delimiter'],
        [/[>|]/, 'operators'],
        
        // Any other text (don't mark as invalid)
        [/[^\s\[\]{}:,]+/, 'string'],
        
        // Whitespace
        [/\s+/, 'white'],
        
        // Achievement markers
        [/\[🏆.*?\]/, 'string.achievement'],
        
        // Emoji
        [/[🏆⭐✅📖🔒🌟💖❤️🤍🧠🤔💭✨🔮👁️]/, 'constant.emoji']
      ],
      
      handlebars: [
        [/\}\}/, { token: 'delimiter.handlebars', bracket: '@close', next: '@pop' }],
        [/\{\{/, { token: 'delimiter.handlebars', bracket: '@open', next: '@handlebars' }],
        
        // VN helpers
        [/\b(?:hasFlag|addFlag|removeFlag|toggleFlag|getVar|setVar|hasVar|incrementVar|playerChose|getLastChoice|choiceCount|formatTime|randomBool|debug|input|currentTime|currentDate|saveGame|loadGame|quickSave|quickLoad|hasSave|textInput|selectInput|checkboxInput|numberInput|component)\b/, 'keyword.vn'],
        
        // Comparison helpers
        [/\b(?:eq|ne|gt|gte|lt|lte|and|or|not|contains|isEmpty|compare|between|ifx|ternary)\b/, 'keyword.comparison'],
        
        // Math helpers
        [/\b(?:add|subtract|multiply|divide|mod|abs|min|max|round|ceil|floor|random|randomInt|clamp|sum|average|percentage|rollDice|lerp)\b/, 'keyword.math'],
        
        // String helpers
        [/\b(?:uppercase|lowercase|capitalize|titleCase|trim|truncate|replace|repeat|padStart|padEnd|center|substring|words|wordCount|slugify|stripTags)\b/, 'keyword.string'],
        
        // Array helpers
        [/\b(?:first|last|length|size|includes|where|pluck|join|groupBy|chunk|unique|shuffle|slice|take|sample|flatten|reverse|compact|without)\b/, 'keyword.array'],
        
        // Asset helpers
        [/\b(?:hasAsset|getAsset|resolveAsset|showImage|playAudio|playVideo|getAssetInfo|getMediaType)\b/, 'keyword.asset'],
        
        // Handlebars built-ins
        [/\b(?:if|unless|each|with|lookup|log|#if|#unless|#each|#with|\/if|\/unless|\/each|\/with|else)\b/, 'keyword.handlebars'],
        
        // Variable names and any other content (don't mark as invalid)
        [/[a-zA-Z_][a-zA-Z0-9_.]*/, 'variable'],
        
        // Strings within handlebars
        [/"([^"\\]|\\.)*"/, 'string'],
        [/'([^'\\]|\\.)*'/, 'string'],
        
        // Numbers
        [/[+-]?[0-9]+(?:\.[0-9]+)?/, 'number'],
        
        // Operators
        [/[()[\]{}.,;]/, 'delimiter'],
        [/\s+/, 'white'],
        
        // Any other content (don't mark as invalid)
        [/./, 'string']
      ],
      
      doubleQuotedString: [
        [/[^\\"]+/, 'string'],
        [/\\./, 'string.escape'],
        [/"/, 'string', '@pop']
      ],
      
      singleQuotedString: [
        [/[^\\']+/, 'string'],
        [/\\./, 'string.escape'],
        [/'/, 'string', '@pop']
      ]
    }
  })

  // Enhanced language configuration
  monaco.languages.setLanguageConfiguration('story-format', {
    comments: {
      lineComment: '#'
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
      ['{{', '}}']
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '{{', close: '}}' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '{{', close: '}}' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ],
    folding: {
      markers: {
        start: new RegExp('^\\s*#region\\b'),
        end: new RegExp('^\\s*#endregion\\b')
      }
    },
    indentationRules: {
      increaseIndentPattern: /^.*(:|-\s+).*$/,
      decreaseIndentPattern: /^.*\}.*$/
    }
  })

  // Define the enhanced theme
  monaco.editor.defineTheme('story-theme', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6A9955' },
      { token: 'key', foreground: '9CDCFE' },
      { token: 'type.scene-name', foreground: '4EC9B0', fontStyle: 'bold' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'string.invalid', foreground: 'F44747' },
      { token: 'string.achievement', foreground: 'FFD700', fontStyle: 'bold' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'keyword', foreground: '569CD6' },
      { token: 'keyword.story', foreground: 'C586C0' },
      { token: 'keyword.action', foreground: 'FF6B6B' },
      { token: 'keyword.vn', foreground: 'DCDCAA', fontStyle: 'bold' },
      { token: 'keyword.comparison', foreground: '4ECDC4' },
      { token: 'keyword.math', foreground: '45B7D1' },
      { token: 'keyword.string', foreground: '96CEB4' },
      { token: 'keyword.array', foreground: 'FECA57' },
      { token: 'keyword.asset', foreground: 'FF9FF3' },
      { token: 'keyword.handlebars', foreground: 'F9CA24' },
      { token: 'delimiter.handlebars', foreground: 'F9CA24', fontStyle: 'bold' },
      { token: 'variable', foreground: '9CDCFE' },
      { token: 'delimiter', foreground: 'D4D4D4' },
      { token: 'operators', foreground: 'D7BA7D' },
      { token: 'constant.emoji', foreground: 'FF6B6B' },
      { token: 'tag', foreground: '4EC9B0' },
      // Removed the 'invalid' token styling to stop red underlines
    ],
    colors: {
      'editor.background': '#1e1e1e',
      'editor.foreground': '#d4d4d4',
      'editor.lineHighlightBackground': '#2d2d30',
      'editor.selectionBackground': '#264f78',
      'editor.inactiveSelectionBackground': '#3a3d41'
    }
  })

  // Set up autocomplete suggestions with enhanced story format support
  monaco.languages.registerCompletionItemProvider('story-format', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position)
      const line = model.getLineContent(position.lineNumber)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      }

      const suggestions = []

      // Scene structure templates
      suggestions.push({
        label: 'scene-basic',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: [
          '${1:scene_name}:',
          '  - "${2:Scene description}"',
          '  - text: "${3:Choice prompt}"',
          '    choices:',
          '      - text: "${4:Option 1}"',
          '        goto: ${5:next_scene}',
          '      - text: "${6:Option 2}"',
          '        goto: ${7:other_scene}'
        ].join('\n'),
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Insert a basic scene template',
        range: range
      })

      // Dialogue instruction templates
      suggestions.push({
        label: 'dialogue-with-speaker',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: [
          '- speaker: "${1:Character Name}"',
          '  text: "${2:Dialogue text}"'
        ].join('\n'),
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Insert dialogue with speaker',
        range: range
      })

      // Action instruction templates
      suggestions.push({
        label: 'action-setvar',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: [
          '- action:',
          '    type: setVar',
          '    key: "${1:variable_name}"',
          '    value: ${2:value}'
        ].join('\n'),
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Insert setVar action',
        range: range
      })

      suggestions.push({
        label: 'action-setflag',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: [
          '- action:',
          '    type: setFlag',
          '    flag: "${1:flag_name}"'
        ].join('\n'),
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Insert setFlag action',
        range: range
      })

      // Conditional instruction template
      suggestions.push({
        label: 'conditional-if',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: [
          '- if: "{{${1:condition}}}"',
          '  then:',
          '    - "${2:Then content}"',
          '  else:',
          '    - "${3:Else content}"'
        ].join('\n'),
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Insert conditional if statement',
        range: range
      })

      // Jump instruction
      suggestions.push({
        label: 'goto',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: '- goto: ${1:scene_name}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Jump to another scene',
        range: range
      })

      // Choice structure
      suggestions.push({
        label: 'choice-basic',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: [
          '- text: "${1:Choice prompt}"',
          '  choices:',
          '    - text: "${2:Option 1}"',
          '      goto: ${3:scene_name}',
          '    - text: "${4:Option 2}"',
          '      condition: "{{${5:condition}}}"',
          '      goto: ${6:other_scene}'
        ].join('\n'),
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Insert choice structure',
        range: range
      })

      // Handlebars helpers - VN specific
      const vnHelpers = [
        { name: 'hasFlag', snippet: '{{hasFlag "${1:flag_name}"}}', doc: 'Check if a flag exists' },
        { name: 'setVar', snippet: '{{setVar "${1:variable_name}" ${2:value}}}', doc: 'Set a variable value' },
        { name: 'getVar', snippet: '{{getVar "${1:variable_name}" ${2:default_value}}}', doc: 'Get a variable value' },
        { name: 'incrementVar', snippet: '{{incrementVar "${1:variable_name}" ${2:amount}}}', doc: 'Increment a variable' },
        { name: 'addFlag', snippet: '{{addFlag "${1:flag_name}"}}', doc: 'Add a flag' },
        { name: 'playerChose', snippet: '{{playerChose "${1:choice_text}"}}', doc: 'Check if player made a choice' },
        { name: 'randomBool', snippet: '{{randomBool ${1:0.5}}}', doc: 'Generate random boolean' },
        { name: 'input', snippet: '{{input "${1:variable_name}" "${2:prompt}" "${3:type}"}}', doc: 'Get user input' },
        { name: 'currentTime', snippet: '{{currentTime}}', doc: 'Get current timestamp' },
        { name: 'saveGame', snippet: '{{saveGame ${1:slot_number}}}', doc: 'Save game to specified slot' },
        { name: 'loadGame', snippet: '{{loadGame ${1:slot_number}}}', doc: 'Load game from specified slot' },
        { name: 'quickSave', snippet: '{{quickSave}}', doc: 'Quick save to slot 1' },
        { name: 'quickLoad', snippet: '{{quickLoad}}', doc: 'Quick load from slot 1' },
        { name: 'hasSave', snippet: '{{hasSave ${1:slot_number}}}', doc: 'Check if save exists in slot' },
        { name: 'textInput', snippet: '{{textInput "${1:variable_name}" "${2:prompt}" "${3:default_value}"}}', doc: 'Text input field' },
        { name: 'selectInput', snippet: '{{selectInput "${1:variable_name}" "${2:prompt}" "${3:options}"}}', doc: 'Select dropdown input' },
        { name: 'checkboxInput', snippet: '{{checkboxInput "${1:variable_name}" "${2:prompt}"}}', doc: 'Checkbox input' },
        { name: 'numberInput', snippet: '{{numberInput "${1:variable_name}" "${2:prompt}" ${3:min} ${4:max}}}', doc: 'Number input with optional min/max' },
        { name: 'component', snippet: '{{component "${1:component_name}" ${2:props}}}', doc: 'Render a custom component' }
      ]

      vnHelpers.forEach(helper => {
        suggestions.push({
          label: helper.name,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: helper.snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: helper.doc,
          range: range
        })
      })

      // Comparison helpers
      const comparisonHelpers = [
        { name: 'eq', snippet: '{{eq ${1:value1} ${2:value2}}}', doc: 'Check if values are equal' },
        { name: 'gt', snippet: '{{gt ${1:value1} ${2:value2}}}', doc: 'Check if first value is greater' },
        { name: 'and', snippet: '{{and ${1:condition1} ${2:condition2}}}', doc: 'Logical AND' },
        { name: 'or', snippet: '{{or ${1:condition1} ${2:condition2}}}', doc: 'Logical OR' },
        { name: 'not', snippet: '{{not ${1:condition}}}', doc: 'Logical NOT' }
      ]

      comparisonHelpers.forEach(helper => {
        suggestions.push({
          label: helper.name,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: helper.snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: helper.doc,
          range: range
        })
      })

      // Math helpers
      const mathHelpers = [
        { name: 'add', snippet: '{{add ${1:value1} ${2:value2}}}', doc: 'Add two numbers' },
        { name: 'subtract', snippet: '{{subtract ${1:value1} ${2:value2}}}', doc: 'Subtract two numbers' },
        { name: 'random', snippet: '{{random ${1:min} ${2:max}}}', doc: 'Generate random number' },
        { name: 'rollDice', snippet: '{{rollDice ${1:sides} ${2:count}}}', doc: 'Roll dice' }
      ]

      mathHelpers.forEach(helper => {
        suggestions.push({
          label: helper.name,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: helper.snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: helper.doc,
          range: range
        })
      })

      // Asset helpers
      const assetHelpers = [
        { name: 'showImage', snippet: '{{showImage "${1:image_key}" gameAssets "${2:position}"}}', doc: 'Display an image' },
        { name: 'playAudio', snippet: '{{playAudio "${1:audio_key}" gameAssets ${2:loop} ${3:fade}}}', doc: 'Play audio' },
        { name: 'hasAsset', snippet: '{{hasAsset "${1:asset_key}" gameAssets}}', doc: 'Check if asset exists' }
      ]

      assetHelpers.forEach(helper => {
        suggestions.push({
          label: helper.name,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: helper.snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: helper.doc,
          range: range
        })
      })

      // Action types
      const actionTypes = ['setVar', 'addVar', 'setFlag', 'clearFlag', 'addToList', 'addTime', 'helper']
      actionTypes.forEach(actionType => {
        suggestions.push({
          label: actionType,
          kind: monaco.languages.CompletionItemKind.Enum,
          insertText: actionType,
          documentation: `Action type: ${actionType}`,
          range: range
        })
      })

      // Common story properties
      const storyProperties = [
        { name: 'text', snippet: 'text: "${1:content}"', doc: 'Dialogue or narrative text' },
        { name: 'speaker', snippet: 'speaker: "${1:Character Name}"', doc: 'Character speaking' },
        { name: 'choices', snippet: 'choices:\n  - text: "${1:Choice text}"\n    goto: ${2:scene}', doc: 'Player choices' },
        { name: 'condition', snippet: 'condition: "{{${1:condition}}}"', doc: 'Conditional requirement' },
        { name: 'goto', snippet: 'goto: ${1:scene_name}', doc: 'Navigate to scene' },
        { name: 'actions', snippet: 'actions:\n  - type: ${1:setVar}\n    key: "${2:variable}"\n    value: ${3:value}', doc: 'Actions to perform' }
      ]

      storyProperties.forEach(prop => {
        suggestions.push({
          label: prop.name,
          kind: monaco.languages.CompletionItemKind.Property,
          insertText: prop.snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: prop.doc,
          range: range
        })
      })

      return { suggestions }
    }
  })

  // Set up comprehensive hover information
  monaco.languages.registerHoverProvider('story-format', {
    provideHover: (model, position) => {
      const word = model.getWordAtPosition(position)
      if (!word) return null

      const hoverInfo = {
        // VN Engine specific helpers
        'hasFlag': 'Checks if a story flag is set. Usage: {{hasFlag "flag_name"}}',
        'setVar': 'Sets a variable to a specific value. Usage: {{setVar "variable_name" value}}',
        'getVar': 'Gets a variable value with optional default. Usage: {{getVar "variable_name" default_value}}',
        'incrementVar': 'Increments a variable by a specified amount. Usage: {{incrementVar "variable_name" amount}}',
        'addFlag': 'Adds a flag to track story progress. Usage: {{addFlag "flag_name"}}',
        'removeFlag': 'Removes a story flag. Usage: {{removeFlag "flag_name"}}',
        'toggleFlag': 'Toggles a flag on/off. Usage: {{toggleFlag "flag_name"}}',
        'playerChose': 'Checks if player made a specific choice. Usage: {{playerChose "choice_text"}}',
        'formatTime': 'Formats minutes into readable time. Usage: {{formatTime minutes}}',
        'randomBool': 'Generates random boolean. Usage: {{randomBool 0.5}}',
        'debug': 'Debug helper for development. Usage: {{debug value "label"}}',
        'input': 'Gets user input. Usage: {{input "variable_name" "prompt" "type"}}',
        'currentTime': 'Gets current timestamp. Usage: {{currentTime}}',
        'currentDate': 'Gets current date. Usage: {{currentDate}}',
        'saveGame': 'Saves game to specified slot. Usage: {{saveGame slot_number}}',
        'loadGame': 'Loads game from specified slot. Usage: {{loadGame slot_number}}',
        'quickSave': 'Quick save to slot 1. Usage: {{quickSave}}',
        'quickLoad': 'Quick load from slot 1. Usage: {{quickLoad}}',
        'hasSave': 'Checks if save exists in slot. Usage: {{hasSave slot_number}}',
        'textInput': 'Creates text input field. Usage: {{textInput "variable_name" "prompt" "default_value"}}',
        'selectInput': 'Creates select dropdown. Usage: {{selectInput "variable_name" "prompt" "options"}}',
        'checkboxInput': 'Creates checkbox input. Usage: {{checkboxInput "variable_name" "prompt"}}',
        'numberInput': 'Creates number input. Usage: {{numberInput "variable_name" "prompt" min max}}',
        'component': 'Renders custom component. Usage: {{component "component_name" props}}',
        
        // Comparison helpers
        'eq': 'Checks if two values are equal. Usage: {{eq value1 value2}}',
        'ne': 'Checks if two values are not equal. Usage: {{ne value1 value2}}',
        'gt': 'Checks if first value is greater than second. Usage: {{gt value1 value2}}',
        'gte': 'Checks if first value is greater than or equal to second. Usage: {{gte value1 value2}}',
        'lt': 'Checks if first value is less than second. Usage: {{lt value1 value2}}',
        'lte': 'Checks if first value is less than or equal to second. Usage: {{lte value1 value2}}',
        'and': 'Logical AND operation. Usage: {{and condition1 condition2}}',
        'or': 'Logical OR operation. Usage: {{or condition1 condition2}}',
        'not': 'Logical NOT operation. Usage: {{not condition}}',
        'contains': 'Checks if collection contains value. Usage: {{contains collection value}}',
        'isEmpty': 'Checks if value is empty. Usage: {{isEmpty value}}',
        'between': 'Checks if value is between min and max. Usage: {{between value min max}}',
        'ifx': 'Ternary conditional helper. Usage: {{ifx condition truthyValue falsyValue}}',
        
        // Math helpers
        'add': 'Adds two or more numbers. Usage: {{add value1 value2}}',
        'subtract': 'Subtracts second number from first. Usage: {{subtract value1 value2}}',
        'multiply': 'Multiplies two or more numbers. Usage: {{multiply value1 value2}}',
        'divide': 'Divides first number by second. Usage: {{divide value1 value2}}',
        'mod': 'Modulo operation. Usage: {{mod value1 value2}}',
        'abs': 'Absolute value. Usage: {{abs value}}',
        'min': 'Minimum value from arguments. Usage: {{min value1 value2 ...}}',
        'max': 'Maximum value from arguments. Usage: {{max value1 value2 ...}}',
        'round': 'Rounds number to specified precision. Usage: {{round value precision}}',
        'random': 'Random number between min and max. Usage: {{random min max}}',
        'randomInt': 'Random integer between min and max. Usage: {{randomInt min max}}',
        'clamp': 'Clamps value between min and max. Usage: {{clamp value min max}}',
        'rollDice': 'Rolls dice with specified sides and count. Usage: {{rollDice sides count}}',
        
        // String helpers
        'uppercase': 'Converts string to uppercase. Usage: {{uppercase string}}',
        'lowercase': 'Converts string to lowercase. Usage: {{lowercase string}}',
        'capitalize': 'Capitalizes first letter. Usage: {{capitalize string}}',
        'titleCase': 'Converts to title case. Usage: {{titleCase string}}',
        'trim': 'Removes whitespace from ends. Usage: {{trim string}}',
        'truncate': 'Truncates string to length. Usage: {{truncate string length suffix}}',
        'replace': 'Replaces text in string. Usage: {{replace string search replacement}}',
        'repeat': 'Repeats string count times. Usage: {{repeat string count}}',
        'wordCount': 'Counts words in string. Usage: {{wordCount string}}',
        'slugify': 'Converts string to URL-friendly slug. Usage: {{slugify string}}',
        
        // Array helpers
        'first': 'Gets first element(s) from array. Usage: {{first array count}}',
        'last': 'Gets last element(s) from array. Usage: {{last array count}}',
        'length': 'Gets length of array or string. Usage: {{length value}}',
        'size': 'Alias for length. Usage: {{size value}}',
        'includes': 'Checks if array includes item. Usage: {{includes array item}}',
        'join': 'Joins array elements with separator. Usage: {{join array separator}}',
        'unique': 'Removes duplicate values from array. Usage: {{unique array}}',
        'shuffle': 'Shuffles array elements randomly. Usage: {{shuffle array}}',
        'sample': 'Gets random element from array. Usage: {{sample array}}',
        'take': 'Takes first N elements from array. Usage: {{take array count}}',
        'slice': 'Slices array from start to end. Usage: {{slice array start end}}',
        
        // Asset helpers
        'hasAsset': 'Checks if asset exists. Usage: {{hasAsset "asset_key" gameAssets}}',
        'getAsset': 'Gets asset by key. Usage: {{getAsset "asset_key" gameAssets}}',
        'resolveAsset': 'Resolves asset URL. Usage: {{resolveAsset "asset_key" gameAssets}}',
        'showImage': 'Displays an image asset. Usage: {{showImage "image_key" gameAssets "position"}}',
        'playAudio': 'Plays an audio asset. Usage: {{playAudio "audio_key" gameAssets loop fade}}',
        'playVideo': 'Plays a video asset. Usage: {{playVideo "video_key" gameAssets autoplay loop}}',
        'getMediaType': 'Gets media type of file. Usage: {{getMediaType filename}}',
        'formatFileSize': 'Formats file size in bytes. Usage: {{formatFileSize bytes}}',
        
        // Story structure keywords
        'text': 'Dialogue or narrative text content',
        'speaker': 'Character name for dialogue attribution',
        'choices': 'Array of choice options for player interaction',
        'goto': 'Navigation command to jump to another scene',
        'jump': 'Alias for goto - navigation to another scene',
        'condition': 'Conditional logic for showing choices or content',
        'actions': 'Array of actions to perform (setVar, setFlag, etc.)',
        'if': 'Conditional statement for branching logic',
        'then': 'Content to show when condition is true',
        'else': 'Content to show when condition is false',
        
        // Action types
        'setVar': 'Action to set a variable value',
        'addVar': 'Action to add to a variable value',
        'setFlag': 'Action to set a story flag',
        'clearFlag': 'Action to remove a story flag',
        'addToList': 'Action to add item to a list variable',
        'addTime': 'Action to advance game time',
        'helper': 'Action to call a helper function',
        
        // Top-level structure
        'scenes': 'Container for all story scenes',
        'variables': 'Initial variable definitions',
        'assets': 'Asset definitions for images, audio, etc.',
        'title': 'Story title',
        'description': 'Story description',
        'styles': 'Visual styling configuration'
      }

      const info = hoverInfo[word.word]
      if (info) {
        return {
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
          },
          contents: [
            { value: `**${word.word}**` },
            { value: info }
          ]
        }
      }

      return null
    }
  })

  // Apply the custom theme
  monaco.editor.setTheme('story-theme')
}