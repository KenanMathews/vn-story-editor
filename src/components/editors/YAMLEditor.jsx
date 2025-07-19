import { forwardRef, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { setupStoryLanguage } from '../../utils/storyLanguage'

const YAMLEditor = forwardRef(({ file, onChange, showMinimap, validationResult }, ref) => {
  const editorRef = useRef(null)

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor
    if (ref) {
      ref.current = editor
    }

    // Set up custom language support
    setupStoryLanguage(monaco)

    // Configure editor options
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
      }
    })

    // Add custom key bindings
    editor.addAction({
      id: 'save-file',
      label: 'Save File',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: () => {
        // This would trigger the save action in the parent component
        console.log('Save triggered via shortcut')
      }
    })

    // Add custom commands for story editing
    editor.addAction({
      id: 'insert-scene',
      label: 'Insert Scene Template',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyN],
      run: () => {
        const position = editor.getPosition()
        const sceneTemplate = `  new_scene:
    - "Scene description here"
    - text: "Choice prompt"
      choices:
        - text: "Option 1"
          goto: scene_1
        - text: "Option 2"
          goto: scene_2`
        
        editor.executeEdits('insert-scene', [{
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          },
          text: sceneTemplate
        }])
      }
    })

    editor.addAction({
      id: 'insert-handlebars',
      label: 'Insert Handlebars Template',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyH],
      run: () => {
        const position = editor.getPosition()
        const selection = editor.getSelection()
        const selectedText = editor.getModel().getValueInRange(selection)
        
        const handlebarsTemplate = selectedText 
          ? `{{${selectedText}}}` 
          : '{{variable_name}}'
        
        editor.executeEdits('insert-handlebars', [{
          range: selection,
          text: handlebarsTemplate
        }])
      }
    })
  }

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        minimap: { enabled: showMinimap }
      })
    }
  }, [showMinimap])

  useEffect(() => {
    if (editorRef.current && validationResult) {
      const monaco = window.monaco
      if (monaco) {
        // Combine all validation messages
        const allMessages = [
          ...validationResult.errors,
          ...validationResult.warnings,
          ...validationResult.info
        ]
        
        // Convert to Monaco markers
        const markers = allMessages.map(message => {
          let severity
          switch (message.severity) {
            case 'error':
              severity = monaco.MarkerSeverity.Error
              break
            case 'warning':
              severity = monaco.MarkerSeverity.Warning
              break
            case 'info':
              severity = monaco.MarkerSeverity.Info
              break
            default:
              severity = monaco.MarkerSeverity.Hint
          }
          
          return {
            startLineNumber: message.line || 1,
            startColumn: message.column || 1,
            endLineNumber: message.line || 1,
            endColumn: (message.column || 1) + 10, // Extend marker a bit for visibility
            message: `[${message.code}] ${message.message}`,
            severity,
            source: 'story-validator',
            code: message.code
          }
        })
        
        monaco.editor.setModelMarkers(editorRef.current.getModel(), 'story-validator', markers)
      }
    } else if (editorRef.current) {
      // Clear markers if no validation result
      const monaco = window.monaco
      if (monaco) {
        monaco.editor.setModelMarkers(editorRef.current.getModel(), 'story-validator', [])
      }
    }
  }, [validationResult])

  return (
    <div className="w-full h-full">
      <Editor
        height="100%"
        defaultLanguage="story-format"
        value={file?.content || ''}
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
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          parameterHints: { enabled: true },
          hover: { enabled: true },
          links: true,
          colorDecorators: true,
          lightbulb: { enabled: true },
          codeActionsOnSave: {
            'source.fixAll': true
          }
        }}
      />
    </div>
  )
})

YAMLEditor.displayName = 'YAMLEditor'

export default YAMLEditor