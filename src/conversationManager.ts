import fs from 'fs';
import { ChatSession } from './chatSession';

export class ConversationManager {
  static listChats(): string[] {
    const chatsDir = './conversations';
    if (!fs.existsSync(chatsDir)) {
      fs.mkdirSync(chatsDir);
      return [];
    }
    return fs.readdirSync(chatsDir).filter(file => file.endsWith('.json'));
  }

  static getChatPath(chatName: string): string {
    return `./conversations/${chatName}`;
  }

  static saveChat(chatSession: ChatSession, chatName: string) {
    const filePath = this.getChatPath(chatName);
    chatSession.saveToFile(filePath);
  }

  static loadChat(chatName: string): ChatSession | null {
    const filePath = this.getChatPath(chatName);
    return ChatSession.loadFromFile(filePath);
  }
}