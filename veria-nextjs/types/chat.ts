export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: Date;
    fileUrl?: string;
}

export interface ChatResponse {
    reply: string;
    error?: string;
}

export interface UploadResponse {
    success: boolean;
    fileUrl: string;
    filename: string;
    originalname: string;
    mimetype: string;
    size: number;
    error?: string;
}
