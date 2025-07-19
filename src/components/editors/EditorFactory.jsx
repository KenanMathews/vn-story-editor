// components/editors/EditorFactory.jsx
import React from 'react'
import YAMLEditor from './YAMLEditor'
import JavaScriptEditor from './JavascriptEditor'
import CSSEditor from './CSSEditor'
import GenericEditor from './GenericEditor'

const EditorFactory = ({ file, onChange, showMinimap, validationResult }) => {
  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center bg-vscode-bg">
        <div className="text-center text-vscode-text-muted">
          <p>Select a file to edit</p>
        </div>
      </div>
    )
  }

  const getEditor = () => {
    switch (file.fileType) {
      case 'yaml':
        return (
          <YAMLEditor 
            file={file}
            onChange={onChange}
            showMinimap={showMinimap}
            validationResult={validationResult}
          />
        )
      case 'javascript':
        return (
          <JavaScriptEditor 
            file={file}
            onChange={onChange}
            showMinimap={showMinimap}
          />
        )
      case 'css':
        return (
          <CSSEditor 
            file={file}
            onChange={onChange}
            showMinimap={showMinimap}
          />
        )
      default:
        return (
          <GenericEditor 
            file={file}
            onChange={onChange}
            showMinimap={showMinimap}
          />
        )
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-vscode-panel border-b border-vscode-border px-3 py-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-vscode-text">{file.name}</span>
          <span className="text-xs text-vscode-text-muted">
            {file.fileType?.toUpperCase()}
          </span>
        </div>
      </div>
      <div className="flex-1">
        {getEditor()}
      </div>
    </div>
  )
}

export default EditorFactory