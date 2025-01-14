**WIP**

https://github.com/user-attachments/assets/2e59c6e7-a19b-4016-9188-fe33cf59bcba

# Project Maker

A TypeScript-based project that helps manage and execute scripts through a conversation-driven interface.

## Overview

This project provides a structured way to manage conversations, generate scripts, and execute commands through a menu-driven system.

### File structure

```text
project root
├── conversations/     # Stores conversation history
├── src/
│   ├── index.ts      # Main entry point
│   ├── chatSession.ts    # Handles chat interactions
│   ├── conversationManager.ts    # Manages conversation state
│   ├── menu.ts       # CLI menu interface
│   ├── prompts.ts    # System prompts
│   ├── scriptGenerator.ts    # Generates executable scripts
│   ├── executor.ts   # Executes generated scripts
│   └── logger.ts     # Logging utility
├── .env             # Environment variables
├── package.json     # Project dependencies
└── tsconfig.json    # TypeScript configuration
```