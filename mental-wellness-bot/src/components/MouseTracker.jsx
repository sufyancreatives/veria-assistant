import { useEffect, useRef } from 'react'
import './MouseTracker.css'

function MouseTracker() {
    const cursorRef = useRef({ x: 0, y: 0 })
    const rafRef = useRef(null)

    useEffect(() => {
        const cursor = document.querySelector('.custom-cursor')
        const bg = document.querySelector('.mouse-track-bg')

        const handleMouseMove = (e) => {
            // Store mouse position
            cursorRef.current.x = e.clientX
            cursorRef.current.y = e.clientY

            // Update cursor position instantly (no RAF needed for cursor)
            if (cursor) {
                cursor.style.left = e.clientX + 'px'
                cursor.style.top = e.clientY + 'px'
            }

            // Update background gradient position
            if (bg) {
                bg.style.setProperty('--mouse-x', e.clientX + 'px')
                bg.style.setProperty('--mouse-y', e.clientY + 'px')
            }
        }

        const handleMouseDown = () => {
            if (cursor) cursor.classList.add('active')
        }

        const handleMouseUp = () => {
            if (cursor) cursor.classList.remove('active')
        }

        document.addEventListener('mousemove', handleMouseMove, { passive: true })
        document.addEventListener('mousedown', handleMouseDown)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mousedown', handleMouseDown)
            document.removeEventListener('mouseup', handleMouseUp)
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [])

    return (
        <>
            <div className="mouse-track-bg"></div>
            <div className="mouse-track-noise"></div>
            <div className="custom-cursor"></div>
        </>
    )
}

export default MouseTracker
