import { useEffect, useRef } from 'react'
import './FileUploadMenu.css'

function FileUploadMenu({ isOpen, onClose, onSelectPhotos, onSelectCamera, onSelectPDF }) {
    const menuRef = useRef(null)

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const menuItems = [
        {
            icon: '',
            label: 'Upload Photos',
            description: 'Choose from gallery',
            onClick: onSelectPhotos,
            gradient: 'linear-gradient(135deg, #6EE7F9, #A78BFA)'
        },
        {
            icon: '',
            label: 'Take Photo',
            description: 'Use camera',
            onClick: onSelectCamera,
            gradient: 'linear-gradient(135deg, #5EEAD4, #60A5FA)'
        },
        {
            icon: '',
            label: 'Upload PDF',
            description: 'Attach document',
            onClick: onSelectPDF,
            gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)'
        }
    ]

    return (
        <div className="file-upload-menu glass-elevated" ref={menuRef}>
            {menuItems.map((item, index) => (
                <button
                    key={index}
                    className="menu-item"
                    onClick={() => {
                        item.onClick()
                        onClose()
                    }}
                    style={{ '--item-gradient': item.gradient }}
                >
                    <div className="menu-item-icon">{item.icon}</div>
                    <div className="menu-item-content">
                        <div className="menu-item-label">{item.label}</div>
                        <div className="menu-item-description">{item.description}</div>
                    </div>
                </button>
            ))}
        </div>
    )
}

export default FileUploadMenu
