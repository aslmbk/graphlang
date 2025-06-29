// import { tool } from "@langchain/core/tools";
// import { z } from "zod";
// import { fal } from "@fal-ai/client";
// import { ChatOpenAI } from "@langchain/openai";
// import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
// import {
//   ChatPromptTemplate,
//   MessagesPlaceholder,
// } from "@langchain/core/prompts";

// const imageGenerationSchema = z.object({
//   prompt: z.string().describe("The prompt to generate an image"),
// });

// const imageGenerationTool = tool(
//   async ({ prompt }: z.infer<typeof imageGenerationSchema>) => {
//     const result = await fal.subscribe("fal-ai/flux/dev", {
//       input: { prompt },
//     });
//     console.log("result", result);
//     return result.data.images[0].url;
//   },
//   {
//     name: "imageGeneration",
//     description:
//       "Generate an image using fal.ai. Send the prompt to generate an image.",
//     schema: imageGenerationSchema,
//   }
// );

// const llm = new ChatOpenAI({
//   modelName: "openai/gpt-4o",
//   temperature: 0,
//   openAIApiKey: import.meta.env.VITE_API_KEY,
//   configuration: {
//     baseURL: import.meta.env.VITE_API_URL,
//   },
// });

// const prompt = ChatPromptTemplate.fromMessages([
//   ["system", "You are a helpful assistant that can generate images."],
//   ["user", "{input}"],
//   new MessagesPlaceholder("agent_scratchpad"),
// ]);

// const agent = await createOpenAIToolsAgent({
//   llm,
//   tools: [imageGenerationTool],
//   prompt,
// });

// const executor = new AgentExecutor({
//   agent,
//   tools: [imageGenerationTool],
// });

// export { executor };
