// utils/fileSystem.js
import { openDB } from 'idb'

export class VirtualFileSystem {
  constructor() {
    this.dbName = 'StoryEditorFS'
    this.version = 1
    this.db = null
  }

  async init() {
    this.db = await openDB(this.dbName, this.version, {
      upgrade(db) {
        // Projects store
        if (!db.objectStoreNames.contains('projects')) {
          const projectStore = db.createObjectStore('projects', { keyPath: 'id' })
          projectStore.createIndex('name', 'name')
        }

        // Files store
        if (!db.objectStoreNames.contains('files')) {
          const fileStore = db.createObjectStore('files', { keyPath: 'path' })
          fileStore.createIndex('projectId', 'projectId')
          fileStore.createIndex('type', 'type')
        }

        // Sessions store
        if (!db.objectStoreNames.contains('sessions')) {
          db.createObjectStore('sessions', { keyPath: 'projectId' })
        }
      }
    })
  }

  // Project operations
  async createProject(name, template = 'blank') {
    const projectId = `proj_${Date.now()}`
    const project = {
      id: projectId,
      name,
      created: new Date().toISOString(),
      template,
      settings: {}
    }
    
    await this.db.put('projects', project)
    
    if (template === 'story') {
      await this.createStoryTemplate(projectId)
    }
    
    return project
  }

  async createStoryTemplate(projectId) {
    const storyContent = `title: "My Story"
description: "A new interactive story"

variables:
  player_name: ""
  
scenes:
  start:
    - "Welcome to your story!"
    - text: "What's your name?"
      choices:
        - text: "Continue"
          goto: next_scene
          
  next_scene:
    - "Hello, {{player_name}}!"`

    const files = [
      {
        path: `${projectId}/story.yaml`,
        name: 'story.yaml',
        type: 'yaml',
        content: storyContent,
        projectId,
        size: storyContent.length,
        lastModified: new Date().toISOString()
      },
      {
        path: `${projectId}/components`,
        name: 'components',
        type: 'folder',
        projectId,
        children: [],
        content: '',
        size: 0,
        lastModified: new Date().toISOString()
      },
      {
        path: `${projectId}/scripts`,
        name: 'scripts',
        type: 'folder',
        projectId,
        children: [],
        content: '',
        size: 0,
        lastModified: new Date().toISOString()
      },
      {
        path: `${projectId}/styles`,
        name: 'styles',
        type: 'folder',
        projectId,
        children: [],
        content: '',
        size: 0,
        lastModified: new Date().toISOString()
      }
    ]
    
    for (const file of files) {
      await this.db.put('files', file)
    }
  }

  // File operations
  async createFile(projectId, path, name, type = 'text', content = '') {
    // Normalize path - remove leading/trailing slashes and ensure proper format
    const normalizedPath = path ? path.replace(/^\/+|\/+$/g, '') : ''
    const fullPath = normalizedPath ? `${projectId}/${normalizedPath}/${name}` : `${projectId}/${name}`
    
    const file = {
      path: fullPath,
      name,
      type,
      content,
      projectId,
      size: content.length,
      lastModified: new Date().toISOString()
    }
    
    await this.db.put('files', file)
    return file
  }

  async createFolder(projectId, path, name) {
    const normalizedPath = path ? path.replace(/^\/+|\/+$/g, '') : ''
    const fullPath = normalizedPath ? `${projectId}/${normalizedPath}/${name}` : `${projectId}/${name}`
    
    const folder = {
      path: fullPath,
      name,
      type: 'folder',
      content: '',
      projectId,
      size: 0,
      children: [],
      lastModified: new Date().toISOString()
    }
    
    await this.db.put('files', folder)
    return folder
  }

  async updateFile(path, content) {
    const file = await this.db.get('files', path)
    if (file) {
      file.content = content
      file.size = content.length
      file.lastModified = new Date().toISOString()
      await this.db.put('files', file)
    }
  }

  async deleteFile(path) {
    await this.db.delete('files', path)
  }

  async getProjectFiles(projectId) {
    const files = await this.db.getAllFromIndex('files', 'projectId', projectId)
    return this.buildFileTree(files)
  }

  buildFileTree(files) {
    const tree = {}
    
    files.forEach(file => {
        const pathParts = file.path.split('/').slice(1) // Remove project ID
        const validParts = pathParts.filter(part => part && part.trim() !== '')
        
        if (validParts.length === 0) {
        console.warn('No valid parts for file:', file.name)
        return
        }
        
        let current = tree
        
        for (let i = 0; i < validParts.length - 1; i++) {
        const folderName = validParts[i]
        if (!current[folderName]) {
            current[folderName] = {}
        }
        current = current[folderName]
        }
        
        const fileName = file.name
        current[fileName] = file
        
    })
    
    console.log('Final tree structure:', tree)
    return tree
    }

  // Session management
  async saveSession(projectId, sessionData) {
    const session = {
      projectId,
      ...sessionData,
      lastSaved: new Date().toISOString()
    }
    await this.db.put('sessions', session)
  }

  async loadSession(projectId) {
    return await this.db.get('sessions', projectId)
  }
}