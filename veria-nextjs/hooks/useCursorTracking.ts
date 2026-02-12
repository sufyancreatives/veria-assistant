'use client';

import { useState, useEffect, useRef, RefObject } from 'react';

interface CursorTrackingOptions {
    maxMovement?: number;
    maxRotation?: number;
    smoothing?: number;
    enabled?: boolean;
}

/**
 * Custom hook for 3D cursor tracking with motion constraints
 * Provides smooth cursor-based transforms for cards and interactive elements
 * Respects prefers-reduced-motion accessibility setting
 */
export function useCursorTracking(options: CursorTrackingOptions = {}) {
    const {
        maxMovement = 6, // Maximum pixel movement (spec: ≤6px)
        maxRotation = 3, // Maximum rotation in degrees (spec: ≤3°)
        smoothing = 0.15, // Smoothing factor for easing
        enabled = true,
    } = options;

    const elementRef = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
    const animationFrameRef = useRef<number | null>(null);
    const targetRef = useRef({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
    const currentRef = useRef({ x: 0, y: 0, rotateX: 0, rotateY: 0 });

    useEffect(() => {
        // Check for reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const prefersReducedMotion = mediaQuery.matches;

        if (prefersReducedMotion || !enabled || !elementRef.current) {
            return;
        }

        const element = elementRef.current;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate relative position (-1 to 1)
            const relativeX = (e.clientX - centerX) / (rect.width / 2);
            const relativeY = (e.clientY - centerY) / (rect.height / 2);

            // Apply constraints and calculate transforms
            targetRef.current = {
                x: Math.max(-maxMovement, Math.min(maxMovement, relativeX * maxMovement)),
                y: Math.max(-maxMovement, Math.min(maxMovement, relativeY * maxMovement)),
                rotateX: Math.max(-maxRotation, Math.min(maxRotation, -relativeY * maxRotation)),
                rotateY: Math.max(-maxRotation, Math.min(maxRotation, relativeX * maxRotation)),
            };
        };

        const handleMouseLeave = () => {
            // Reset to center when mouse leaves
            targetRef.current = { x: 0, y: 0, rotateX: 0, rotateY: 0 };
        };

        // Smooth animation loop
        const animate = () => {
            const current = currentRef.current;
            const target = targetRef.current;

            // Ease towards target
            current.x += (target.x - current.x) * smoothing;
            current.y += (target.y - current.y) * smoothing;
            current.rotateX += (target.rotateX - current.rotateX) * smoothing;
            current.rotateY += (target.rotateY - current.rotateY) * smoothing;

            setTransform({ ...current });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);
        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [enabled, maxMovement, maxRotation, smoothing]);

    return { elementRef, transform };
}

/**
 * Hook for cursor-reactive glow effect
 * Tracks cursor position relative to element for glow positioning
 */
export function useCursorGlow() {
    const elementRef = useRef<HTMLButtonElement>(null);
    const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50, opacity: 0 });

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const prefersReducedMotion = mediaQuery.matches;

        if (prefersReducedMotion || !elementRef.current) {
            return;
        }

        const element = elementRef.current;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = element.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            setGlowPosition({ x, y, opacity: 1 });
        };

        const handleMouseLeave = () => {
            setGlowPosition((prev) => ({ ...prev, opacity: 0 }));
        };

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return { elementRef, glowPosition };
}
