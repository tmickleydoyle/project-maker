import { logger } from "./logger";
import { executeScript } from "./executor";
import { generateResponse } from "./scriptGenerator";
import { isBashScript } from "./utils";
import { ChatSession } from "./chatSession";
import inquirer from "inquirer";

export async function continueChat(chatSession: ChatSession, filePath: string) {
  while (true) {
    // Display conversation history
    chatSession.conversationHistory.forEach((msg) => {
      console.log(`${msg.role}: ${msg.content}`);
    });

    // Prompt user for new message
    const { userMessage } = await inquirer.prompt({
      type: "input",
      name: "userMessage",
      message: 'Your message (type "exit" to go back):',
    });

    if (userMessage.toLowerCase() === "exit") {
      // Save the chat session and return to main menu
      chatSession.saveToFile(filePath);
      return;
    }

    // Add user's message to conversation history
    chatSession.addMessage({
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    });

    // Generate assistant's response
    let assistantResponse: string;
    try {
      assistantResponse = await generateResponse(chatSession);
    } catch (error) {
      console.error("Error generating response:", error);
      logger.error("Error generating response:", error);
      continue; // or handle as needed
    }

    // Add assistant's response to conversation history
    chatSession.addMessage({
      role: "assistant",
      content: assistantResponse,
      timestamp: new Date(),
    });

    // Check if response contains a bash script
    if (isBashScript(assistantResponse)) {
      // Offer to execute the script
      const { execute } = await inquirer.prompt({
        type: "confirm",
        name: "execute",
        message:
          "The assistant provided a bash script. Do you want to execute it?",
      });
      if (execute) {
        try {
          await executeScript(assistantResponse);
          console.log("Script executed successfully.");
        } catch (error) {
          console.error("Script execution failed:", error);
          logger.error("Script execution failed:", error);
        }
      } else {
        console.log("Script execution aborted.");
      }
    } else {
      // Display the assistant's response
      console.log("Assistant:", assistantResponse);
    }

    // Save the updated chat session
    chatSession.saveToFile(filePath);
  }
}
