import { useState, useEffect } from 'react'
import './FileUpload.css'

function FileUpload({ files, onFilesChange }) {
    const [filePreviews, setFilePreviews] = useState({})

    // Generate image previews for image files
    useEffect(() => {
        const previews = {}
        files.forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader()
                reader.onloadend = () => {
                    previews[index] = reader.result
                    setFilePreviews({ ...previews })
                }
                reader.readAsDataURL(file)
            }
        })
    }, [files])

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files)
        onFilesChange([...files, ...selectedFiles])
    }

    const removeFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index)
        onFilesChange(newFiles)
        // Remove preview
        const newPreviews = { ...filePreviews }
        delete newPreviews[index]
        setFilePreviews(newPreviews)
    }

    const getFileIcon = (file) => {
        if (file.type.startsWith('image/')) return ''
        if (file.type === 'application/pdf') return ''
        return ''
    }

    return (
        <div className="file-upload-container">
            {files.length > 0 && (
                <div className="file-preview">
                    {files.map((file, index) => (
                        <div key={index} className="file-item">
                            {filePreviews[index] ? (
                                <div className="file-thumbnail">
                                    <img src={filePreviews[index]} alt={file.name} />
                                </div>
                            ) : (
                                <span className="file-icon">{getFileIcon(file)}</span>
                            )}
                            <div className="file-info">
                                <span className="file-name">{file.name}</span>
                                <span className="file-size">
                                    {(file.size / 1024).toFixed(1)}KB
                                </span>
                            </div>
                            <button
                                className="file-remove"
                                onClick={() => removeFile(index)}
                                aria-label="Remove file"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <input
                type="file"
                id="file-input"
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                accept="image/*,.pdf,.txt,.doc,.docx"
            />
        </div>
    )
}

export default FileUpload
