/**
 * Assets section validation
 */

/**
 * Valid asset types
 */
const VALID_ASSET_TYPES = ['image', 'audio', 'video', 'text', 'data']

/**
 * Valid image formats
 */
const VALID_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp']

/**
 * Valid audio formats
 */
const VALID_AUDIO_FORMATS = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac']

/**
 * Valid video formats
 */
const VALID_VIDEO_FORMATS = ['mp4', 'webm', 'avi', 'mov', 'wmv', 'flv']

/**
 * Required asset properties
 */
const REQUIRED_ASSET_PROPERTIES = ['key', 'url', 'type']

/**
 * Optional asset properties
 */
const OPTIONAL_ASSET_PROPERTIES = [
  'id', 'name', 'description', 'size', 'duration', 'width', 'height', 
  'alt', 'title', 'tags', 'metadata', 'preload', 'loop', 'autoplay'
]

/**
 * Validate assets section
 */
export function validateAssets(assets, reporter) {
  if (!Array.isArray(assets)) {
    reporter.addError(1, 1, 'ASSETS_INVALID_TYPE', 'assets must be an array')
    return
  }

  if (assets.length === 0) {
    reporter.addInfo(1, 1, 'ASSETS_EMPTY', 'Assets section is empty')
    return
  }

  // Validate each asset
  assets.forEach((asset, index) => {
    validateAsset(asset, index, reporter)
  })

  // Check for duplicate assets
  checkDuplicateAssets(assets, reporter)

}

/**
 * Validate individual asset
 */
function validateAsset(asset, index, reporter) {
  if (typeof asset !== 'object' || asset === null) {
    reporter.addError(1, 1, 'ASSET_INVALID_TYPE', 
      `Asset ${index + 1} must be an object`)
    return
  }

  // Check required properties
  REQUIRED_ASSET_PROPERTIES.forEach(prop => {
    if (!asset[prop]) {
      reporter.addError(1, 1, 'ASSET_MISSING_PROPERTY', 
        `Asset ${index + 1} missing required property: ${prop}`)
    }
  })

  // Validate specific properties
  if (asset.key) {
    validateAssetKey(asset.key, index, reporter)
  }

  if (asset.url) {
    validateAssetUrl(asset.url, index, reporter)
  }

  if (asset.type) {
    validateAssetType(asset.type, index, reporter)
  }

  if (asset.id) {
    validateAssetId(asset.id, index, reporter)
  }

  if (asset.name) {
    validateAssetName(asset.name, index, reporter)
  }

  if (asset.description) {
    validateAssetDescription(asset.description, index, reporter)
  }

  if (asset.size) {
    validateAssetSize(asset.size, index, reporter)
  }

  if (asset.duration) {
    validateAssetDuration(asset.duration, index, reporter)
  }

  if (asset.width || asset.height) {
    validateAssetDimensions(asset.width, asset.height, index, reporter)
  }

  if (asset.tags) {
    validateAssetTags(asset.tags, index, reporter)
  }

  if (asset.metadata) {
    validateAssetMetadata(asset.metadata, index, reporter)
  }

  // Check for unknown properties
  Object.keys(asset).forEach(prop => {
    if (!REQUIRED_ASSET_PROPERTIES.includes(prop) && 
        !OPTIONAL_ASSET_PROPERTIES.includes(prop)) {
      reporter.addWarning(1, 1, 'ASSET_UNKNOWN_PROPERTY', 
        `Asset ${index + 1} has unknown property: ${prop}`)
    }
  })

  // Cross-validate properties
  validateAssetCrossProperties(asset, index, reporter)
}

/**
 * Validate asset key
 */
function validateAssetKey(key, index, reporter) {
  if (typeof key !== 'string') {
    reporter.addError(1, 1, 'ASSET_INVALID_KEY_TYPE', 
      `Asset ${index + 1} key must be a string`)
    return
  }

  if (key.trim() === '') {
    reporter.addError(1, 1, 'ASSET_EMPTY_KEY', 
      `Asset ${index + 1} key cannot be empty`)
    return
  }

  // Check key format
  if (!/^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(key)) {
    reporter.addError(1, 1, 'ASSET_INVALID_KEY_FORMAT', 
      `Asset ${index + 1} key "${key}" invalid format. Must start with letter/underscore and contain only letters, numbers, underscores, and hyphens`)
  }

  // Check key length
  if (key.length > 50) {
    reporter.addWarning(1, 1, 'ASSET_LONG_KEY', 
      `Asset ${index + 1} key "${key}" is quite long. Consider shorter names.`)
  }
}

