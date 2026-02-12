// Chat storage utility using localStorage

const STORAGE_KEY = 'veria_chat_history'

export interface ChatSession {
    id: string;
    title: string;
    messages: any[];
    lastUpdated: string;
    sessionType?: string;
}

export const getAllChats = (): Record<string, ChatSession> => {
    if (typeof window === 'undefined') return {};
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : {}
    } catch (error) {
        console.error('Error getting chats:', error)
        return {}
    }
}

export const saveChat = (chatId: string, chatData: any) => {
    if (typeof window === 'undefined') return false;
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

export const loadChat = (chatId: string) => {
    if (typeof window === 'undefined') return null;
    try {
        const history = getAllChats()
        return history[chatId] || null
    } catch (error) {
        console.error('Error loading chat:', error)
        return null
    }
}


export const deleteChat = (chatId: string) => {
    if (typeof window === 'undefined') return false;
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

export const getSavedChats = () => {
    const chats = getAllChats()
    return Object.keys(chats).map(id => ({
        ...chats[id],
        id
    })).sort((a: any, b: any) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
}
