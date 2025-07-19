import { useState, useRef, useEffect } from 'react'
import MonacoEditor from './components/MonacoEditor'
import Header from './components/Header'
import ValidationPanel from './components/ValidationPanel'
import { 
  validateStoryFormat, 
  formatValidationForDisplay,
  getValidationSummary 
} from './utils/storyValidator'

function App() {
  const [editorContent, setEditorContent] = useState('')
  const [isMinimapVisible, setIsMinimapVisible] = useState(true)
  const [status, setStatus] = useState('Ready')
  const [wordCount, setWordCount] = useState(0)
  const [validationResult, setValidationResult] = useState(null)
  const [showValidationDetails, setShowValidationDetails] = useState(false)
  const editorRef = useRef(null)

  // Load the provided story file on mount
  useEffect(() => {
    const initialContent = `title: "The Temporal Tavern Chronicles - Enhanced"
description: "Hub-based interactive story system with enhanced mechanics"
styles:
  theme: "ocean_blue"
  layout: "cinematic"

variables:
  # Core Progress
  storiesCompleted: 0
  totalStories: 3
  reputationLevel: "Unknown Keeper"
  artifactsCollected: 0
  totalArtifacts: 12
  
  # Character Development
  keeper_name: ""
  keeper_experience: 0
  empathy_level: 1
  wisdom_level: 1
  intuition_level: 1

scenes:
  tavern_intro:
    - |
      {{setVar "current_time_period" "neutral"}}
      {{setVar "session_start_time" currentTime}}
      {{setVar "tommy_story_stage" 1}}
      {{playAudio 'tavern_ambience' gameAssets true true}}
      {{showImage 'tavern_neutral' gameAssets 'vn-background'}}
      The Temporal Tavern sits at the crossroads of history itself.
    - "You are the Keeper. The one who listens. The one who remembers."
    - "{{input 'keeper_name' 'What name do the spirits know you by?' 'text'}}"
    - text: "What calls to you?"
      choices:
        - text: "Begin your training as Keeper"
          goto: keeper_tutorial
        - text: "Open the Chronicle"
          goto: chapter_selection

  keeper_tutorial:
    - "Every spirit that enters these doors carries a truth too heavy for the world to bear."
    - "Your role is sacred: **Listen** without judgment. **Remember** what others forget."
    - text: "Are you ready to accept this responsibility?"
      choices:
        - text: "I swear to preserve these truths"
          goto: tutorial_oath
        - text: "What exactly will I be doing?"
          goto: tutorial_details

  tutorial_oath:
    - |
      {{incrementVar 'wisdom_level' 1}}
      {{incrementVar 'keeper_experience' 5}}
      {{addFlag 'tutorial_complete'}}
      The Chronicle glows brighter as you speak your oath.
    - "[🏆 ACHIEVEMENT UNLOCKED: Sacred Oath - Begin your journey as Keeper]"
    - goto: chapter_selection

  chapter_selection:
    - "The Chronicle's pages flutter open. Choose your path:"
    - text: "Which voice from history calls to you?"
      choices:
        - text: "Chapter I: The Christmas Truce - 1914"
          goto: prepare_1914
        - text: "Chapter II: The Plague Doctor - 1854"
          goto: prepare_1854
        - text: "View Progress & Achievements"
          goto: keeper_progress`;

    setEditorContent(initialContent)
    updateWordCount(initialContent)
  }, [])

  const handleEditorChange = (value) => {
    setEditorContent(value)
    updateWordCount(value)
    setStatus('Modified')
  }

  const updateWordCount = (content) => {
    const words = content.trim().split(/\s+/).length
    setWordCount(words)
  }

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run()
      setStatus('Formatted')
    }
  }

  const handleValidate = () => {
    const result = validateStoryFormat(editorContent)
    setValidationResult(result)
    
    const summary = getValidationSummary(result)
    
    if (summary.isValid) {
      setStatus('✅ Valid')
    } else {
      setStatus(`❌ ${summary.errors} error(s), ${summary.warnings} warning(s)`)
    }
    
    setShowValidationDetails(true)
  }

  const handleSave = () => {
    const blob = new Blob([editorContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'story-chronicle.txt'
    a.click()
    URL.revokeObjectURL(url)
    setStatus('Saved')
  }

  const handleLoadFile = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result
        setEditorContent(content)
        updateWordCount(content)
        setStatus('File loaded')
      }
      reader.readAsText(file)
    }
  }

  const toggleMinimap = () => {
    setIsMinimapVisible(!isMinimapVisible)
  }

  return (
    <div className="h-screen bg-vscode-bg text-vscode-text overflow-hidden">
      <Header 
        status={status}
        wordCount={wordCount}
        validationResult={validationResult}
        onFormat={handleFormat}
        onValidate={handleValidate}
        onSave={handleSave}
        onLoadFile={handleLoadFile}
        onToggleMinimap={toggleMinimap}
        onToggleValidationDetails={() => setShowValidationDetails(!showValidationDetails)}
        isMinimapVisible={isMinimapVisible}
        showValidationDetails={showValidationDetails}
      />
      
      <div className="h-[calc(100vh-48px)] flex">
        <div className="flex-1">
          <MonacoEditor 
            ref={editorRef}
            value={editorContent}
            onChange={handleEditorChange}
            showMinimap={isMinimapVisible}
            validationResult={validationResult}
          />
        </div>
        
        {showValidationDetails && validationResult && (
          <ValidationPanel 
            validationResult={validationResult}
            onClose={() => setShowValidationDetails(false)}
          />
        )}
      </div>
      
      <input
        type="file"
        id="fileInput"
        className="hidden"
        accept=".txt,.yaml,.yml"
        onChange={handleLoadFile}
      />
    </div>
  )
}

export default App