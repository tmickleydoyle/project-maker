import fs from 'fs';
import { systemMessage } from './utils'

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string;
  timestamp: Date;
}

export class ChatSession {
    conversationHistory: Message[];

    constructor(conversationHistory: Message[] = []) {
        this.conversationHistory = [
            {
                role: 'system',
                content: systemMessage,
                timestamp: new Date()
            },
            ...conversationHistory
        ];
    }

    addMessage(message: Message) {
        this.conversationHistory.push(message);
    }

    saveToFile(filePath: string) {
        fs.writeFileSync(filePath, JSON.stringify(this.conversationHistory, null, 2));
    }

    static loadFromFile(filePath: string): ChatSession | null {
        if (!fs.existsSync(filePath)) {
            return null;
        }
        const data = fs.readFileSync(filePath, 'utf-8');
        const messages: Message[] = JSON.parse(data);
        return new ChatSession(messages);
    }
}