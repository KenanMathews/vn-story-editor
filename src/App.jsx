// App.jsx - Updated with enhanced Commands Panel Integration
import React, { useState, useEffect } from 'react'
import { useFileSystem } from './hooks/useFileSystem'
import FileTree from './components/ui/FileTree'
import EditorFactory from './components/editors/EditorFactory'
import ValidationPanel from './components/panels/ValidationPanel'
import CommandPanel from './components/panels/CommandPanel'
import Header from './components/ui/Header'
import { validateStoryFormat } from './utils/storyValidator'
import Tour, { useTour } from './components/tour/Tour'
import './index.css'

function App() {
  const {
    projects,
    currentProject,
    files,
    loading,
    createProject,
    loadProject,
    createFile,
    createFolder,
    updateFile,
    deleteFile,
    renameFile,
    moveFile,
  } = useFileSystem()

  const [selectedFile, setSelectedFile] = useState(null)
  const [openFiles, setOpenFiles] = useState([])
  const [activeFileKey, setActiveFileKey] = useState(null)
  const [showMinimap, setShowMinimap] = useState(true)
  const [validationResult, setValidationResult] = useState(null)
  const [showValidationPanel, setShowValidationPanel] = useState(false)
  const [showCommandPanel, setShowCommandPanel] = useState(false)
  const { showTour, startTour, closeTour } = useTour() 

  // Load first project by default
  useEffect(() => {
    console.log('All env vars:', import.meta.env)
    if (projects.length > 0 && !currentProject) {
      loadProject(projects[0].id)
    }
  }, [projects, currentProject, loadProject])

  const handleFileSelect = (file) => {
    // Get file content from our file system
    const fileContent = getFileByPath(files, file.key)
    
    if (fileContent) {
      const editorFile = {
        ...file,
        content: fileContent.content,
        fileType: fileContent.type
      }
      
      setSelectedFile(editorFile)
      setActiveFileKey(file.key)
      
      // Add to open files if not already open
      if (!openFiles.find(f => f.key === file.key)) {
        setOpenFiles(prev => [...prev, editorFile])
      }
      
      // Clear validation for non-YAML files
      if (editorFile.fileType !== 'yaml') {
        setValidationResult(null)
        setShowValidationPanel(false)
      }
    }
  }

  const getFileByPath = (fileObj, path) => {
    const parts = path.split('/')
    let current = fileObj
    
    for (const part of parts) {
      if (current[part]) {
        current = current[part]
      } else {
        return null
      }
    }
    
    return current
  }

  const handleFileChange = (content) => {
    if (selectedFile) {
      const updatedFile = { ...selectedFile, content }
      setSelectedFile(updatedFile)
      
      // Update in open files
      setOpenFiles(prev => 
        prev.map(f => f.key === activeFileKey ? updatedFile : f)
      )
      
      // Auto-save to IndexedDB
      updateFile(`${currentProject.id}/${activeFileKey}`, content)
    }
  }

  const handleFileUpload = async (path, name, type, content) => {
    await createFile(path, name, type, content)
  }

  const handleFileCreate = async (path, name, type, content) => {
    await createFile(path, name, type, content)
  }

  const handleFolderCreate = async (path, name) => {
    await createFolder(path, name)
  }

  const handleFileDelete = async (relativePath) => {
    // Close the file if it's currently open
    if (selectedFile?.key === relativePath) {
      setSelectedFile(null)
      setActiveFileKey(null)
    }
    
    // Remove from open files
    setOpenFiles(prev => prev.filter(f => f.key !== relativePath))
    
    // Delete from file system - convert relative path to full path
    await deleteFile(`${currentProject.id}/${relativePath}`)
  }

  const handleFileRename = async (relativePath, newName) => {
    // Convert relative path to full path for rename
    await renameFile(`${currentProject.id}/${relativePath}`, newName)
  }

  const handleValidate = () => {
    if (selectedFile && selectedFile.fileType === 'yaml') {
      const result = validateStoryFormat(selectedFile.content)
      setValidationResult(result)
      setShowValidationPanel(true)
    }
  }

  const handleCreateProject = async (name, template) => {
    const newProject = await createProject(name, template)
    if (newProject) {
      await loadProject(newProject.id)
    }
  }

  const handleSelectProject = async (projectId) => {
    if (projectId) {
      // Clear current state when switching projects
      setSelectedFile(null)
      setActiveFileKey(null)
      setOpenFiles([])
      setValidationResult(null)
      setShowValidationPanel(false)
      
      // Load the new project
      await loadProject(projectId)
    }
  }

  const handleToggleCommandPanel = () => {
    setShowCommandPanel(!showCommandPanel)
  }

  const handleFileMove = async (sourceRelativePath, targetRelativePath, isFolder) => {
    await moveFile(sourceRelativePath, targetRelativePath, isFolder)
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-vscode-bg">
        <div className="text-vscode-text">Loading...</div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-vscode-bg text-vscode-text flex flex-col">
      <Header 
        currentProject={currentProject}
        projects={projects}
        selectedFile={selectedFile}
        validationResult={validationResult}
        showMinimap={showMinimap}
        onValidate={handleValidate}
        onToggleMinimap={() => setShowMinimap(!showMinimap)}
        onToggleValidation={() => setShowValidationPanel(!showValidationPanel)}
        onCreateProject={handleCreateProject}
        onSelectProject={handleSelectProject}
        showCommandPanel={showCommandPanel}
        onToggleCommandPanel={handleToggleCommandPanel}
        onStartTour={startTour}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 flex-shrink-0">
          <FileTree 
            files={files}
            onFileSelect={handleFileSelect}
            onFileCreate={handleFileCreate}
            onFolderCreate={handleFolderCreate}
            onFileUpload={handleFileUpload}
            onFileDelete={handleFileDelete}
            onFileRename={handleFileRename}
            onFileMove={handleFileMove} 
            selectedFile={selectedFile}
          />
        </div>
        
        <div className="flex-1 flex">
          <EditorFactory 
            file={selectedFile}
            onChange={handleFileChange}
            showMinimap={showMinimap}
            validationResult={validationResult}
          />
          
          {showValidationPanel && validationResult && (
            <ValidationPanel 
              validationResult={validationResult}
              onClose={() => setShowValidationPanel(false)}
            />
          )}

          {showCommandPanel && (
            <CommandPanel 
              currentProject={currentProject}
              files={files}
              selectedFile={selectedFile}
              onClose={() => setShowCommandPanel(false)}
            />
          )}
        </div>
      </div>
      <Tour isActive={showTour} onClose={closeTour} />
    </div>
  )
}

export default App