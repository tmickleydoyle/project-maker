import inquirer from 'inquirer';
import { ConversationManager } from './conversationManager';
import { startNewChat, continueChat } from './prompts';

export async function displayMainMenu() {
  const choices = ['Start New Chat', 'Load Previous Chat', 'Exit'];
  const { choice } = await inquirer.prompt({
    type: 'list',
    name: 'choice',
    message: 'Select an option:',
    choices
  });
  await handleMenuChoice(choice);
}

async function handleMenuChoice(choice: string) {
  switch (choice) {
  case 'Start New Chat':
    console.log('Starting a new chat session...');
    await startNewChat();
    break;
  case 'Load Previous Chat':
    await loadPreviousChat();
    break;
  case 'Exit':
    process.exit(0);
  }
}

async function loadPreviousChat() {
  const chats = ConversationManager.listChats();
  if (chats.length === 0) {
    console.log('No previous chats found.');
    return;
  }
  const { chatName } = await inquirer.prompt({
    type: 'list',
    name: 'chatName',
    message: 'Select a chat to load:',
    choices: chats
  });
  const chatSession = ConversationManager.loadChat(chatName);
  if (chatSession) {
    console.log('Chat session loaded successfully.');
    const filePath = ConversationManager.getChatPath(chatName);
    await continueChat(chatSession, filePath);
  } else {
    console.log('Failed to load chat session.');
  }
}