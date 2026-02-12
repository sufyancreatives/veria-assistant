// Chat storage utility using localStorage

const STORAGE_KEY = 'veria_chat_history'

export const saveChat = (chatId, chatData) => {
    try {
        const history = getAllChats()
        history[chatId] = {
            ...chatData,
            lastUpdated: new Date().toISOString()
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
        return true
    } catch (error) {
        console.error('Error saving chat:', error)
        return false
    }
}

export const loadChat = (chatId) => {
    try {
        const history = getAllChats()
        return history[chatId] || null
    } catch (error) {
        console.error('Error loading chat:', error)
        return null
    }
}

export const getAllChats = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : {}
    } catch (error) {
        console.error('Error getting chats:', error)
        return {}
    }
}

export const deleteChat = (chatId) => {
    try {
        const history = getAllChats()
        delete history[chatId]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
        return true
    } catch (error) {
        console.error('Error deleting chat:', error)
        return false
    }
}

export const exportChat = (messages, chatTitle = 'VERIA ASSISTANT Chat') => {
    try {
        const lines = []
        lines.push(`=== ${chatTitle} ===`)
        lines.push(`Exported: ${new Date().toLocaleString()}`)
        lines.push('')
        lines.push('─'.repeat(40))
        lines.push('')

        messages.forEach(msg => {
            if (msg.id === 'welcome') return
            const sender = msg.sender === 'user' ? 'You' : 'VERIA ASSISTANT'
            lines.push(`${sender}:`)
            lines.push(msg.text)
            if (msg.files && msg.files.length > 0) {
                lines.push(`[Attached: ${msg.files.map(f => f.name).join(', ')}]`)
            }
            lines.push('')
        })

        const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `veria-chat-${Date.now()}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        return true
    } catch (error) {
        console.error('Error exporting chat:', error)
        return false
    }
}

export const getChatHistory = () => {
    const chats = getAllChats()
    return Object.keys(chats).map(id => ({
        id,
        ...chats[id]
    })).sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
}
