**WIP**

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

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables in `.env`
4. Run the project: `npm start`

## Usage

The project provides a CLI interface for managing conversations and executing generated scripts. Use the menu system to navigate through different options.
