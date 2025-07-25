// hooks/useCLI.js - Updated with VN Compiler API integration
import { useState, useCallback, useEffect } from 'react'

// VN Compiler API Client
class VNCompilerClient {
  constructor(baseURL = null) {
    this.baseURL = baseURL || 
                   import.meta.env.VITE_VN_COMPILER_URL || 
                   'http://localhost:8080'
  }

  async createSession(options = {}) {
    const response = await fetch(`${this.baseURL}/api/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options)
    })

    if (!response.ok) {
      throw new Error(`Failed to create session: ${response.statusText}`)
    }

    const result = await response.json()
    return result.sessionId
  }

  async uploadScript(sessionId, yamlContent) {
    const response = await fetch(`${this.baseURL}/api/session/${sessionId}/script`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: yamlContent
    })

    if (!response.ok) {
      throw new Error(`Failed to upload script: ${response.statusText}`)
    }

    return await response.json()
  }

  async uploadAsset(sessionId, file, filename = null) {
    const formData = new FormData()
    formData.append('asset', file)
    if (filename) {
      formData.append('filename', filename)
    }

    const response = await fetch(`${this.baseURL}/api/session/${sessionId}/asset`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Failed to upload asset: ${response.statusText}`)
    }

    return await response.json()
  }

  async compile(sessionId, options = {}) {
    const response = await fetch(`${this.baseURL}/api/session/${sessionId}/compile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options)
    })

    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.error || `Compilation failed: ${response.statusText}`)
    }

    return result
  }

  async download(sessionId) {
    const response = await fetch(`${this.baseURL}/api/session/${sessionId}/download`)

    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`)
    }

    return response.blob()
  }

  async deleteSession(sessionId) {
    const response = await fetch(`${this.baseURL}/api/session/${sessionId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`Failed to delete session: ${response.statusText}`)
    }

    return await response.json()
  }

  async health() {
    const response = await fetch(`${this.baseURL}/health`)
    return await response.json()
  }
}

export const useCLI = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState('')
  const [error, setError] = useState(null)
  const [vnCompilerClient] = useState(() => new VNCompilerClient())
  const [healthStatus, setHealthStatus] = useState({ status: 'unknown', message: null })
  const [lastHealthCheck, setLastHealthCheck] = useState(null)

  useEffect(() => {
    checkHealth()
    const interval = setInterval(checkHealth, 180000)
    return () => clearInterval(interval)
  }, [])

  const checkHealth = useCallback(async () => {
    setHealthStatus({ status: 'checking', message: null })
    try {
      const health = await vnCompilerClient.health()
      setHealthStatus({ 
        status: 'healthy', 
        message: health.status,
        timestamp: health.timestamp 
      })
      setLastHealthCheck(new Date())
    } catch (err) {
      setHealthStatus({ 
        status: 'error', 
        message: err.message || 'Connection failed' 
      })
      setLastHealthCheck(new Date())
    }
  }, [vnCompilerClient])

  const logOutput = useCallback((message) => {
    setOutput(prev => prev + message + '\n')
  }, [])

  const logError = useCallback((message) => {
    setError(message)
    setOutput(prev => prev + `❌ Error: ${message}\n`)
  }, [])

  const executeCommand = useCallback(async (command, projectData) => {
    setIsRunning(true)
    setError(null)
    
    try {
      logOutput(`🚀 Executing: ${command}`)
      logOutput(`🌐 Using VN Compiler at: ${vnCompilerClient.baseURL}`)
      switch (command) {
        case 'health-check':
          await handleHealthCheck()
          break
        case 'validate:story':
          await handleValidateStory(projectData)
          break
        case 'build:story':
          await handleBuildStory(projectData)
          break
        case 'build:production':
          await handleBuildProduction(projectData)
          break
        default:
          throw new Error(`Unknown command: ${command}`)
      }
      
    } catch (err) {
      logError(err.message)
    } finally {
      setIsRunning(false)
    }
  }, [logOutput, logError, vnCompilerClient.baseURL])

  const handleHealthCheck = async () => {
    logOutput('🔍 Checking VN Compiler server status...')
    try {
      await checkHealth()
      const health = await vnCompilerClient.health()
      logOutput(`✅ Server is healthy: ${health.status}`)
      logOutput(`📅 Timestamp: ${health.timestamp}`)
    } catch (err) {
      logError('VN Compiler server is not running. Please start it with: vn-compiler server')
      throw err
    }
  }

  const handleValidateStory = async (projectData) => {
    if (!projectData?.yamlContent) {
      throw new Error('No YAML content found to validate')
    }

    logOutput('📋 Creating validation session...')
    const sessionId = await vnCompilerClient.createSession({
      title: projectData.title || 'Validation Test',
      author: projectData.author
    })

    try {
      logOutput('📝 Uploading script for validation...')
      await vnCompilerClient.uploadScript(sessionId, projectData.yamlContent)
      
      logOutput('🔍 Validating story format...')
      // For validation, we can try to compile and see if it succeeds
      const result = await vnCompilerClient.compile(sessionId, { minify: false })
      
      if (result.status === 'compiled') {
        logOutput('✅ Story validation passed!')
        if (result.warnings && result.warnings.length > 0) {
          logOutput('⚠️  Warnings:')
          result.warnings.forEach(warning => logOutput(`   • ${warning}`))
        }
        if (result.stats) {
          logOutput(`📊 Stats: ${result.stats.sceneCount} scenes, ${result.stats.assetCount} assets`)
        }
      }
    } finally {
      await vnCompilerClient.deleteSession(sessionId)
      logOutput('🧹 Cleaned up session')
    }
  }

  const handleBuildStory = async (projectData) => {
    if (!projectData?.yamlContent) {
      throw new Error('No YAML content found to build')
    }

    logOutput('📋 Creating build session...')
    const sessionId = await vnCompilerClient.createSession({
      title: projectData.title || 'My Visual Novel',
      author: projectData.author,
      description: projectData.description
    })

    try {
      logOutput('📝 Uploading story script...')
      await vnCompilerClient.uploadScript(sessionId, projectData.yamlContent)
      
      // Upload assets if they exist
      if (projectData.assets && projectData.assets.length > 0) {
        logOutput(`📦 Uploading ${projectData.assets.length} assets...`)
        for (const asset of projectData.assets) {
          await vnCompilerClient.uploadAsset(sessionId, asset.file, asset.filename)
          logOutput(`   ✓ Uploaded: ${asset.filename}`)
        }
      }
      
      logOutput('🔨 Compiling visual novel...')
      const result = await vnCompilerClient.compile(sessionId, { 
        minify: false,
        title: projectData.title 
      })
      
      if (result.status === 'compiled') {
        logOutput('✅ Compilation successful!')
        logOutput(`⏱️  Build time: ${result.compilationTime}ms`)
        
        if (result.stats) {
          logOutput(`📊 Build stats:`)
          logOutput(`   • Scenes: ${result.stats.sceneCount}`)
          logOutput(`   • Assets: ${result.stats.assetCount}`)
          logOutput(`   • Input helpers: ${result.stats.inputHelperCount || 0}`)
        }

        logOutput('📥 Downloading compiled game...')
        const htmlBlob = await vnCompilerClient.download(sessionId)
        
        // Trigger download in browser
        const url = URL.createObjectURL(htmlBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${(projectData.title || 'visual-novel').replace(/[^a-zA-Z0-9]/g, '_')}.html`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        logOutput('🎉 Game downloaded successfully!')
      }
    } finally {
      await vnCompilerClient.deleteSession(sessionId)
      logOutput('🧹 Cleaned up session')
    }
  }

  const handleBuildProduction = async (projectData) => {
    if (!projectData?.yamlContent) {
      throw new Error('No YAML content found to build')
    }

    logOutput('📋 Creating production build session...')
    const sessionId = await vnCompilerClient.createSession({
      title: projectData.title || 'My Visual Novel',
      author: projectData.author,
      description: projectData.description
    })

    try {
      logOutput('📝 Uploading story script...')
      await vnCompilerClient.uploadScript(sessionId, projectData.yamlContent)
      
      // Upload assets if they exist
      if (projectData.assets && projectData.assets.length > 0) {
        logOutput(`📦 Uploading ${projectData.assets.length} assets...`)
        for (const asset of projectData.assets) {
          await vnCompilerClient.uploadAsset(sessionId, asset.file, asset.filename)
          logOutput(`   ✓ Uploaded: ${asset.filename}`)
        }
      }
      
      logOutput('🔨 Compiling for production (minified)...')
      const result = await vnCompilerClient.compile(sessionId, { 
        minify: true,
        title: projectData.title 
      })
      
      if (result.status === 'compiled') {
        logOutput('✅ Production build successful!')
        logOutput(`⏱️  Build time: ${result.compilationTime}ms`)
        
        if (result.stats) {
          logOutput(`📊 Production stats:`)
          logOutput(`   • Scenes: ${result.stats.sceneCount}`)
          logOutput(`   • Assets: ${result.stats.assetCount}`)
          logOutput(`   • Minified: Yes`)
        }

        logOutput('📥 Downloading production build...')
        const htmlBlob = await vnCompilerClient.download(sessionId)
        
        // Trigger download in browser
        const url = URL.createObjectURL(htmlBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${(projectData.title || 'visual-novel').replace(/[^a-zA-Z0-9]/g, '_')}_production.html`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        logOutput('🚀 Production build downloaded successfully!')
        logOutput('📝 Ready for deployment to any web hosting service')
      }
    } finally {
      await vnCompilerClient.deleteSession(sessionId)
      logOutput('🧹 Cleaned up session')
    }
  }

  const clearOutput = useCallback(() => {
    setOutput('')
    setError(null)
  }, [])

  return {
    executeCommand,
    isRunning,
    output,
    error,
    clearOutput,
    vnCompilerClient,
    healthStatus,
    lastHealthCheck,
    checkHealth,
  }
}