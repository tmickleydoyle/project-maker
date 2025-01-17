import fs from "fs";
import { exec } from "child_process";
import inquirer from "inquirer";
import { logger } from "./logger";

import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.API_KEY,
});

// export async function executeScript(script: string): Promise<void> {
export async function executeScript(script: string): Promise<void> {
  // Extract bash code blocks
  const bashScripts =
    script
      .match(/```bash\n([\s\S]*?)```/g)
      ?.map((block) => block.replace(/```bash\n/, "").replace(/```$/, "")) ||
    [];

  if (bashScripts.length === 0) {
    console.log("No bash scripts found.");
    return;
  }

  // Write each script to a separate file
  const scriptFiles = bashScripts.map((script, index) => {
    const scriptPath = `script_${index}.sh`;
    fs.writeFileSync(scriptPath, script);
    fs.chmodSync(scriptPath, 0o755);
    return { path: scriptPath, content: script };
  });

  const confirm = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: `WARNING: About to execute ${scriptFiles.length} bash script(s). Proceed? (y/n)`,
    },
  ]);

  if (!confirm.confirm) {
    console.log("Script execution aborted.");
    return;
  }

  // Execute scripts sequentially
  try {
    for (const scriptFile of scriptFiles) {
      let attempts = 0;
      let success = false;
      let currentScript = scriptFile.content;

      while (!success && attempts < 3) {
        try {
          await new Promise((resolve, reject) => {
            console.log(
              `Executing ${scriptFile.path} (Attempt ${attempts + 1}/3)...`,
            );
            const process = exec(`./${scriptFile.path}`, {
              maxBuffer: 1024 * 1024 * 10,
            });

            process.stdout?.on("data", (data) => {
              console.log(data.toString());
            });

            process.stderr?.on("data", (data) => {
              console.error(data.toString());
            });

            process.on("exit", (code) => {
              if (code === 0) {
                success = true;
                resolve(undefined);
              } else {
                reject(new Error(`Script exited with code ${code}`));
              }
            });
          });
        } catch (error) {
          attempts++;
          if (attempts < 3) {
            console.log(`Script failed. Requesting AI assistance...`);
            const completion = await openai.chat.completions.create({
              messages: [
                {
                  role: "system",
                  content:
                    "You are a bash script debugging assistant. Fix the script based on the error message. ",
                },
                {
                  role: "user",
                  content: `This bash script failed:\n${currentScript}\n\nError: ${error}\n\nPlease provide a fixed version from the location of a the failure. Do not worry about the previous successful commands.`,
                },
              ],
              model: "deepseek-chat",
            });

            currentScript = completion.choices[0].message.content ?? "";
            fs.writeFileSync(scriptFile.path, currentScript);
            console.log("Updated script with AI suggestions. Retrying...");
          } else {
            throw new Error(`Script failed after 3 attempts: ${error}`);
          }
        }
      }
    }
  } finally {
    // Cleanup temporary script files
    scriptFiles.forEach((file) => fs.unlinkSync(file.path));
  }
}
