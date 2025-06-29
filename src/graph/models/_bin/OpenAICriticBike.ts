// import { Model } from "@/graph/models/Model";
// import { SystemMessage, AIMessage } from "@langchain/core/messages";
// import { DynamicStructuredTool, tool } from "@langchain/core/tools";
// import { z } from "zod";
// import { Runnable } from "@langchain/core/runnables";
// import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

// type OpenAICriticParams = {
//   name: string;
//   model: BaseChatModel;
//   modelName: string;
// };

// const toolSchema = z.object({
//   choice: z.string().describe("The name of the model that you choose."),
//   pros: z
//     .array(
//       z.object({
//         name: z.string().describe("The name of the current model."),
//         pro: z.string().describe("The pro of the current model."),
//       })
//     )
//     .describe("The pros for each model answer that you got."),
//   cons: z
//     .array(
//       z.object({
//         name: z.string().describe("The name of the current model."),
//         con: z.string().describe("The con of the current model."),
//       })
//     )
//     .describe("The cons for each model answer that you got."),
// });

// export class OpenAICritic extends Model {
//   protected model: Runnable;
//   public modelName: string;
//   private _error: boolean = false;
//   public result: z.infer<typeof toolSchema> | null = null;
//   private tools: DynamicStructuredTool[];

//   constructor(params: OpenAICriticParams) {
//     super(params);
//     this.modelName = params.modelName;
//     this.tools = [this.getTool()];
//     this.model = params.model.bindTools!(this.tools);
//   }

//   public async call(prompt: string) {
//     const systemMessage =
//       new SystemMessage(`You are an Assistant who helps to choose the best ai answer from several options.
// You must choose the one you like the most.
// You should also leave a comment with the pros and cons of each option.
// For example.
// Human: "Write a function that adds 2 numbers in Typescript".
// modelName1: "function sum(num1: number, num2: number) {{
//     return num1 + num2;
// }}".
// modelName2: "function sum(num1: number, num2: number) {{
//     const result = num1 + num2;
//     return result;
// }}".
// Assistant: "modelName1.
// Pros for modelName1: It is easy to understand, short and concise.
// Cons for modelName1: It can be difficult to debug.
// Pros for modelName2: It is easy to debug.
// Cons for modelName2: There is extra variables that can be bypassed."`);

//     this._error = false;
//     try {
//       const response = await this.model.invoke([systemMessage, prompt]);
//       for (const tool_call of response.tool_calls) {
//         for (const tool of this.tools) {
//           if (tool_call.name === tool.name) {
//             tool.invoke(tool_call.args);
//           }
//         }
//       }
//       return response;
//     } catch (error) {
//       this._error = true;
//       console.error(error);
//       return new AIMessage(
//         `I'm sorry, I'm having trouble generating a response. Please try again. ${error}`
//       );
//     }
//   }

//   public async generateResponse(
//     prompt: string,
//     options: { name: string; option: string }[]
//   ) {
//     const message = `
//     Human: ${prompt}
//     ${options.map((option) => `${option.name}: ${option.option}`).join("\n")}
//     `;
//     this.result = null;
//     const response = await this.call(message);
//     return response;
//   }

//   public get error() {
//     return this._error;
//   }

//   private getTool() {
//     return tool(
//       async ({ choice, pros, cons }) => {
//         this.result = { choice, pros, cons };
//         return `I have chosen the model ${choice}.
//         ${pros.map((pro) => `Pros for ${pro.name}: ${pro.pro}`).join("\n")}
//         ${cons.map((con) => `Cons for ${con.name}: ${con.con}`).join("\n")}
//         `;
//       },
//       {
//         name: "judge",
//         description: `This tool is used to judge the best model from the options.
// You get several options and you must choose the one you like the most.
// You should also leave a comment with the pros and cons of each option.
// Even if you don't see any pros for an option, you should still leave any comment, (for example "None"). It is true for cons too.
// For example.
// Human: "Write a function that adds 2 numbers in Typescript".
// modelName1: "function sum(num1: number, num2: number) {{
//     return num1 + num2;
// }}".
// modelName2: "function sum(num1: number, num2: number) {{
//     const result = num1 + num2;
//     return result;
// }}".
// Assistant: "modelName1.
// Pros for modelName1: It is easy to understand, short and concise.
// Cons for modelName1: It can be difficult to debug.
// Pros for modelName2: It is easy to debug.
// Cons for modelName2: There is extra variables that can be bypassed."
// So the parameters for this tool are:
// {{
//     "choice": "modelName1",
//     "pros": [
//         {{
//             "name": "modelName1",
//             "pro": "It is easy to understand, short and concise."
//         }},
//         {{
//             "name": "modelName2",
//             "pro": "It is easy to debug."
//         }}
//     ],
//     "cons": [
//         {{
//             "name": "modelName1",
//             "con": "It can be difficult to debug."
//         }},
//         {{
//             "name": "modelName2",
//             "con": "There is extra variables that can be bypassed."
//         }}
//     ]
// }}`,
//         schema: toolSchema,
//       }
//     );
//   }
// }