/**
 * Validate asset URL
 */
function validateAssetUrl(url, index, reporter) {
  if (typeof url !== 'string') {
    reporter.addError(1, 1, 'ASSET_INVALID_URL_TYPE', 
      `Asset ${index + 1} url must be a string`)
    return
  }

  if (url.trim() === '') {
    reporter.addError(1, 1, 'ASSET_EMPTY_URL', 
      `Asset ${index + 1} url cannot be empty`)
    return
  }

  // Check URL format
  if (!isValidUrl(url) && !isValidFilePath(url)) {
    reporter.addError(1, 1, 'ASSET_INVALID_URL_FORMAT', 
      `Asset ${index + 1} url "${url}" is not a valid URL or file path`)
  }

  // Check for file extension
  const extension = getFileExtension(url)
  if (!extension) {
    reporter.addWarning(1, 1, 'ASSET_NO_EXTENSION', 
      `Asset ${index + 1} URL has no file extension`)
  }
}

/**
 * Validate asset type
 */
function validateAssetType(type, index, reporter) {
  if (typeof type !== 'string') {
    reporter.addError(1, 1, 'ASSET_INVALID_TYPE_TYPE', 
      `Asset ${index + 1} type must be a string`)
    return
  }

  if (!VALID_ASSET_TYPES.includes(type)) {
    reporter.addError(1, 1, 'ASSET_INVALID_TYPE_VALUE', 
      `Asset ${index + 1} type "${type}" is invalid. Valid types: ${VALID_ASSET_TYPES.join(', ')}`)
  }
}

/**
 * Validate asset ID
 */
function validateAssetId(id, index, reporter) {
  if (typeof id !== 'string') {
    reporter.addError(1, 1, 'ASSET_INVALID_ID_TYPE', 
      `Asset ${index + 1} id must be a string`)
    return
  }

  if (id.trim() === '') {
    reporter.addError(1, 1, 'ASSET_EMPTY_ID', 
      `Asset ${index + 1} id cannot be empty`)
  }
}

/**
 * Validate asset name
 */
function validateAssetName(name, index, reporter) {
  if (typeof name !== 'string') {
    reporter.addError(1, 1, 'ASSET_INVALID_NAME_TYPE', 
      `Asset ${index + 1} name must be a string`)
    return
  }

  if (name.trim() === '') {
    reporter.addWarning(1, 1, 'ASSET_EMPTY_NAME', 
      `Asset ${index + 1} name is empty`)
  }

  if (name.length > 100) {
    reporter.addWarning(1, 1, 'ASSET_LONG_NAME', 
      `Asset ${index + 1} name is quite long (${name.length} characters)`)
  }
}

/**
 * Validate asset description
 */
function validateAssetDescription(description, index, reporter) {
  if (typeof description !== 'string') {
    reporter.addError(1, 1, 'ASSET_INVALID_DESCRIPTION_TYPE', 
      `Asset ${index + 1} description must be a string`)
    return
  }

  if (description.length > 500) {
    reporter.addWarning(1, 1, 'ASSET_LONG_DESCRIPTION', 
      `Asset ${index + 1} description is quite long (${description.length} characters)`)
  }
}

/**
 * Validate asset size
 */
function validateAssetSize(size, index, reporter) {
  if (typeof size !== 'number') {
    reporter.addError(1, 1, 'ASSET_INVALID_SIZE_TYPE', 
      `Asset ${index + 1} size must be a number`)
    return
  }

  if (size < 0) {
    reporter.addError(1, 1, 'ASSET_NEGATIVE_SIZE', 
      `Asset ${index + 1} size cannot be negative`)
  }

  if (size > 50 * 1024 * 1024) { // 50MB
    reporter.addWarning(1, 1, 'ASSET_LARGE_SIZE', 
      `Asset ${index + 1} is quite large (${formatFileSize(size)}). Consider optimization.`)
  }
}

/**
 * Validate asset duration
 */
function validateAssetDuration(duration, index, reporter) {
  if (typeof duration !== 'number') {
    reporter.addError(1, 1, 'ASSET_INVALID_DURATION_TYPE', 
      `Asset ${index + 1} duration must be a number`)
    return
  }

  if (duration < 0) {
    reporter.addError(1, 1, 'ASSET_NEGATIVE_DURATION', 
      `Asset ${index + 1} duration cannot be negative`)
  }

  if (duration > 3600) { // 1 hour
    reporter.addWarning(1, 1, 'ASSET_LONG_DURATION', 
      `Asset ${index + 1} has very long duration (${duration} seconds)`)
  }
}

