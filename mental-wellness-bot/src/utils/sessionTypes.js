// Session templates for different conversation types
export const SESSION_TYPES = {
    REFLECTION: {
        id: 'reflection',
        name: 'Reflection Session',
        icon: '',
        color: '#8b5cf6',
        systemPrompt: `Focus on helping the user reflect deeply on their thoughts, feelings, and experiences. Ask thoughtful questions that encourage self-awareness and personal insights. Use gentle prompts like "What does that mean to you?" or "How does that make you feel?"`
    },
    ANXIETY: {
        id: 'anxiety',
        name: 'Anxiety Talk',
        icon: '',
        color: '#22d3ee',
        systemPrompt: `Provide calm, grounding support for anxiety. Offer breathing exercises, cognitive reframing techniques, and reassurance. Help the user identify triggers and develop coping strategies. Be patient and understanding.`
    },
    DAILY_CHECKIN: {
        id: 'daily-checkin',
        name: 'Daily Check-in',
        icon: '',
        color: '#fbbf24',
        systemPrompt: `Guide a brief daily wellness check-in. Ask about mood, sleep, energy levels, and any challenges. Celebrate small wins and provide encouragement. Keep responses concise and supportive.`
    },
    WELLNESS_GOALS: {
        id: 'wellness-goals',
        name: 'Wellness Goals',
        icon: '',
        color: '#34d399',
        systemPrompt: `Help the user set, track, and achieve mental wellness goals. Use SMART goal framework. Provide accountability, celebrate progress, and help adjust goals as needed. Focus on sustainable, realistic goals.`
    },
    STRESS_MANAGEMENT: {
        id: 'stress-management',
        name: 'Stress Management',
        icon: '',
        color: '#f472b6',
        systemPrompt: `Provide practical stress management techniques including mindfulness, time management, boundary setting, and relaxation strategies. Help identify stress sources and develop healthy coping mechanisms.`
    },
    GENERAL: {
        id: 'general',
        name: 'General Chat',
        icon: '',
        color: '#a78bfa',
        systemPrompt: `Provide general emotional support and wellness conversation. Be flexible and adapt to whatever the user needs to discuss.`
    }
}

export const getChatHistory = () => [
    {
        id: '1',
        type: SESSION_TYPES.REFLECTION.id,
        title: 'Reflection Session',
        timestamp: '2 hours ago',
        preview: 'Thinking about personal growth...'
    },
    {
        id: '2',
        type: SESSION_TYPES.ANXIETY.id,
        title: 'Anxiety Talk',
        timestamp: 'Yesterday',
        preview: 'Managing work stress...'
    },
    {
        id: '3',
        type: SESSION_TYPES.DAILY_CHECKIN.id,
        title: 'Daily Check-in',
        timestamp: '2 days ago',
        preview: 'Morning wellness check...'
    },
    {
        id: '4',
        type: SESSION_TYPES.WELLNESS_GOALS.id,
        title: 'Wellness Goals',
        timestamp: '3 days ago',
        preview: 'Setting meditation goals...'
    },
    {
        id: '5',
        type: SESSION_TYPES.STRESS_MANAGEMENT.id,
        title: 'Stress Management',
        timestamp: '5 days ago',
        preview: 'Learning breathing techniques...'
    }
]

export const getWelcomeMessage = (sessionType) => {
    const type = SESSION_TYPES[sessionType.toUpperCase()] || SESSION_TYPES.GENERAL

    const welcomeMessages = {
        reflection: "Welcome to your Reflection Session\n\nTake a moment to pause and reflect. I'm here to help you explore your thoughts and feelings. What's on your mind today?",
        anxiety: "Welcome to Anxiety Support\n\nTake a deep breath... You're safe here. Let's work through this together. How are you feeling right now?",
        'daily-checkin': "Good to see you!\n\nLet's check in on how you're doing today. On a scale of 1-10, how would you rate your mood and energy?",
        'wellness-goals': "Wellness Goals Session\n\nLet's work on your mental wellness goals together. What would you like to focus on today?",
        'stress-management': "Stress Management\n\nI'm here to help you manage stress and find calm. What's causing you stress right now?",
        general: "Hello! I'm VERIA ASSISTANT, your wellness companion.\n\nI'm here to listen and support you. How are you feeling today?"
    }

    return welcomeMessages[type.id] || welcomeMessages.general
}
