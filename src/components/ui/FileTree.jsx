import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Tree } from 'react-arborist'
import { 
  FileText, 
  Folder, 
  FolderOpen,
  Code, 
  Palette, 
  File,
  Plus,
  ChevronRight,
  ChevronDown,
  Move,
  AlertCircle,
  Upload
} from 'lucide-react'

const FileTree = ({ 
  files, 
  onFileSelect, 
  onFileCreate, 
  onFileDelete, 
  onFileRename,
  onFolderCreate,
  onFileMove,
  onFileUpload,
  selectedFile 
}) => {
  const [contextMenu, setContextMenu] = useState(null)
  const [dragPreview, setDragPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const [treeHeight, setTreeHeight] = useState(400)
  const [activeNode, setActiveNode] = useState(null)
  const containerRef = useRef(null)

  // Calculate tree height based on container
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight
        const newHeight = Math.max(containerHeight - 60, 200)
        setTreeHeight(newHeight)
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  const handleFileUpload = () => {
      fileInputRef.current?.click()
    }
  const handleFileInputChange = async (event) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    
    try {
      const basePath = getBasePath(activeNode)
      
      for (const file of files) {
        const content = await readFileContent(file)
        const fileType = getFileTypeFromName(file.name)
        
        // Use the onFileUpload prop (similar to onFileCreate)
        await onFileUpload(basePath, file.name, fileType, content)
      }
      
      console.log(`Successfully uploaded ${files.length} file(s)`)
    } catch (error) {
      console.error('File upload error:', error)
      alert(`Failed to upload files: ${error.message}`)
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        resolve(e.target.result)
      }
      
      reader.onerror = () => {
        reject(new Error(`Failed to read file: ${file.name}`))
      }

      if (isTextFile(file.name)) {
        reader.readAsText(file)
      } else {
        reader.readAsDataURL(file)
      }
    })
  }

  const isTextFile = (filename) => {
  const textExtensions = [
    'txt', 'md', 'yaml', 'yml', 'json', 'js', 'jsx', 'ts', 'tsx',
    'css', 'scss', 'sass', 'html', 'htm', 'xml', 'csv', 'ini',
    'conf', 'log', 'py', 'java', 'c', 'cpp', 'h', 'cs', 'php',
    'rb', 'go', 'rs', 'sh', 'bat', 'ps1', 'sql'
  ]
  
  const extension = filename.split('.').pop()?.toLowerCase()
  return textExtensions.includes(extension || '')
}
  const treeData = useMemo(() => {
    if (!files || typeof files !== 'object') {
      return []
    }
    
    const convertToArboristFormat = (fileObj, basePath = '') => {
      const result = []
      
      Object.entries(fileObj).forEach(([key, value]) => {
        const currentPath = basePath ? `${basePath}/${key}` : key
        
        if (value && typeof value === 'object' && 'type' in value && 'name' in value) {
          const node = {
            id: currentPath,
            name: value.name,
            ...value,
            parentPath: basePath,
            fullPath: value.path,
          }
          
          if (value.type === 'folder') {
            const nestedEntries = Object.entries(value).filter(([k, v]) => 
              k !== 'type' && k !== 'name' && k !== 'path' && k !== 'projectId' && 
              k !== 'children' && k !== 'content' && k !== 'size' && k !== 'lastModified' &&
              typeof v === 'object' && v !== null
            )
            
            if (nestedEntries.length > 0) {
              const nestedObj = Object.fromEntries(nestedEntries)
              node.children = convertToArboristFormat(nestedObj, currentPath)
            } else {
              node.children = []
            }
          }
          
          result.push(node)
        } else if (typeof value === 'object' && value !== null) {
          const children = convertToArboristFormat(value, currentPath)
          if (children.length > 0) {
            result.push({
              id: currentPath,
              name: key,
              type: 'folder',
              children: children,
              parentPath: basePath,
            })
          }
        }
      })
      
      return result
    }
    
    return convertToArboristFormat(files)
  }, [files])

  const handleMove = ({ dragIds, parentId, index }) => {
    
    const findNodeById = (nodes, id) => {
      for (const node of nodes) {
        if (node.id === id) return node
        if (node.children) {
          const found = findNodeById(node.children, id)
          if (found) return found
        }
      }
      return null
    }

    const parentNode = parentId ? findNodeById(treeData, parentId) : null
    const targetPath = parentNode ? getNodePath(parentNode) : ''

    dragIds.forEach(dragId => {
      const dragNode = findNodeById(treeData, dragId)
      if (dragNode) {
        const currentPath = getNodePath(dragNode)
        
        onFileMove && onFileMove(currentPath, targetPath, dragNode.type === 'folder')
      }
    })
  }

  const getNodePath = (node) => {
    if (node.fullPath) {
      const pathParts = node.fullPath.split('/')
      return pathParts.slice(1).join('/')
    }
    return node.name
  }

  const handleRightClick = (e, node) => {
    e.preventDefault()
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      node: {
        id: node.id,
        name: node.data.name,
        type: node.data.type,
        path: getNodePath(node.data),
        fullPath: node.data.fullPath,
        isFolder: node.data.type === 'folder'
      }
    })
  }

  const getBasePath = (clickedNode) => {
    if (!clickedNode) return '' // Root level
    
    if (clickedNode.isFolder) {
      return clickedNode.path
    } else {
      const pathParts = clickedNode.path.split('/')
      return pathParts.slice(0, -1).join('/') 
    }
  }

  const handleFileCreate = (action) => {
    const basePath = getBasePath(activeNode)
    console.log('📁 Smart create:', action, 'Base path:', basePath, 'Active node:', activeNode)

    if (action === 'newFile') {
      const fileName = prompt('Enter file name:')
      if (fileName) {
        const fileType = getFileTypeFromName(fileName)
        console.log(`Creating file "${fileName}" in "${basePath}"`)
        onFileCreate(basePath, fileName, fileType, '')
      }
    } else if (action === 'newFolder') {
      const folderName = prompt('Enter folder name:')
      if (folderName) {
        console.log(`Creating folder "${folderName}" in "${basePath}"`)
        onFolderCreate(basePath, folderName)
      }
    }
  }

  // Enhanced context menu actions
  const handleContextMenuAction = (action) => {
    if (!contextMenu) return

    const clickedNode = contextMenu.node
    const basePath = getBasePath(clickedNode)


    switch (action) {
      case 'newFile':
        const fileName = prompt('Enter file name:')
        if (fileName) {
          const fileType = getFileTypeFromName(fileName)
          console.log(`Creating file "${fileName}" in "${basePath}"`)
          onFileCreate(basePath, fileName, fileType, '')
        }
        break
        
      case 'newFolder':
        const folderName = prompt('Enter folder name:')
        if (folderName) {
          console.log(`Creating folder "${folderName}" in "${basePath}"`)
          onFolderCreate(basePath, folderName)
        }
        break
        
      case 'rename':
        const newName = prompt('Enter new name:', clickedNode.name)
        if (newName && newName !== clickedNode.name) {
          onFileRename(clickedNode.path, newName)
        }
        break
        
      case 'delete':
        if (confirm(`Are you sure you want to delete "${clickedNode.name}"?`)) {
          onFileDelete(clickedNode.id)
        }
        break
        
      case 'cut':
        // Store for move operation
        setDragPreview({ node: clickedNode, operation: 'cut' })
        break
        
      case 'copy':
        // Store for copy operation
        setDragPreview({ node: clickedNode, operation: 'copy' })
        break
        
      case 'paste':
        if (dragPreview) {
          const targetPath = getBasePath(clickedNode)
          console.log(`Pasting ${dragPreview.node.name} to ${targetPath}`)
          
          if (dragPreview.operation === 'cut') {
            onFileMove && onFileMove(dragPreview.node.path, targetPath, dragPreview.node.isFolder)
          } else {
            // Handle copy operation (would need new handler)
            console.log('Copy operation not implemented yet')
          }
          setDragPreview(null)
        }
        break
      case 'upload':
        setActiveNode(clickedNode)
        handleFileUpload()
        break
    }
    setContextMenu(null)
  }

  const NodeRenderer = ({ node, style, dragHandle, tree }) => {
    const pathParts = node.id.split('/')
    const relativePath = pathParts.slice(0).join('/')
    const isSelected = selectedFile?.key === relativePath
    const isOpen = node.isOpen
    const fileData = node.data
    const isDragging = node.isDraggedOver
    const willReceiveDrop = node.willReceiveDrop

    const handleClick = () => {
      setActiveNode({
        id: node.id,
        name: fileData.name,
        type: fileData.type,
        path: getNodePath(fileData),
        fullPath: fileData.fullPath,
        isFolder: fileData.type === 'folder'
      })
      if (fileData.type !== 'folder') {
        onFileSelect({
          key: relativePath,
          name: fileData.name,
          type: fileData.type,
          fileType: fileData.type,
          content: fileData.content || '',
          size: fileData.size || 0
        })
      } else {
        node.toggle()
      }
    }

    const getNodeClasses = () => {
      const baseClasses = "flex items-center py-1 px-2 hover:bg-vscode-bg cursor-pointer transition-all duration-150"
      
      let stateClasses = []
      
      if (isSelected) {
        stateClasses.push("bg-vscode-blue text-white")
      }else if (activeNode?.id === node.id) {
        stateClasses.push("bg-vscode-border bg-opacity-50 border-l-2 border-yellow-400")
      } else {
        stateClasses.push("hover:bg-vscode-bg text-vscode-text")
      }
      
      if (isDragging) {
        stateClasses.push("opacity-50 transform scale-95")
      }
      
      if (willReceiveDrop) {
        stateClasses.push("bg-blue-500 bg-opacity-20 border-l-4 border-blue-500")
      }
      
      if (dragPreview?.node.id === node.id) {
        stateClasses.push("bg-yellow-500 bg-opacity-20 border-l-2 border-yellow-500")
      }
      
      return `${baseClasses} ${stateClasses.join(' ')}`
    }

    return (
      <div 
        className={getNodeClasses()}
        style={style}
        onClick={handleClick}
        onContextMenu={(e) => handleRightClick(e, node)}
        ref={dragHandle}
      >
        {/* Folder expand/collapse button */}
        {fileData.type === 'folder' && (
          <button 
            className="mr-1 p-0.5 hover:bg-gray-600 rounded"
            onClick={(e) => {
              e.stopPropagation()
              node.toggle()
            }}
          >
            {isOpen ? 
              <ChevronDown className="w-3 h-3 text-vscode-text" /> : 
              <ChevronRight className="w-3 h-3 text-vscode-text" />
            }
          </button>
        )}
        
        {/* Spacer for files */}
        {fileData.type !== 'folder' && (
          <div className="w-4 mr-1" />
        )}
        
        {/* File/folder icon */}
        <div className="mr-2">
          {getFileIcon(fileData, isOpen)}
        </div>
        
        {/* File name */}
        <span className={`text-sm truncate flex-1 ${isSelected ? 'text-white' : 'text-vscode-text'}`}>
          {fileData.name || 'MISSING NAME'}
        </span>
        
        {/* Drop target indicator */}
        {willReceiveDrop && (
          <Move className="w-3 h-3 text-blue-400 ml-auto" />
        )}
        
        {/* Cut indicator */}
        {dragPreview?.node.id === node.id && dragPreview.operation === 'cut' && (
          <span className="text-xs text-yellow-400 ml-2">CUT</span>
        )}
        
        {/* File size for files */}
        {fileData.type === 'file' && fileData.size > 0 && !isSelected && (
          <span className="text-xs ml-auto text-vscode-text-muted">
            {fileData.size}B
          </span>
        )}
      </div>
    )
  }

  const getFileIcon = (fileData, isOpen = false) => {
    if (fileData.type === 'folder') {
      return isOpen ? 
        <FolderOpen className="w-4 h-4 text-blue-400" /> : 
        <Folder className="w-4 h-4 text-blue-400" />
    }
    
    switch (fileData.type) {
      case 'yaml':
        return <FileText className="w-4 h-4 text-blue-400" />
      case 'javascript':
        return <Code className="w-4 h-4 text-yellow-400" />
      case 'css':
        return <Palette className="w-4 h-4 text-purple-400" />
      default:
        return <File className="w-4 h-4 text-gray-400" />
    }
  }

  const getFileTypeFromName = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase() || 'text'
    switch (ext) {
      case 'yaml':
      case 'yml':
        return 'yaml'
      case 'js':
        return 'javascript'
      case 'css':
        return 'css'
      case 'json':
        return 'json'
      case 'md':
        return 'markdown'
      case 'html':
        return 'html'
      case 'xml':
        return 'xml'
      default:
        return 'text'
    }
  }

  return (
    <div ref={containerRef} className="h-full bg-vscode-panel border-r border-vscode-border flex flex-col">
      {/* Header */}
      <div className="p-2 border-b border-vscode-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-vscode-text">Explorer</h3>
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => handleFileCreate('newFile')}
              className="p-1 hover:bg-vscode-bg rounded"
              title="New File"
            >
              <Plus className="w-4 h-4 text-vscode-text-muted" />
            </button>
            <button 
              onClick={() => handleFileCreate('newFolder')}
              className="p-1 hover:bg-vscode-bg rounded"
              title="New Folder"
            >
              <Folder className="w-4 h-4 text-vscode-text-muted" />
            </button>
            <button 
              onClick={handleFileUpload}
              disabled={uploading}
              className="p-1 hover:bg-vscode-bg rounded disabled:opacity-50"
              title={uploading ? "Uploading..." : "Upload Files"}
            >
              <Upload className={`w-4 h-4 text-vscode-text-muted ${uploading ? 'animate-pulse' : ''}`} />
            </button>
          </div>
        </div>
         <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
          accept=".txt,.md,.yaml,.yml,.json,.js,.jsx,.ts,.tsx,.css,.scss,.sass,.html,.htm,.xml,.csv,.ini,.conf,.log,.py,.java,.c,.cpp,.h,.cs,.php,.rb,.go,.rs,.sh,.bat,.ps1,.sql,image/*,audio/*,video/*"
        />
      </div>
      
      {/* Tree Container */}
      <div className="flex-1 overflow-hidden">
        {treeData.length > 0 ? (
          <Tree
            data={treeData}
            openByDefault={false}
            width="100%"
            height={treeHeight}
            indent={16}
            rowHeight={28}
            className="bg-vscode-panel text-vscode-text"
            disableEdit={true}
            
            // Enable drag & drop
            disableDrag={false}
            disableDrop={false}
            onMove={handleMove}
            
            // Drag & drop configuration
            canDrop={(dragIds, parentId) => {
              // Allow dropping anywhere except on files
              if (!parentId) return true // Can drop at root
              
              const parentNode = treeData.find(n => n.id === parentId)
              return parentNode?.type === 'folder'
            }}
          >
            {NodeRenderer}
          </Tree>
        ) : (
          <div className="flex items-center justify-center h-full text-vscode-text-muted">
            <div className="text-center">
              <Folder className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No files in project</p>
              <button 
                onClick={() => handleContextMenuAction('newFile')}
                className="mt-2 text-xs text-vscode-blue hover:underline"
              >
                Create your first file
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Enhanced Context Menu */}
      {contextMenu && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-opacity-0"
            onClick={() => setContextMenu(null)}
          />
          <div 
            className="fixed z-50 bg-vscode-panel border border-vscode-border rounded shadow-lg py-1 min-w-40"
            style={{ 
              left: contextMenu.x, 
              top: contextMenu.y 
            }}
          >
            <div className="px-3 py-1 text-xs text-vscode-text-muted border-b border-vscode-border">
              {contextMenu.node.isFolder ? '📁' : '📄'} {contextMenu.node.name}
            </div>
            
            <button
              className="w-full text-left px-3 py-1 hover:bg-vscode-bg text-sm text-vscode-text"
              onClick={() => handleContextMenuAction('newFile')}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              New File {contextMenu.node.isFolder ? 'in folder' : 'here'}
            </button>
            
            <button
              className="w-full text-left px-3 py-1 hover:bg-vscode-bg text-sm text-vscode-text"
              onClick={() => handleContextMenuAction('newFolder')}
            >
              <Folder className="w-4 h-4 inline mr-2" />
              New Folder {contextMenu.node.isFolder ? 'in folder' : 'here'}
            </button>
            <button
              className="w-full text-left px-3 py-1 hover:bg-vscode-bg text-sm text-vscode-text"
              onClick={() => handleContextMenuAction('upload')}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Upload Files {contextMenu.node.isFolder ? 'to folder' : 'here'}
            </button>
            
            <hr className="border-vscode-border my-1" />
            
            <button
              className="w-full text-left px-3 py-1 hover:bg-vscode-bg text-sm text-vscode-text"
              onClick={() => handleContextMenuAction('cut')}
            >
              <Move className="w-4 h-4 inline mr-2" />
              Cut
            </button>
            
            <button
              className="w-full text-left px-3 py-1 hover:bg-vscode-bg text-sm text-vscode-text"
              onClick={() => handleContextMenuAction('copy')}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Copy
            </button>
            
            {dragPreview && (
              <button
                className="w-full text-left px-3 py-1 hover:bg-vscode-bg text-sm text-vscode-text"
                onClick={() => handleContextMenuAction('paste')}
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Paste {dragPreview.node.name}
              </button>
            )}
            
            <hr className="border-vscode-border my-1" />
            
            <button
              className="w-full text-left px-3 py-1 hover:bg-vscode-bg text-sm text-vscode-text"
              onClick={() => handleContextMenuAction('rename')}
            >
              Rename
            </button>
            
            <button
              className="w-full text-left px-3 py-1 hover:bg-vscode-bg text-sm text-red-400"
              onClick={() => handleContextMenuAction('delete')}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default FileTree