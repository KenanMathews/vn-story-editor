import React, { forwardRef, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'

const CSSEditor = forwardRef(({ file, onChange, showMinimap }, ref) => {
  const editorRef = useRef(null)

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor
    if (ref) {
      ref.current = editor
    }

    // Configure CSS-specific options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Fira Code, Monaco, Menlo, Ubuntu Mono, monospace',
      lineNumbers: 'on',
      minimap: { enabled: showMinimap },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      wrappingIndent: 'indent',
      tabSize: 2,
      insertSpaces: true,
      folding: true,
      foldingStrategy: 'indentation',
      showFoldingControls: 'always',
      bracketPairColorization: { enabled: true },
      guides: {
        indentation: true,
        bracketPairs: true,
        bracketPairsHorizontal: true
      },
      // CSS-specific features
      quickSuggestions: true,
      hover: { enabled: true },
      autoClosingBrackets: 'always',
      autoIndent: 'full',
      formatOnPaste: true,
      formatOnType: true,
      suggestOnTriggerCharacters: true,
      colorDecorators: true
    })

    // Set CSS validation options
    monaco.languages.css.cssDefaults.setOptions({
      validate: true,
      lint: {
        compatibleVendorPrefixes: 'ignore',
        vendorPrefix: 'warning',
        duplicateProperties: 'warning',
        emptyRules: 'warning',
        importStatement: 'ignore',
        boxModel: 'ignore',
        universalSelector: 'ignore',
        zeroUnits: 'ignore',
        fontFaceProperties: 'warning',
        hexColorLength: 'error',
        argumentsInColorFunction: 'error',
        unknownProperties: 'warning',
        ieHack: 'ignore',
        unknownVendorSpecificProperties: 'ignore',
        propertyIgnoredDueToDisplay: 'warning',
        important: 'ignore',
        float: 'ignore',
        idSelector: 'ignore'
      }
    })

    // Add CSS-specific actions
    editor.addAction({
      id: 'format-document',
      label: 'Format Document',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyI,
        monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF
      ],
      run: () => {
        editor.getAction('editor.action.formatDocument').run()
      }
    })

    editor.addAction({
      id: 'toggle-comment',
      label: 'Toggle Block Comment',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash],
      run: () => {
        editor.getAction('editor.action.blockComment').run()
      }
    })

    editor.addAction({
      id: 'insert-css-rule',
      label: 'Insert CSS Rule',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR],
      run: () => {
        const position = editor.getPosition()
        const ruleTemplate = `.class-name {
  /* Add your styles here */
  
}`
        
        editor.executeEdits('insert-css-rule', [{
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          },
          text: ruleTemplate
        }])
      }
    })

    editor.addAction({
      id: 'insert-media-query',
      label: 'Insert Media Query',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyM],
      run: () => {
        const position = editor.getPosition()
        const mediaTemplate = `@media screen and (max-width: 768px) {
  /* Mobile styles */
  
}`
        
        editor.executeEdits('insert-media-query', [{
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          },
          text: mediaTemplate
        }])
      }
    })

    editor.addAction({
      id: 'insert-flexbox',
      label: 'Insert Flexbox Container',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyX],
      run: () => {
        const position = editor.getPosition()
        const flexTemplate = `display: flex;
justify-content: center;
align-items: center;
gap: 1rem;`
        
        editor.executeEdits('insert-flexbox', [{
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          },
          text: flexTemplate
        }])
      }
    })

    editor.addAction({
      id: 'insert-grid',
      label: 'Insert CSS Grid',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyG],
      run: () => {
        const position = editor.getPosition()
        const gridTemplate = `display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 1rem;`
        
        editor.executeEdits('insert-grid', [{
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          },
          text: gridTemplate
        }])
      }
    })

    editor.addAction({
      id: 'save-file',
      label: 'Save File',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: () => {
        console.log('Save CSS file')
      }
    })

    // Add custom CSS snippets
    monaco.languages.registerCompletionItemProvider('css', {
      provideCompletionItems: (model, position) => {
        const suggestions = [
          {
            label: 'flex-center',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              'display: flex;',
              'justify-content: center;',
              'align-items: center;'
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Flexbox center alignment'
          },
          {
            label: 'grid-responsive',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              'display: grid;',
              'grid-template-columns: repeat(auto-fit, minmax(${1:200px}, 1fr));',
              'gap: ${2:1rem};'
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Responsive CSS Grid'
          },
          {
            label: 'transition-smooth',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'transition: all 0.3s ease-in-out;',
            documentation: 'Smooth transition'
          },
          {
            label: 'shadow-card',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);',
            documentation: 'Card shadow'
          },
          {
            label: 'text-gradient',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              'background: linear-gradient(${1:45deg}, ${2:#ff6b6b}, ${3:#4ecdc4});',
              'background-clip: text;',
              '-webkit-background-clip: text;',
              '-webkit-text-fill-color: transparent;'
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Gradient text effect'
          }
        ]

        return { suggestions }
      }
    })
  }

  // Update minimap when prop changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        minimap: { enabled: showMinimap }
      })
    }
  }, [showMinimap])

  return (
    <div className="w-full h-full">
      <Editor
        height="100%"
        defaultLanguage="css"
        value={file.content}
        onChange={onChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          automaticLayout: true,
          contextmenu: true,
          copyWithSyntaxHighlighting: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: true,
          smoothScrolling: true,
          mouseWheelZoom: true,
          multiCursorModifier: 'alt',
          links: true,
          colorDecorators: true,
          lightbulb: { enabled: true },
          // CSS-specific editor options
          acceptSuggestionOnCommitCharacter: true,
          acceptSuggestionOnEnter: 'on',
          autoIndent: 'full',
          codeLens: false,
          definitionLinkOpensInPeek: false,
          detectIndentation: true,
          dragAndDrop: true,
          matchBrackets: 'always',
          occurrencesHighlight: true,
          quickSuggestions: {
            other: true,
            comments: false,
            strings: true
          },
          renderLineHighlight: 'line',
          selectionHighlight: true,
          snippetSuggestions: 'top',
          suggest: {
            filterGraceful: true,
            showProperties: true,
            showValues: true,
            showColors: true,
            showKeywords: true,
            showSnippets: true
          },
          wordBasedSuggestions: true
        }}
      />
    </div>
  )
})

CSSEditor.displayName = 'CSSEditor'

export default CSSEditor