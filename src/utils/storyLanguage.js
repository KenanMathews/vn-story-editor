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
    
    // Built-in Handlebars helpers
    handlebarsBuiltins: [
      'blockHelperMissing', 'each', 'helperMissing', 'if', 'unless', 'log', 'lookup', 'with'
    ],
    
    // Array helpers from your engine
    arrayHelpers: [
      'first', 'last', 'length', 'size', 'includes', 'isEmpty', 'where', 'pluck', 'join',
      'groupBy', 'chunk', 'unique', 'shuffle', 'slice', 'take', 'sample', 'flatten',
      'reverse', 'compact', 'without', 'randomChoice', 'weightedChoice', 'cycleNext',
      'findByProperty', 'array', 'range', 'times'
    ],
    
    // Comparison helpers from your engine
    comparisonHelpers: [
      'eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'and', 'or', 'not', 'contains',
      'isString', 'isNumber', 'isArray', 'isObject', 'isBoolean', 'compare', 'between',
      'ifx', 'ternary', 'coalesce', 'default', 'eqw', 'neqw'
    ],
    
    // Math helpers from your engine
    mathHelpers: [
      'add', 'subtract', 'multiply', 'divide', 'remainder', 'mod', 'abs', 'min', 'max',
      'round', 'ceil', 'floor', 'random', 'randomInt', 'clamp', 'sum', 'average',
      'percentage', 'statCheck', 'rollDice', 'lerp', 'normalize', 'formatNumber',
      'inRange', 'isEven', 'isOdd'
    ],
    
    // String helpers from your engine
    stringHelpers: [
      'uppercase', 'lowercase', 'capitalize', 'capitalizeFirst', 'titleCase', 'trim',
      'truncate', 'ellipsis', 'replace', 'remove', 'repeat', 'padStart', 'padEnd',
      'center', 'startsWith', 'endsWith', 'substring', 'words', 'wordCount', 'slugify',
      'stripTags', 'typewriter', 'nameTag', 'dialogueFormat', 'parseMarkdown',
      'sanitizeInput', 'colorText', 'charAt'
    ],
    
    // VN-specific helpers from your engine
    vnHelpers: [
      'setVar', 'getVar', 'hasVar', 'hasFlag', 'addFlag', 'removeFlag', 'toggleFlag',
      'incrementVar', 'playerChose', 'getLastChoice', 'choiceCount', 'formatTime',
      'randomBool', 'debug', 'timestamp', 'currentDate', 'currentTime'
    ],
    
    // Asset helpers from your engine
    assetHelpers: [
      'hasAsset', 'getAsset', 'resolveAsset', 'getAssetInfo', 'getMediaType',
      'normalizeKey', 'assetCount', 'formatFileSize', 'validateAsset',
      'showImage', 'playAudio', 'playVideo'
    ],
    
    // Input helpers from your engine
    inputHelpers: [
      'input', 'textInput', 'selectInput', 'checkboxInput', 'numberInput'
    ],
    
    // Component and save helpers from your engine
    systemHelpers: [
      'component', 'saveGame', 'loadGame', 'quickSave', 'quickLoad', 'hasSave'
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
        
        // Built-in Handlebars helpers
        [/\b(?:blockHelperMissing|each|helperMissing|if|unless|log|lookup|with)\b/, 'keyword.handlebars-builtin'],
        
        // VN helpers
        [/\b(?:setVar|getVar|hasVar|hasFlag|addFlag|removeFlag|toggleFlag|incrementVar|playerChose|getLastChoice|choiceCount|formatTime|randomBool|debug|timestamp|currentDate|currentTime)\b/, 'keyword.vn'],
        
        // Comparison helpers
        [/\b(?:eq|ne|gt|gte|lt|lte|and|or|not|contains|isString|isNumber|isArray|isObject|isBoolean|compare|between|ifx|ternary|coalesce|default|eqw|neqw)\b/, 'keyword.comparison'],
        
        // Math helpers
        [/\b(?:add|subtract|multiply|divide|remainder|mod|abs|min|max|round|ceil|floor|random|randomInt|clamp|sum|average|percentage|statCheck|rollDice|lerp|normalize|formatNumber|inRange|isEven|isOdd)\b/, 'keyword.math'],
        
        // String helpers
        [/\b(?:uppercase|lowercase|capitalize|capitalizeFirst|titleCase|trim|truncate|ellipsis|replace|remove|repeat|padStart|padEnd|center|startsWith|endsWith|substring|words|wordCount|slugify|stripTags|typewriter|nameTag|dialogueFormat|parseMarkdown|sanitizeInput|colorText|charAt)\b/, 'keyword.string'],
        
        // Array helpers
        [/\b(?:first|last|length|size|includes|isEmpty|where|pluck|join|groupBy|chunk|unique|shuffle|slice|take|sample|flatten|reverse|compact|without|randomChoice|weightedChoice|cycleNext|findByProperty|array|range|times)\b/, 'keyword.array'],
        
        // Asset helpers
        [/\b(?:hasAsset|getAsset|resolveAsset|getAssetInfo|getMediaType|normalizeKey|assetCount|formatFileSize|validateAsset|showImage|playAudio|playVideo)\b/, 'keyword.asset'],
        
        // Input helpers
        [/\b(?:input|textInput|selectInput|checkboxInput|numberInput)\b/, 'keyword.input'],
        
        // System helpers
        [/\b(?:component|saveGame|loadGame|quickSave|quickLoad|hasSave)\b/, 'keyword.system'],
        
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
      { token: 'keyword.handlebars-builtin', foreground: 'D7BA7D', fontStyle: 'bold' },
      { token: 'keyword.vn', foreground: 'DCDCAA', fontStyle: 'bold' },
      { token: 'keyword.comparison', foreground: '4ECDC4' },
      { token: 'keyword.math', foreground: '45B7D1' },
      { token: 'keyword.string', foreground: '96CEB4' },
      { token: 'keyword.array', foreground: 'FECA57' },
      { token: 'keyword.asset', foreground: 'FF9FF3' },
      { token: 'keyword.input', foreground: '48CAE4' },
      { token: 'keyword.system', foreground: 'F72585' },
      { token: 'delimiter.handlebars', foreground: 'F9CA24', fontStyle: 'bold' },
      { token: 'variable', foreground: '9CDCFE' },
      { token: 'delimiter', foreground: 'D4D4D4' },
      { token: 'operators', foreground: 'D7BA7D' },
      { token: 'constant.emoji', foreground: 'FF6B6B' },
      { token: 'tag', foreground: '4EC9B0' },
    ],
    colors: {
      'editor.background': '#1e1e1e',
      'editor.foreground': '#d4d4d4',
      'editor.lineHighlightBackground': '#2d2d30',
      'editor.selectionBackground': '#264f78',
      'editor.inactiveSelectionBackground': '#3a3d41'
    }
  })

  // Set up autocomplete suggestions with your actual helpers
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

      // VN Engine specific helpers
      const vnHelpers = [
        { name: 'setVar', snippet: '{{setVar "${1:variable_name}" ${2:value}}}', doc: 'Set a variable to a specific value' },
        { name: 'getVar', snippet: '{{getVar "${1:variable_name}" ${2:default_value}}}', doc: 'Get a variable value with optional default' },
        { name: 'hasVar', snippet: '{{hasVar "${1:variable_name}"}}', doc: 'Check if a variable exists' },
        { name: 'hasFlag', snippet: '{{hasFlag "${1:flag_name}"}}', doc: 'Check if a story flag is set' },
        { name: 'addFlag', snippet: '{{addFlag "${1:flag_name}"}}', doc: 'Add a story flag' },
        { name: 'removeFlag', snippet: '{{removeFlag "${1:flag_name}"}}', doc: 'Remove a story flag' },
        { name: 'toggleFlag', snippet: '{{toggleFlag "${1:flag_name}"}}', doc: 'Toggle a flag on/off' },
        { name: 'incrementVar', snippet: '{{incrementVar "${1:variable_name}" ${2:amount}}}', doc: 'Increment a variable by amount' },
        { name: 'playerChose', snippet: '{{playerChose "${1:choice_text}" ${2:scene_id}}}', doc: 'Check if player made a specific choice' },
        { name: 'getLastChoice', snippet: '{{getLastChoice}}', doc: 'Get the last choice made by player' },
        { name: 'choiceCount', snippet: '{{choiceCount}}', doc: 'Get total number of choices made' },
        { name: 'formatTime', snippet: '{{formatTime ${1:minutes}}}', doc: 'Format minutes into readable time' },
        { name: 'randomBool', snippet: '{{randomBool ${1:0.5}}}', doc: 'Generate random boolean with probability' },
        { name: 'debug', snippet: '{{debug ${1:value} "${2:label}"}}', doc: 'Debug helper for development' },
        { name: 'timestamp', snippet: '{{timestamp}}', doc: 'Get current timestamp' },
        { name: 'currentDate', snippet: '{{currentDate}}', doc: 'Get current date formatted' },
        { name: 'currentTime', snippet: '{{currentTime}}', doc: 'Get current time formatted' }
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

      // Input helpers
      const inputHelpers = [
        { name: 'input', snippet: '{{input "${1:variable_name}" "${2:prompt}" "${3:type}" "${4:options}"}}', doc: 'Generic input helper' },
        { name: 'textInput', snippet: '{{textInput "${1:variable_name}" "${2:prompt}" "${3:default_value}"}}', doc: 'Text input field' },
        { name: 'selectInput', snippet: '{{selectInput "${1:variable_name}" "${2:prompt}" "${3:options}"}}', doc: 'Select dropdown input' },
        { name: 'checkboxInput', snippet: '{{checkboxInput "${1:variable_name}" "${2:prompt}"}}', doc: 'Checkbox input' },
        { name: 'numberInput', snippet: '{{numberInput "${1:variable_name}" "${2:prompt}" ${3:min} ${4:max}}}', doc: 'Number input with optional min/max' }
      ]

      inputHelpers.forEach(helper => {
        suggestions.push({
          label: helper.name,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: helper.snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: helper.doc,
          range: range
        })
      })

      // Save/Load helpers
      const saveHelpers = [
        { name: 'saveGame', snippet: '{{saveGame ${1:slot_number}}}', doc: 'Save game to specified slot' },
        { name: 'loadGame', snippet: '{{loadGame ${1:slot_number}}}', doc: 'Load game from specified slot' },
        { name: 'quickSave', snippet: '{{quickSave}}', doc: 'Quick save to slot 1' },
        { name: 'quickLoad', snippet: '{{quickLoad}}', doc: 'Quick load from slot 1' },
        { name: 'hasSave', snippet: '{{hasSave ${1:slot_number}}}', doc: 'Check if save exists in slot' }
      ]

      saveHelpers.forEach(helper => {
        suggestions.push({
          label: helper.name,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: helper.snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: helper.doc,
          range: range
        })
      })

      // Component helper
      suggestions.push({
        label: 'component',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: '{{component "${1:action}" ${2:params}}}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Component management helper (create, mount, unmount, update, show, hide)',
        range: range
      })

      // Comparison helpers
      const comparisonHelpers = [
        { name: 'eq', snippet: '{{eq ${1:value1} ${2:value2}}}', doc: 'Check if values are equal' },
        { name: 'ne', snippet: '{{ne ${1:value1} ${2:value2}}}', doc: 'Check if values are not equal' },
        { name: 'gt', snippet: '{{gt ${1:value1} ${2:value2}}}', doc: 'Check if first value is greater' },
        { name: 'gte', snippet: '{{gte ${1:value1} ${2:value2}}}', doc: 'Check if first value is greater or equal' },
        { name: 'lt', snippet: '{{lt ${1:value1} ${2:value2}}}', doc: 'Check if first value is less' },
        { name: 'lte', snippet: '{{lte ${1:value1} ${2:value2}}}', doc: 'Check if first value is less or equal' },
        { name: 'and', snippet: '{{and ${1:condition1} ${2:condition2}}}', doc: 'Logical AND operation' },
        { name: 'or', snippet: '{{or ${1:condition1} ${2:condition2}}}', doc: 'Logical OR operation' },
        { name: 'not', snippet: '{{not ${1:condition}}}', doc: 'Logical NOT operation' },
        { name: 'contains', snippet: '{{contains ${1:collection} ${2:value}}}', doc: 'Check if collection contains value' },
        { name: 'isEmpty', snippet: '{{isEmpty ${1:value}}}', doc: 'Check if value is empty' },
        { name: 'compare', snippet: '{{compare ${1:value1} "${2:operator}" ${3:value2}}}', doc: 'Compare values with operator' },
        { name: 'between', snippet: '{{between ${1:value} ${2:min} ${3:max}}}', doc: 'Check if value is between min and max' },
        { name: 'ifx', snippet: '{{ifx ${1:condition} ${2:truthyValue} ${3:falsyValue}}}', doc: 'Ternary conditional helper' },
        { name: 'ternary', snippet: '{{ternary ${1:condition} ${2:truthyValue} ${3:falsyValue}}}', doc: 'Ternary conditional helper' },
        { name: 'coalesce', snippet: '{{coalesce ${1:value1} ${2:value2} ${3:fallback}}}', doc: 'Return first non-null value' },
        { name: 'default', snippet: '{{default ${1:value} ${2:defaultValue}}}', doc: 'Return default if value is null/undefined' },
        { name: 'eqw', snippet: '{{eqw ${1:value1} ${2:value2}}}', doc: 'Weak equality check (==)' },
        { name: 'neqw', snippet: '{{neqw ${1:value1} ${2:value2}}}', doc: 'Weak inequality check (!=)' }
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
        { name: 'add', snippet: '{{add ${1:value1} ${2:value2}}}', doc: 'Add numbers' },
        { name: 'subtract', snippet: '{{subtract ${1:value1} ${2:value2}}}', doc: 'Subtract numbers' },
        { name: 'multiply', snippet: '{{multiply ${1:value1} ${2:value2}}}', doc: 'Multiply numbers' },
        { name: 'divide', snippet: '{{divide ${1:value1} ${2:value2}}}', doc: 'Divide numbers' },
        { name: 'remainder', snippet: '{{remainder ${1:value1} ${2:value2}}}', doc: 'Get remainder' },
        { name: 'mod', snippet: '{{mod ${1:value1} ${2:value2}}}', doc: 'Modulo operation' },
        { name: 'abs', snippet: '{{abs ${1:value}}}', doc: 'Absolute value' },
        { name: 'min', snippet: '{{min ${1:value1} ${2:value2}}}', doc: 'Minimum value' },
        { name: 'max', snippet: '{{max ${1:value1} ${2:value2}}}', doc: 'Maximum value' },
        { name: 'round', snippet: '{{round ${1:value} ${2:precision}}}', doc: 'Round to precision' },
        { name: 'ceil', snippet: '{{ceil ${1:value}}}', doc: 'Round up' },
        { name: 'floor', snippet: '{{floor ${1:value}}}', doc: 'Round down' },
        { name: 'random', snippet: '{{random ${1:min} ${2:max}}}', doc: 'Random number between min and max' },
        { name: 'randomInt', snippet: '{{randomInt ${1:min} ${2:max}}}', doc: 'Random integer between min and max' },
        { name: 'clamp', snippet: '{{clamp ${1:value} ${2:min} ${3:max}}}', doc: 'Clamp value between min and max' },
        { name: 'sum', snippet: '{{sum ${1:array}}}', doc: 'Sum array values' },
        { name: 'average', snippet: '{{average ${1:array}}}', doc: 'Average of array values' },
        { name: 'percentage', snippet: '{{percentage ${1:part} ${2:whole}}}', doc: 'Calculate percentage' },
        { name: 'statCheck', snippet: '{{statCheck ${1:stat} ${2:target}}}', doc: 'Check if stat meets target' },
        { name: 'rollDice', snippet: '{{rollDice ${1:sides} ${2:count}}}', doc: 'Roll dice' },
        { name: 'lerp', snippet: '{{lerp ${1:start} ${2:end} ${3:factor}}}', doc: 'Linear interpolation' },
        { name: 'normalize', snippet: '{{normalize ${1:value} ${2:min} ${3:max}}}', doc: 'Normalize value to 0-1 range' },
        { name: 'formatNumber', snippet: '{{formatNumber ${1:value} ${2:options}}}', doc: 'Format number with options' },
        { name: 'inRange', snippet: '{{inRange ${1:value} ${2:min} ${3:max}}}', doc: 'Check if value is in range' },
        { name: 'isEven', snippet: '{{isEven ${1:value}}}', doc: 'Check if number is even' },
        { name: 'isOdd', snippet: '{{isOdd ${1:value}}}', doc: 'Check if number is odd' }
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

      // String helpers
      const stringHelpers = [
        { name: 'uppercase', snippet: '{{uppercase "${1:string}"}}', doc: 'Convert to uppercase' },
        { name: 'lowercase', snippet: '{{lowercase "${1:string}"}}', doc: 'Convert to lowercase' },
        { name: 'capitalize', snippet: '{{capitalize "${1:string}"}}', doc: 'Capitalize first letter' },
        { name: 'capitalizeFirst', snippet: '{{capitalizeFirst "${1:string}"}}', doc: 'Capitalize first letter only' },
        { name: 'titleCase', snippet: '{{titleCase "${1:string}"}}', doc: 'Convert to title case' },
        { name: 'trim', snippet: '{{trim "${1:string}"}}', doc: 'Remove whitespace from ends' },
        { name: 'truncate', snippet: '{{truncate "${1:string}" ${2:length} "${3:suffix}"}}', doc: 'Truncate string to length' },
        { name: 'ellipsis', snippet: '{{ellipsis "${1:string}" ${2:length}}}', doc: 'Add ellipsis to truncated string' },
        { name: 'replace', snippet: '{{replace "${1:string}" "${2:search}" "${3:replacement}"}}', doc: 'Replace text in string' },
        { name: 'remove', snippet: '{{remove "${1:string}" "${2:pattern}"}}', doc: 'Remove pattern from string' },
        { name: 'repeat', snippet: '{{repeat "${1:string}" ${2:count}}}', doc: 'Repeat string count times' },
        { name: 'padStart', snippet: '{{padStart "${1:string}" ${2:length} "${3:padString}"}}', doc: 'Pad string at start' },
        { name: 'padEnd', snippet: '{{padEnd "${1:string}" ${2:length} "${3:padString}"}}', doc: 'Pad string at end' },
        { name: 'center', snippet: '{{center "${1:string}" ${2:width}}}', doc: 'Center string in width' },
        { name: 'startsWith', snippet: '{{startsWith "${1:string}" "${2:prefix}"}}', doc: 'Check if string starts with prefix' },
        { name: 'endsWith', snippet: '{{endsWith "${1:string}" "${2:suffix}"}}', doc: 'Check if string ends with suffix' },
        { name: 'substring', snippet: '{{substring "${1:string}" ${2:start} ${3:end}}}', doc: 'Extract substring' },
        { name: 'words', snippet: '{{words "${1:string}" ${2:pattern}}}', doc: 'Split string into words' },
        { name: 'wordCount', snippet: '{{wordCount "${1:string}"}}', doc: 'Count words in string' },
        { name: 'slugify', snippet: '{{slugify "${1:string}"}}', doc: 'Convert to URL-friendly slug' },
        { name: 'stripTags', snippet: '{{stripTags "${1:string}"}}', doc: 'Remove HTML tags' },
        { name: 'typewriter', snippet: '{{typewriter "${1:string}" ${2:speed}}}', doc: 'Typewriter effect for string' },
        { name: 'nameTag', snippet: '{{nameTag "${1:name}"}}', doc: 'Format name as tag' },
        { name: 'dialogueFormat', snippet: '{{dialogueFormat "${1:text}" "${2:speaker}"}}', doc: 'Format dialogue text' },
        { name: 'parseMarkdown', snippet: '{{parseMarkdown "${1:markdown}"}}', doc: 'Parse markdown to HTML' },
        { name: 'sanitizeInput', snippet: '{{sanitizeInput "${1:input}"}}', doc: 'Sanitize user input' },
        { name: 'colorText', snippet: '{{colorText "${1:text}" "${2:color}"}}', doc: 'Add color to text' },
        { name: 'charAt', snippet: '{{charAt "${1:string}" ${2:index}}}', doc: 'Get character at index' }
      ]

      stringHelpers.forEach(helper => {
        suggestions.push({
          label: helper.name,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: helper.snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: helper.doc,
          range: range
        })
      })

      // Array helpers
      const arrayHelpers = [
        { name: 'first', snippet: '{{first ${1:array} ${2:count}}}', doc: 'Get first element(s) from array' },
        { name: 'last', snippet: '{{last ${1:array} ${2:count}}}', doc: 'Get last element(s) from array' },
        { name: 'length', snippet: '{{length ${1:array}}}', doc: 'Get array length' },
        { name: 'size', snippet: '{{size ${1:array}}}', doc: 'Get array size' },
        { name: 'includes', snippet: '{{includes ${1:array} ${2:item}}}', doc: 'Check if array includes item' },
        { name: 'where', snippet: '{{where ${1:array} ${2:property}}}', doc: 'Filter array by property' },
        { name: 'pluck', snippet: '{{pluck ${1:array} ${2:property}}}', doc: 'Extract property from array objects' },
        { name: 'join', snippet: '{{join ${1:array} "${2:separator}"}}', doc: 'Join array with separator' },
        { name: 'groupBy', snippet: '{{groupBy ${1:array} ${2:property}}}', doc: 'Group array by property' },
        { name: 'chunk', snippet: '{{chunk ${1:array} ${2:size}}}', doc: 'Split array into chunks' },
        { name: 'unique', snippet: '{{unique ${1:array}}}', doc: 'Remove duplicates from array' },
        { name: 'shuffle', snippet: '{{shuffle ${1:array}}}', doc: 'Shuffle array randomly' },
        { name: 'slice', snippet: '{{slice ${1:array} ${2:start} ${3:end}}}', doc: 'Slice array from start to end' },
        { name: 'take', snippet: '{{take ${1:array} ${2:count}}}', doc: 'Take first N elements' },
        { name: 'sample', snippet: '{{sample ${1:array}}}', doc: 'Get random element from array' },
        { name: 'flatten', snippet: '{{flatten ${1:array}}}', doc: 'Flatten nested arrays' },
        { name: 'reverse', snippet: '{{reverse ${1:array}}}', doc: 'Reverse array order' },
        { name: 'compact', snippet: '{{compact ${1:array}}}', doc: 'Remove falsy values from array' },
        { name: 'without', snippet: '{{without ${1:array} ${2:value1} ${3:value2}}}', doc: 'Remove specific values from array' },
        { name: 'randomChoice', snippet: '{{randomChoice ${1:array}}}', doc: 'Make random choice from array' },
        { name: 'weightedChoice', snippet: '{{weightedChoice ${1:array} ${2:weights}}}', doc: 'Weighted random choice' },
        { name: 'cycleNext', snippet: '{{cycleNext ${1:array} ${2:current}}}', doc: 'Get next item in cycle' },
        { name: 'findByProperty', snippet: '{{findByProperty ${1:array} "${2:property}" ${3:value}}}', doc: 'Find object by property value' },
        { name: 'array', snippet: '{{array ${1:item1} ${2:item2}}}', doc: 'Create array from arguments' },
        { name: 'range', snippet: '{{range ${1:start} ${2:end} ${3:step}}}', doc: 'Generate range of numbers' },
        { name: 'times', snippet: '{{times ${1:count}}}', doc: 'Repeat block N times' }
      ]

      arrayHelpers.forEach(helper => {
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
        { name: 'hasAsset', snippet: '{{hasAsset "${1:asset_key}" ${2:assets}}}', doc: 'Check if asset exists' },
        { name: 'getAsset', snippet: '{{getAsset "${1:asset_key}" ${2:assets}}}', doc: 'Get asset by key' },
        { name: 'resolveAsset', snippet: '{{resolveAsset "${1:asset_key}" ${2:assets}}}', doc: 'Resolve asset URL' },
        { name: 'getAssetInfo', snippet: '{{getAssetInfo "${1:asset_key}" ${2:assets}}}', doc: 'Get asset information' },
        { name: 'getMediaType', snippet: '{{getMediaType "${1:filename}"}}', doc: 'Get media type from filename' },
        { name: 'normalizeKey', snippet: '{{normalizeKey "${1:key}"}}', doc: 'Normalize asset key' },
        { name: 'assetCount', snippet: '{{assetCount ${1:assets}}}', doc: 'Count assets in collection' },
        { name: 'formatFileSize', snippet: '{{formatFileSize ${1:bytes}}}', doc: 'Format file size in bytes' },
        { name: 'validateAsset', snippet: '{{validateAsset "${1:asset_key}" ${2:assets}}}', doc: 'Validate asset exists and is valid' },
        { name: 'showImage', snippet: '{{showImage "${1:image_key}" ${2:assets} "${3:alt_text}" "${4:class}"}}', doc: 'Display image asset' },
        { name: 'playAudio', snippet: '{{playAudio "${1:audio_key}" ${2:assets} ${3:autoplay} ${4:loop}}}', doc: 'Play audio asset' },
        { name: 'playVideo', snippet: '{{playVideo "${1:video_key}" ${2:assets} ${3:autoplay} ${4:loop} "${5:class}"}}', doc: 'Play video asset' }
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

      // Type checking helpers
      const typeHelpers = [
        { name: 'isString', snippet: '{{isString ${1:value}}}', doc: 'Check if value is string' },
        { name: 'isNumber', snippet: '{{isNumber ${1:value}}}', doc: 'Check if value is number' },
        { name: 'isArray', snippet: '{{isArray ${1:value}}}', doc: 'Check if value is array' },
        { name: 'isObject', snippet: '{{isObject ${1:value}}}', doc: 'Check if value is object' },
        { name: 'isBoolean', snippet: '{{isBoolean ${1:value}}}', doc: 'Check if value is boolean' }
      ]

      typeHelpers.forEach(helper => {
        suggestions.push({
          label: helper.name,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: helper.snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: helper.doc,
          range: range
        })
      })

      return { suggestions }
    }
  })

  monaco.languages.registerHoverProvider('story-format', {
    provideHover: (model, position) => {
      const word = model.getWordAtPosition(position)
      if (!word) return null

      const hoverInfo = {
        // Built-in Handlebars helpers
        'blockHelperMissing': 'Built-in Handlebars helper that handles missing block helpers. Automatically called when a block helper is not found.',
        'each': 'Built-in Handlebars iteration helper. Usage: {{#each array}}{{this}}{{/each}} or {{#each object}}{{@key}}: {{this}}{{/each}}',
        'helperMissing': 'Built-in Handlebars helper that throws an error when a helper is missing. Usage: Internal helper, not called directly.',
        'if': 'Built-in Handlebars conditional helper. Usage: {{#if condition}}content{{else}}alternate{{/if}}',
        'unless': 'Built-in Handlebars negative conditional helper. Usage: {{#unless condition}}content{{else}}alternate{{/unless}}',
        'log': 'Built-in Handlebars logging helper. Usage: {{log value level="info"}} - logs values to console',
        'lookup': 'Built-in Handlebars lookup helper. Usage: {{lookup object key}} - dynamically looks up properties',
        'with': 'Built-in Handlebars context helper. Usage: {{#with object}}{{property}}{{/with}} - changes context',

        // Array helpers
        'first': 'Gets first element(s) from array. Usage: {{first array}} or {{first array count}}',
        'last': 'Gets last element(s) from array. Usage: {{last array}} or {{last array count}}',
        'length': 'Gets length of array or string. Usage: {{length value}}',
        'size': 'Alias for length. Gets size of array or string. Usage: {{size value}}',
        'includes': 'Checks if array includes item. Usage: {{#if (includes array item)}}found{{/if}} or {{includes array item}}',
        'isEmpty': 'Checks if value is empty (null, undefined, empty array/object/string). Usage: {{#if (isEmpty value)}}empty{{/if}}',
        'where': 'Filters array by property value. Usage: {{where array "property" "value"}}',
        'pluck': 'Extracts property values from array of objects. Usage: {{pluck array "property"}}',
        'join': 'Joins array elements with separator. Usage: {{join array ", "}}',
        'groupBy': 'Groups array elements by property. Usage: {{groupBy array "property"}}',
        'chunk': 'Splits array into chunks of specified size. Usage: {{chunk array 3}}',
        'unique': 'Removes duplicate values from array. Usage: {{unique array}}',
        'shuffle': 'Shuffles array elements randomly. Usage: {{shuffle array}}',
        'slice': 'Extracts portion of array. Usage: {{slice array start end}}',
        'take': 'Takes first N elements from array. Usage: {{take array 5}}',
        'sample': 'Gets random element from array. Usage: {{sample array}}',
        'flatten': 'Flattens nested arrays into single array. Usage: {{flatten nestedArray}}',
        'reverse': 'Reverses array order. Usage: {{reverse array}}',
        'compact': 'Removes falsy values from array. Usage: {{compact array}}',
        'without': 'Creates array excluding specified values. Usage: {{without array value1 value2}}',
        'randomChoice': 'Makes random choice from array. Usage: {{randomChoice array}}',
        'weightedChoice': 'Makes weighted random choice from array. Usage: {{weightedChoice array weights}}',
        'cycleNext': 'Gets next item in cyclic array. Usage: {{cycleNext array currentItem}}',
        'findByProperty': 'Finds object in array by property value. Usage: {{findByProperty array "property" value}}',
        'array': 'Creates array from arguments. Usage: {{array item1 item2 item3}}',
        'range': 'Generates range of numbers. Usage: {{range start end step}}',
        'times': 'Repeats block N times with index context. Usage: {{#times 5}}{{index}}{{/times}}',

        // Comparison helpers
        'eq': 'Checks if two values are equal. Usage: {{#if (eq value1 value2)}}equal{{/if}} or {{eq value1 value2}}',
        'ne': 'Checks if two values are not equal. Usage: {{#if (ne value1 value2)}}not equal{{/if}}',
        'gt': 'Checks if first value is greater than second. Usage: {{#if (gt value1 value2)}}greater{{/if}}',
        'gte': 'Checks if first value is greater than or equal to second. Usage: {{#if (gte value1 value2)}}greater or equal{{/if}}',
        'lt': 'Checks if first value is less than second. Usage: {{#if (lt value1 value2)}}less{{/if}}',
        'lte': 'Checks if first value is less than or equal to second. Usage: {{#if (lte value1 value2)}}less or equal{{/if}}',
        'and': 'Logical AND operation. Usage: {{#if (and condition1 condition2)}}both true{{/if}}',
        'or': 'Logical OR operation. Usage: {{#if (or condition1 condition2)}}at least one true{{/if}}',
        'not': 'Logical NOT operation. Usage: {{#if (not condition)}}condition is false{{/if}}',
        'contains': 'Checks if collection contains value. Usage: {{#if (contains array value)}}found{{/if}}',
        'isString': 'Checks if value is a string. Usage: {{#if (isString value)}}is string{{/if}}',
        'isNumber': 'Checks if value is a number. Usage: {{#if (isNumber value)}}is number{{/if}}',
        'isArray': 'Checks if value is an array. Usage: {{#if (isArray value)}}is array{{/if}}',
        'isObject': 'Checks if value is an object. Usage: {{#if (isObject value)}}is object{{/if}}',
        'isBoolean': 'Checks if value is a boolean. Usage: {{#if (isBoolean value)}}is boolean{{/if}}',
        'compare': 'Compares values with operator. Usage: {{#if (compare value1 ">" value2)}}comparison result{{/if}}',
        'between': 'Checks if value is between min and max. Usage: {{#if (between value min max)}}in range{{/if}}',
        'ifx': 'Ternary conditional helper. Usage: {{ifx condition truthyValue falsyValue}}',
        'ternary': 'Ternary conditional helper (alias for ifx). Usage: {{ternary condition truthyValue falsyValue}}',
        'coalesce': 'Returns first non-null/undefined value. Usage: {{coalesce value1 value2 fallback}}',
        'default': 'Returns default value if first is null/undefined. Usage: {{default value defaultValue}}',
        'eqw': 'Weak equality check (==). Usage: {{#if (eqw value1 value2)}}weakly equal{{/if}}',
        'neqw': 'Weak inequality check (!=). Usage: {{#if (neqw value1 value2)}}weakly not equal{{/if}}',

        // Math helpers
        'add': 'Adds two or more numbers. Usage: {{add value1 value2}} or {{add value1 value2 value3}}',
        'subtract': 'Subtracts second number from first. Usage: {{subtract value1 value2}}',
        'multiply': 'Multiplies two or more numbers. Usage: {{multiply value1 value2}}',
        'divide': 'Divides first number by second. Usage: {{divide value1 value2}}',
        'remainder': 'Gets remainder of division. Usage: {{remainder value1 value2}}',
        'mod': 'Modulo operation (alias for remainder). Usage: {{mod value1 value2}}',
        'abs': 'Absolute value of number. Usage: {{abs value}}',
        'min': 'Minimum value from arguments. Usage: {{min value1 value2 value3}}',
        'max': 'Maximum value from arguments. Usage: {{max value1 value2 value3}}',
        'round': 'Rounds number to specified precision. Usage: {{round value}} or {{round value precision}}',
        'ceil': 'Rounds number up to nearest integer. Usage: {{ceil value}}',
        'floor': 'Rounds number down to nearest integer. Usage: {{floor value}}',
        'random': 'Random number between min and max (inclusive). Usage: {{random min max}}',
        'randomInt': 'Random integer between min and max (inclusive). Usage: {{randomInt min max}}',
        'clamp': 'Clamps value between min and max bounds. Usage: {{clamp value min max}}',
        'sum': 'Sums all values in array. Usage: {{sum array}}',
        'average': 'Calculates average of values in array. Usage: {{average array}}',
        'percentage': 'Calculates percentage (part/whole * 100). Usage: {{percentage part whole}}',
        'statCheck': 'Checks if stat value meets target threshold. Usage: {{#if (statCheck stat target)}}passed{{/if}}',
        'rollDice': 'Rolls dice with specified sides and count. Usage: {{rollDice sides count}}',
        'lerp': 'Linear interpolation between two values. Usage: {{lerp start end factor}}',
        'normalize': 'Normalizes value to 0-1 range. Usage: {{normalize value min max}}',
        'formatNumber': 'Formats number with specified options. Usage: {{formatNumber value options}}',
        'inRange': 'Checks if number is within range. Usage: {{#if (inRange value min max)}}in range{{/if}}',
        'isEven': 'Checks if number is even. Usage: {{#if (isEven value)}}even{{/if}}',
        'isOdd': 'Checks if number is odd. Usage: {{#if (isOdd value)}}odd{{/if}}',

        // String helpers
        'uppercase': 'Converts string to uppercase. Usage: {{uppercase "hello"}} → "HELLO"',
        'lowercase': 'Converts string to lowercase. Usage: {{lowercase "HELLO"}} → "hello"',
        'capitalize': 'Capitalizes entire string. Usage: {{capitalize "hello world"}} → "HELLO WORLD"',
        'capitalizeFirst': 'Capitalizes only first letter. Usage: {{capitalizeFirst "hello world"}} → "Hello world"',
        'titleCase': 'Converts to title case. Usage: {{titleCase "hello world"}} → "Hello World"',
        'trim': 'Removes whitespace from start and end. Usage: {{trim " hello "}} → "hello"',
        'truncate': 'Truncates string to specified length. Usage: {{truncate string 10 "..."}}',
        'ellipsis': 'Adds ellipsis to truncated string. Usage: {{ellipsis string 10}}',
        'replace': 'Replaces text in string. Usage: {{replace string "search" "replacement"}}',
        'remove': 'Removes pattern from string. Usage: {{remove string "pattern"}}',
        'repeat': 'Repeats string specified number of times. Usage: {{repeat "hello" 3}} → "hellohellohello"',
        'padStart': 'Pads string at start to target length. Usage: {{padStart string 10 "0"}}',
        'padEnd': 'Pads string at end to target length. Usage: {{padEnd string 10 " "}}',
        'center': 'Centers string within specified width. Usage: {{center string 20}}',
        'startsWith': 'Checks if string starts with prefix. Usage: {{#if (startsWith string "pre")}}starts with{{/if}}',
        'endsWith': 'Checks if string ends with suffix. Usage: {{#if (endsWith string "fix")}}ends with{{/if}}',
        'substring': 'Extracts substring from start to end. Usage: {{substring string start end}}',
        'words': 'Splits string into words array. Usage: {{words string pattern}}',
        'wordCount': 'Counts words in string. Usage: {{wordCount string}}',
        'slugify': 'Converts string to URL-friendly slug. Usage: {{slugify "Hello World!"}} → "hello-world"',
        'stripTags': 'Removes HTML tags from string. Usage: {{stripTags "<p>hello</p>"}} → "hello"',
        'typewriter': 'Creates typewriter effect for text. Usage: {{typewriter text speed}}',
        'nameTag': 'Formats name as character tag. Usage: {{nameTag "Character Name"}}',
        'dialogueFormat': 'Formats dialogue with speaker. Usage: {{dialogueFormat text speaker}}',
        'parseMarkdown': 'Converts markdown to HTML. Usage: {{parseMarkdown "**bold**"}}',
        'sanitizeInput': 'Sanitizes user input for safety. Usage: {{sanitizeInput userInput}}',
        'colorText': 'Adds color styling to text. Usage: {{colorText text "red"}}',
        'charAt': 'Gets character at specified index. Usage: {{charAt string 0}}',

        // VN Engine specific helpers
        'setVar': 'Sets a variable to specified value. Usage: {{setVar "variableName" value}} - stores in game state',
        'getVar': 'Gets variable value with optional default. Usage: {{getVar "variableName" defaultValue}}',
        'hasVar': 'Checks if variable exists in game state. Usage: {{#if (hasVar "variableName")}}exists{{/if}}',
        'hasFlag': 'Checks if story flag is set. Usage: {{#if (hasFlag "flagName")}}flag is set{{/if}}',
        'addFlag': 'Adds/sets a story flag. Usage: {{addFlag "flagName"}} - tracks story progress',
        'removeFlag': 'Removes a story flag. Usage: {{removeFlag "flagName"}}',
        'toggleFlag': 'Toggles flag on/off. Usage: {{#if (toggleFlag "flagName")}}now set{{else}}now unset{{/if}}',
        'incrementVar': 'Increments numeric variable by amount. Usage: {{incrementVar "score" 10}}',
        'playerChose': 'Checks if player made specific choice. Usage: {{#if (playerChose "choice text" sceneId)}}chose this{{/if}}',
        'getLastChoice': 'Gets the last choice made by player. Usage: {{getLastChoice}}',
        'choiceCount': 'Gets total number of choices made. Usage: {{choiceCount}}',
        'formatTime': 'Formats minutes into readable time string. Usage: {{formatTime 90}} → "1h 30m"',
        'randomBool': 'Generates random boolean with probability. Usage: {{randomBool 0.7}} - 70% chance of true',
        'debug': 'Debug helper for development logging. Usage: {{debug value "Debug Label"}}',
        'timestamp': 'Gets current timestamp in milliseconds. Usage: {{timestamp}}',
        'currentDate': 'Gets current date as formatted string. Usage: {{currentDate}}',
        'currentTime': 'Gets current time as formatted string. Usage: {{currentTime}}',

        // Asset helpers
        'hasAsset': 'Checks if asset exists in collection. Usage: {{#if (hasAsset "imageKey" assets)}}exists{{/if}}',
        'getAsset': 'Gets asset object by key. Usage: {{getAsset "imageKey" assets}}',
        'resolveAsset': 'Resolves asset to usable URL/path. Usage: {{resolveAsset "imageKey" assets}}',
        'getAssetInfo': 'Gets metadata about asset (type, size, name). Usage: {{getAssetInfo "fileKey" assets}}',
        'getMediaType': 'Determines media type from filename. Usage: {{getMediaType "image.jpg"}} → "image"',
        'normalizeKey': 'Normalizes asset key for consistent lookup. Usage: {{normalizeKey "My Image.jpg"}} → "my_image"',
        'assetCount': 'Counts total assets in collection. Usage: {{assetCount assets}}',
        'formatFileSize': 'Formats file size in bytes to readable format. Usage: {{formatFileSize 1024}} → "1 KB"',
        'validateAsset': 'Validates asset exists and is usable. Usage: {{#if (validateAsset "key" assets)}}valid{{/if}}',
        'showImage': 'Displays image asset as HTML img tag. Usage: {{showImage "imageKey" assets "alt text" "css-class"}}',
        'playAudio': 'Creates HTML audio element for asset. Usage: {{playAudio "audioKey" assets autoplay loop}}',
        'playVideo': 'Creates HTML video element for asset. Usage: {{playVideo "videoKey" assets autoplay loop "css-class"}}',

        // Input helpers
        'input': 'Generic input field creator. Usage: {{input "varName" "prompt" "type" "options"}} - creates interactive input',
        'textInput': 'Creates text input field. Usage: {{textInput "playerName" "Enter your name:" "Default"}}',
        'selectInput': 'Creates dropdown selection input. Usage: {{selectInput "choice" "Pick one:" "option1,option2,option3"}}',
        'checkboxInput': 'Creates checkbox input. Usage: {{checkboxInput "agreed" "I agree to terms"}}',
        'numberInput': 'Creates number input with optional constraints. Usage: {{numberInput "age" "Your age:" 18 100}}',

        // System helpers
        'component': 'Component system helper for UI management. Usage: {{component "create" componentName props}} (actions: create, mount, unmount, update, show, hide)',
        'saveGame': 'Saves current game state to slot. Usage: {{saveGame 1}} - saves to slot 1',
        'loadGame': 'Loads game state from slot. Usage: {{loadGame 1}} - loads from slot 1',
        'quickSave': 'Quick save to slot 1. Usage: {{quickSave}} - convenient save shortcut',
        'quickLoad': 'Quick load from slot 1. Usage: {{quickLoad}} - convenient load shortcut',
        'hasSave': 'Checks if save data exists in slot. Usage: {{#if (hasSave 1)}}save exists{{/if}}',

        // Story structure keywords
        'text': 'Dialogue or narrative text content. Used for story text, character dialogue, and descriptions.',
        'speaker': 'Character name for dialogue attribution. Identifies who is speaking the text.',
        'choices': 'Array of choice options for player interaction. Defines branching narrative paths.',
        'goto': 'Navigation command to jump to another scene. Usage: goto: scene_name',
        'jump': 'Alias for goto - navigation to another scene. Usage: jump: scene_name',
        'condition': 'Conditional logic for showing choices or content. Uses Handlebars expressions.',
        'actions': 'Array of actions to perform (setVar, setFlag, etc.). Executed when choice is made.',
        'if': 'Conditional statement for branching story logic. Usage: if: "{{condition}}"',
        'then': 'Content to show when if condition is true. Contains story instructions.',
        'else': 'Content to show when if condition is false. Alternative story path.',

        // Action types
        'setVar': 'Action type to set a variable value. Usage in actions: {type: "setVar", key: "name", value: "data"}',
        'addVar': 'Action type to add to a variable value. Usage in actions: {type: "addVar", key: "score", value: 10}',
        'setFlag': 'Action type to set a story flag. Usage in actions: {type: "setFlag", flag: "metCharacter"}',
        'clearFlag': 'Action type to remove a story flag. Usage in actions: {type: "clearFlag", flag: "temporaryFlag"}',
        'addToList': 'Action type to add item to a list variable. Usage in actions: {type: "addToList", key: "inventory", value: "sword"}',
        'addTime': 'Action type to advance game time. Usage in actions: {type: "addTime", minutes: 30}',
        'helper': 'Action type to call a helper function. Usage in actions: {type: "helper", helper: "functionName", args: [...]}',

        // Top-level story structure
        'scenes': 'Container for all story scenes. Root object containing scene definitions.',
        'variables': 'Initial variable definitions. Sets up game state variables and their default values.',
        'assets': 'Asset definitions for images, audio, video files. References media files used in story.',
        'title': 'Story title metadata. Displayed as the story/game title.',
        'description': 'Story description metadata. Brief summary of the story content.',
        'styles': 'Visual styling configuration. CSS and theme settings for story presentation.'
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