/**
 * Validate asset dimensions
 */
function validateAssetDimensions(width, height, index, reporter) {
  if (width !== undefined) {
    if (typeof width !== 'number') {
      reporter.addError(1, 1, 'ASSET_INVALID_WIDTH_TYPE', 
        `Asset ${index + 1} width must be a number`)
    } else if (width <= 0) {
      reporter.addError(1, 1, 'ASSET_INVALID_WIDTH_VALUE', 
        `Asset ${index + 1} width must be positive`)
    }
  }

  if (height !== undefined) {
    if (typeof height !== 'number') {
      reporter.addError(1, 1, 'ASSET_INVALID_HEIGHT_TYPE', 
        `Asset ${index + 1} height must be a number`)
    } else if (height <= 0) {
      reporter.addError(1, 1, 'ASSET_INVALID_HEIGHT_VALUE', 
        `Asset ${index + 1} height must be positive`)
    }
  }

  // Check for very large dimensions
  if (width > 4096 || height > 4096) {
    reporter.addWarning(1, 1, 'ASSET_LARGE_DIMENSIONS', 
      `Asset ${index + 1} has very large dimensions (${width}x${height})`)
  }
}

/**
 * Validate asset tags
 */
function validateAssetTags(tags, index, reporter) {
  if (!Array.isArray(tags)) {
    reporter.addError(1, 1, 'ASSET_INVALID_TAGS_TYPE', 
      `Asset ${index + 1} tags must be an array`)
    return
  }

  tags.forEach((tag, tagIndex) => {
    if (typeof tag !== 'string') {
      reporter.addError(1, 1, 'ASSET_INVALID_TAG_TYPE', 
        `Asset ${index + 1} tag ${tagIndex + 1} must be a string`)
    } else if (tag.trim() === '') {
      reporter.addWarning(1, 1, 'ASSET_EMPTY_TAG', 
        `Asset ${index + 1} has empty tag`)
    }
  })

  // Check for duplicate tags
  const uniqueTags = new Set(tags)
  if (uniqueTags.size !== tags.length) {
    reporter.addWarning(1, 1, 'ASSET_DUPLICATE_TAGS', 
      `Asset ${index + 1} has duplicate tags`)
  }
}

/**
 * Validate asset metadata
 */
function validateAssetMetadata(metadata, index, reporter) {
  if (typeof metadata !== 'object' || metadata === null) {
    reporter.addError(1, 1, 'ASSET_INVALID_METADATA_TYPE', 
      `Asset ${index + 1} metadata must be an object`)
    return
  }

  // Check for serializable metadata
  try {
    JSON.stringify(metadata)
  } catch (error) {
    reporter.addError(1, 1, 'ASSET_NON_SERIALIZABLE_METADATA', 
      `Asset ${index + 1} metadata is not serializable`)
  }
}

/**
 * Cross-validate asset properties
 */
function validateAssetCrossProperties(asset, index, reporter) {
  // Check URL extension matches type
  if (asset.url && asset.type) {
    const extension = getFileExtension(asset.url)
    if (extension && !isValidExtensionForType(extension, asset.type)) {
      reporter.addWarning(1, 1, 'ASSET_TYPE_EXTENSION_MISMATCH', 
        `Asset ${index + 1} type "${asset.type}" doesn't match URL extension ".${extension}"`)
    }
  }

  // Check if duration is provided for non-audio/video assets
  if (asset.duration && asset.type && !['audio', 'video'].includes(asset.type)) {
    reporter.addWarning(1, 1, 'ASSET_DURATION_INVALID_TYPE', 
      `Asset ${index + 1} has duration but type is "${asset.type}"`)
  }

  // Check if dimensions are provided for non-image/video assets
  if ((asset.width || asset.height) && asset.type && !['image', 'video'].includes(asset.type)) {
    reporter.addWarning(1, 1, 'ASSET_DIMENSIONS_INVALID_TYPE', 
      `Asset ${index + 1} has dimensions but type is "${asset.type}"`)
  }

  // Check if key and id are different but both present
  if (asset.key && asset.id && asset.key === asset.id) {
    reporter.addInfo(1, 1, 'ASSET_DUPLICATE_KEY_ID', 
      `Asset ${index + 1} has identical key and id. Consider using only one.`)
  }
}

/**
 * Check for duplicate assets
 */
