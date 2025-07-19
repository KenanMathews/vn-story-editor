import React, { forwardRef, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'

const GenericEditor = forwardRef(({ file, onChange, showMinimap }, ref) => {
  const editorRef = useRef(null)

  const getLanguageFromFile = (filename) => {
    const ext = filename.split('.').pop().toLowerCase()
    switch (ext) {
      case 'json':
        return 'json'
      case 'md':
        return 'markdown'
      case 'html':
        return 'html'
      case 'xml':
        return 'xml'
      case 'txt':
        return 'plaintext'
      default:
        return 'plaintext'
    }
  }

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor
    if (ref) {
      ref.current = editor
    }

    // Configure generic editor options
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

    // Add common actions
    editor.addAction({
      id: 'save-file',
      label: 'Save File',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: () => {
        console.log('Save file')
      }
    })

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
        defaultLanguage={getLanguageFromFile(file.name)}
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
          lightbulb: { enabled: true }
        }}
      />
    </div>
  )
})

GenericEditor.displayName = 'GenericEditor'

export default GenericEditor