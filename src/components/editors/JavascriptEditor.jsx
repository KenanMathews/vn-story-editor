import React, { forwardRef, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'

const JavaScriptEditor = forwardRef(({ file, onChange, showMinimap }, ref) => {
  const editorRef = useRef(null)

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor
    if (ref) {
      ref.current = editor
    }

    // Configure JavaScript-specific options
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
      // JavaScript-specific features
      quickSuggestions: true,
      parameterHints: { enabled: true },
      hover: { enabled: true },
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
      autoIndent: 'full',
      formatOnPaste: true,
      formatOnType: true,
      suggestOnTriggerCharacters: true
    })

    // Set JavaScript compiler options
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      allowJs: true,
      checkJs: false
    })

    // Enable JavaScript validation
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      noSuggestionDiagnostics: false
    })

    // Add JavaScript-specific actions
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
      label: 'Toggle Line Comment',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash],
      run: () => {
        editor.getAction('editor.action.commentLine').run()
      }
    })

    editor.addAction({
      id: 'insert-console-log',
      label: 'Insert Console.log',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyL],
      run: () => {
        const selection = editor.getSelection()
        const selectedText = editor.getModel().getValueInRange(selection)
        
        let insertText
        if (selectedText) {
          insertText = `console.log('${selectedText}:', ${selectedText})`
        } else {
          insertText = 'console.log()'
        }
        
        editor.executeEdits('insert-console-log', [{
          range: selection,
          text: insertText
        }])
        
        // Position cursor inside parentheses if no selection
        if (!selectedText) {
          const position = editor.getPosition()
          editor.setPosition({
            lineNumber: position.lineNumber,
            column: position.column - 1
          })
        }
      }
    })

    editor.addAction({
      id: 'insert-function',
      label: 'Insert Function Template',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF],
      run: () => {
        const position = editor.getPosition()
        const functionTemplate = `function functionName() {
  // TODO: Implement function
  return null
}`
        
        editor.executeEdits('insert-function', [{
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          },
          text: functionTemplate
        }])
      }
    })

    editor.addAction({
      id: 'save-file',
      label: 'Save File',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: () => {
        console.log('Save JavaScript file')
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
        defaultLanguage="javascript"
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
          codeActionsOnSave: {
            'source.fixAll': true,
            'source.organizeImports': true
          },
          // JavaScript-specific editor options
          acceptSuggestionOnCommitCharacter: true,
          acceptSuggestionOnEnter: 'on',
          accessibilitySupport: 'auto',
          autoIndent: 'full',
          codeLens: true,
          definitionLinkOpensInPeek: false,
          detectIndentation: true,
          dragAndDrop: true,
          matchBrackets: 'always',
          occurrencesHighlight: true,
          peekWidgetDefaultFocus: 'editor',
          quickSuggestions: {
            other: true,
            comments: false,
            strings: false
          },
          renderLineHighlight: 'line',
          selectionHighlight: true,
          showUnused: true,
          snippetSuggestions: 'top',
          suggest: {
            filterGraceful: true,
            showMethods: true,
            showFunctions: true,
            showConstructors: true,
            showFields: true,
            showVariables: true,
            showClasses: true,
            showStructs: true,
            showInterfaces: true,
            showModules: true,
            showProperties: true,
            showEvents: true,
            showOperators: true,
            showUnits: true,
            showValues: true,
            showConstants: true,
            showEnums: true,
            showEnumMembers: true,
            showKeywords: true,
            showWords: true,
            showColors: true,
            showFiles: true,
            showReferences: true,
            showFolders: true,
            showTypeParameters: true,
            showSnippets: true
          },
          wordBasedSuggestions: true
        }}
      />
    </div>
  )
})

JavaScriptEditor.displayName = 'JavaScriptEditor'

export default JavaScriptEditor