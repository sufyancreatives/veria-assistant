import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './ThreeBackground.css'

function ThreeBackground() {
    const canvasRef = useRef(null)
    const mouseRef = useRef({ x: 0, y: 0 })

    useEffect(() => {
        if (!canvasRef.current) return

        // Scene setup
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            alpha: true,
            antialias: true
        })

        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        camera.position.z = 5

        // Create galaxy with multiple star layers
        const createStarLayer = (count, size, spread, colors) => {
            const geometry = new THREE.BufferGeometry()
            const positions = new Float32Array(count * 3)
            const colorArray = new Float32Array(count * 3)

            for (let i = 0; i < count * 3; i += 3) {
                // Spiral galaxy distribution
                const radius = Math.random() * spread
                const angle = Math.random() * Math.PI * 2
                const height = (Math.random() - 0.5) * spread * 0.3

                positions[i] = Math.cos(angle) * radius
                positions[i + 1] = height
                positions[i + 2] = Math.sin(angle) * radius

                // Random cosmic colors
                const color = colors[Math.floor(Math.random() * colors.length)]
                colorArray[i] = color.r
                colorArray[i + 1] = color.g
                colorArray[i + 2] = color.b
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
            geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3))

            const material = new THREE.PointsMaterial({
                size: size,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true
            })

            return new THREE.Points(geometry, material)
        }

        // Galaxy color palette
        const coreColors = [
            { r: 0.9, g: 0.7, b: 1.0 },  // Bright purple
            { r: 0.6, g: 0.8, b: 1.0 },  // Bright blue
            { r: 1.0, g: 0.8, b: 0.9 }   // Pink
        ]

        const outerColors = [
            { r: 0.4, g: 0.5, b: 0.9 },  // Deep blue
            { r: 0.6, g: 0.4, b: 0.8 },  // Purple
            { r: 0.3, g: 0.6, b: 0.8 }   // Cyan
        ]

        const distantColors = [
            { r: 0.5, g: 0.5, b: 0.7 },  // Dim blue
            { r: 0.6, g: 0.6, b: 0.8 },  // Lavender
            { r: 0.4, g: 0.4, b: 0.6 }   // Dim purple
        ]

        // Create multiple star layers for depth
        const galaxyCore = createStarLayer(150, 0.04, 8, coreColors)
        const galaxyMid = createStarLayer(200, 0.025, 15, outerColors)
        const galaxyOuter = createStarLayer(300, 0.015, 25, distantColors)

        scene.add(galaxyCore)
        scene.add(galaxyMid)
        scene.add(galaxyOuter)

        // Mouse tracking
        const handleMouseMove = (event) => {
            // Normalize mouse position to -1 to 1 range
            mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
            mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
        }

        document.addEventListener('mousemove', handleMouseMove, { passive: true })

        // Animation loop
        let animationId
        const targetRotation = { x: 0, y: 0 }

        function animate() {
            animationId = requestAnimationFrame(animate)

            // Calculate target rotation based on mouse position
            targetRotation.x = mouseRef.current.y * 0.3
            targetRotation.y = mouseRef.current.x * 0.3

            // Smooth interpolation (lerp) for natural movement
            const lerpFactor = 0.05

            // Rotate galaxy layers at different speeds with mouse influence
            galaxyCore.rotation.x += (targetRotation.x - galaxyCore.rotation.x) * lerpFactor + 0.0001
            galaxyCore.rotation.y += (targetRotation.y - galaxyCore.rotation.y) * lerpFactor + 0.0002

            galaxyMid.rotation.x += (targetRotation.x * 0.7 - galaxyMid.rotation.x) * lerpFactor + 0.00008
            galaxyMid.rotation.y += (targetRotation.y * 0.7 - galaxyMid.rotation.y) * lerpFactor + 0.00015

            galaxyOuter.rotation.x += (targetRotation.x * 0.5 - galaxyOuter.rotation.x) * lerpFactor + 0.00005
            galaxyOuter.rotation.y += (targetRotation.y * 0.5 - galaxyOuter.rotation.y) * lerpFactor + 0.0001

            renderer.render(scene, camera)
        }
        animate()

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        }
        window.addEventListener('resize', handleResize)

        // Cleanup
        return () => {
            cancelAnimationFrame(animationId)
            document.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('resize', handleResize)
            galaxyCore.geometry.dispose()
            galaxyCore.material.dispose()
            galaxyMid.geometry.dispose()
            galaxyMid.material.dispose()
            galaxyOuter.geometry.dispose()
            galaxyOuter.material.dispose()
            renderer.dispose()
        }
    }, [])

    return <canvas ref={canvasRef} className="three-bg-canvas" />
}

export default ThreeBackground