function checkDuplicateAssets(assets, reporter) {
  const keyMap = new Map()
  const idMap = new Map()
  const urlMap = new Map()

  assets.forEach((asset, index) => {
    // Check duplicate keys
    if (asset.key) {
      if (keyMap.has(asset.key)) {
        reporter.addError(1, 1, 'ASSET_DUPLICATE_KEY', 
          `Duplicate asset key "${asset.key}" found at positions ${keyMap.get(asset.key) + 1} and ${index + 1}`)
      } else {
        keyMap.set(asset.key, index)
      }
    }

    // Check duplicate IDs
    if (asset.id) {
      if (idMap.has(asset.id)) {
        reporter.addError(1, 1, 'ASSET_DUPLICATE_ID', 
          `Duplicate asset id "${asset.id}" found at positions ${idMap.get(asset.id) + 1} and ${index + 1}`)
      } else {
        idMap.set(asset.id, index)
      }
    }

    // Check duplicate URLs
    if (asset.url) {
      if (urlMap.has(asset.url)) {
        reporter.addWarning(1, 1, 'ASSET_DUPLICATE_URL', 
          `Duplicate asset URL "${asset.url}" found at positions ${urlMap.get(asset.url) + 1} and ${index + 1}`)
      } else {
        urlMap.set(asset.url, index)
      }
    }
  })
}

/**
 * Check if URL is valid
 */
function isValidUrl(url) {
  try {
    new URL(url)
    return true
  } catch {
    // Check for relative paths
    return url.startsWith('./') || url.startsWith('../') || url.startsWith('/') || 
           /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*\.[a-zA-Z]{2,}/.test(url)
  }
}

/**
 * Check if the path is a valid file path
 */
function isValidFilePath(path) {
  return /^[a-zA-Z0-9_\-\/\.]+$/.test(path);
}

/**
 * Get file extension from URL
 */
function getFileExtension(url) {
  try {
    const pathname = new URL(url).pathname
    const match = pathname.match(/\.([^.]+)$/)
    return match ? match[1].toLowerCase() : null
  } catch {
    const match = url.match(/\.([^.]+)$/)
    return match ? match[1].toLowerCase() : null
  }
}

/**
 * Check if extension is valid for type
 */
function isValidExtensionForType(extension, type) {
  switch (type) {
    case 'image':
      return VALID_IMAGE_FORMATS.includes(extension)
    case 'audio':
      return VALID_AUDIO_FORMATS.includes(extension)
    case 'video':
      return VALID_VIDEO_FORMATS.includes(extension)
    case 'text':
      return ['txt', 'md', 'rtf'].includes(extension)
    case 'data':
      return ['json', 'xml', 'csv', 'yaml', 'yml'].includes(extension)
    default:
      return true
  }
}

/**
 * Format file size for display
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/**
 * Get asset recommendations
 */
export function getAssetRecommendations(assets) {
  const recommendations = []
  
  // Check for missing common assets
  const hasBackgroundMusic = assets.some(asset => 
    asset.type === 'audio' && 
    (asset.key?.includes('background') || asset.key?.includes('music'))
  )
  
  if (!hasBackgroundMusic) {
    recommendations.push('Consider adding background music for better atmosphere')
  }

  // Check for optimization opportunities
  const largeAssets = assets.filter(asset => asset.size && asset.size > 1024 * 1024)
  if (largeAssets.length > 0) {
    recommendations.push(`${largeAssets.length} assets are over 1MB. Consider optimization.`)
  }

  // Check for accessibility
  const imageAssets = assets.filter(asset => asset.type === 'image')
  const imagesWithoutAlt = imageAssets.filter(asset => !asset.alt && !asset.description)
  
  if (imagesWithoutAlt.length > 0) {
    recommendations.push(`${imagesWithoutAlt.length} images missing alt text for accessibility`)
  }

  return recommendations
}

/**
 * Get asset statistics
 */
export function getAssetStatistics(assets) {
  const stats = {
    total: assets.length,
    byType: {},
    totalSize: 0,
    averageSize: 0,
    withMetadata: 0,
    withTags: 0
  }

  assets.forEach(asset => {
    if (asset.type) {
      stats.byType[asset.type] = (stats.byType[asset.type] || 0) + 1
    }
    
    if (asset.size) {
      stats.totalSize += asset.size
    }
    
    if (asset.metadata) {
      stats.withMetadata++
    }
    
    if (asset.tags && asset.tags.length > 0) {
      stats.withTags++
    }
  })

  if (assets.length > 0) {
    stats.averageSize = stats.totalSize / assets.length
  }

  return stats
}