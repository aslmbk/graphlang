import { ChatOpenAI } from "@langchain/openai";
import { Model } from "../graph/Model";
import { MODELS } from "./types";
import { SystemMessage, AIMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { Runnable, RunnableSequence } from "@langchain/core/runnables";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { formatToOpenAIToolMessages } from "langchain/agents/format_scratchpad/openai_tools";
import { OpenAIToolsAgentOutputParser } from "langchain/agents/openai/output_parser";
import { AgentExecutor } from "langchain/agents";

type OpenAICriticParams = {
  name: string;
  model: MODELS;
  temperature: number;
};

const toolSchema = z.object({
  choice: z.string().describe("The name of the model that you choose."),
  pros: z
    .array(
      z.object({
        name: z.string().describe("The name of the current model."),
        pro: z.string().describe("The pro of the current model."),
      })
    )
    .describe("The pros for each model answer that you got."),
  cons: z
    .array(
      z.object({
        name: z.string().describe("The name of the current model."),
        con: z.string().describe("The con of the current model."),
      })
    )
    .describe("The cons for each model answer that you got."),
});

export class OpenAICritic extends Model {
  protected model: ChatOpenAI;
  private chain: Runnable;

  private _error: boolean = false;
  public result: z.infer<typeof toolSchema> | null = null;

  constructor(params: OpenAICriticParams) {
    super(params);
    this.model = new ChatOpenAI({
      model: params.model,
      temperature: params.temperature,
      openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
    });

    const tools = [this.getTool()];
    const prompt = ChatPromptTemplate.fromMessages([
      new SystemMessage(`You are an Assistant who helps to choose the best ai answer from several options.
You must choose the one you like the most.
You should also leave a comment with the pros and cons of each option.
For example.
Human: "Write a function that adds 2 numbers in Typescript".
modelName1: "function sum(num1: number, num2: number) {{
    return num1 + num2;
}}".
modelName2: "function sum(num1: number, num2: number) {{
    const result = num1 + num2;
    return result;
}}".
Assistant: "modelName1.
Pros for modelName1: It is easy to understand, short and concise.
Cons for modelName1: It can be difficult to debug.
Pros for modelName2: It is easy to debug.
Cons for modelName2: There is extra variables that can be bypassed."`),
      ["human", "{input}"],
      new MessagesPlaceholder("agent_scratchpad"),
    ]);

    const llmWithTools = this.model.bindTools(tools);

    const runnableAgent = RunnableSequence.from([
      {
        input: (i) => i.input,
        agent_scratchpad: (i) => formatToOpenAIToolMessages(i.steps),
      },
      prompt,
      llmWithTools,
      new OpenAIToolsAgentOutputParser(),
    ]).withConfig({ runName: "OpenAIToolsAgent" });

    this.chain = AgentExecutor.fromAgentAndTools({
      agent: runnableAgent,
      tools,
    });
  }

  public async call(prompt: string) {
    try {
      const response = await this.chain.invoke({
        input: prompt,
      });
      this._error = false;
      return response.output;
    } catch (error) {
      this._error = true;
      console.error(error);
      return new AIMessage(
        `I'm sorry, I'm having trouble generating a response. Please try again. ${error}`
      );
    }
  }

  public async generateResponse(
    prompt: string,
    options: { name: string; option: string }[]
  ) {
    const message = `
    Human: ${prompt}
    ${options.map((option) => `${option.name}: ${option.option}`).join("\n")}
    `;
    this.result = null;
    return await this.call(message);
  }

  public get error() {
    return this._error;
  }

  private getTool() {
    return tool(
      async ({ choice, pros, cons }) => {
        this.result = { choice, pros, cons };
        return `I have chosen the model ${choice}.
        ${pros.map((pro) => `Pros for ${pro.name}: ${pro.pro}`).join("\n")}
        ${cons.map((con) => `Cons for ${con.name}: ${con.con}`).join("\n")}
        `;
      },
      {
        name: "judge",
        description: `This tool is used to judge the best model from the options.
You get several options and you must choose the one you like the most.
You should also leave a comment with the pros and cons of each option.
Even if you don't see any pros for an option, you should still leave any comment, (for example "None"). It is true for cons too.
For example.
Human: "Write a function that adds 2 numbers in Typescript".
modelName1: "function sum(num1: number, num2: number) {{
    return num1 + num2;
}}".
modelName2: "function sum(num1: number, num2: number) {{
    const result = num1 + num2;
    return result;
}}".
Assistant: "modelName1.
Pros for modelName1: It is easy to understand, short and concise.
Cons for modelName1: It can be difficult to debug.
Pros for modelName2: It is easy to debug.
Cons for modelName2: There is extra variables that can be bypassed."
So the parameters for this tool are:
{{
    "choice": "modelName1",
    "pros": [
        {{
            "name": "modelName1",
            "pro": "It is easy to understand, short and concise."
        }},
        {{
            "name": "modelName2",
            "pro": "It is easy to debug."
        }}
    ],
    "cons": [
        {{
            "name": "modelName1",
            "con": "It can be difficult to debug."
        }},
        {{
            "name": "modelName2",
            "con": "There is extra variables that can be bypassed."
        }}
    ]
}}
        `,
        schema: toolSchema,
      }
    );
  }
}
