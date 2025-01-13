import { displayMainMenu } from './menu';
import * as dotenv from 'dotenv';
import { logger } from './logger';

// Load environment variables
dotenv.config();

// Start the application
(async () => {
  try {
    await displayMainMenu();
    console.log('Main menu exited.');
  } catch (error) {
    logger.error('An error occurred in the main menu:', error);
  }
})();