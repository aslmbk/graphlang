/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatOpenAI } from "@langchain/openai";

export const MODELS = {
  openai: {
    gpt_3_5_turbo: "openai/gpt-3.5-turbo",
    gpt_4o: "openai/chatgpt-4o-latest",
    o1: "openai/o1",
    gpt_4_1: "openai/gpt-4.1",
  },
  anthropic: {
    claude_opus_4: "anthropic/claude-opus-4",
    claude_sonnet_4: "anthropic/claude-sonnet-4",
    claude_3_7_sonnet: "anthropic/claude-3.7-sonnet",
  },
  google: {
    gemini_2_5_flash: "google/gemini-2.5-flash",
    gemini_2_5_pro: "google/gemini-2.5-pro",
  },
  xai: {
    grok_3: "x-ai/grok-3",
  },
  deepseek: {
    deepseek_chat_v3_0324: "deepseek/deepseek-chat-v3-0324",
    deepseek_r1_0528: "deepseek/deepseek-r1-0528",
  },
} as const;

const OPENAI_MODELS = Object.values(MODELS.openai);
const ANTHROPIC_MODELS = Object.values(MODELS.anthropic);
const GOOGLE_MODELS = Object.values(MODELS.google);
const XAI_MODELS = Object.values(MODELS.xai);
const DEEPSEEK_MODELS = Object.values(MODELS.deepseek);

type GetObjectValue<T> = T extends { [key: string]: infer U }
  ? U extends object
    ? GetObjectValue<U>
    : U
  : never;

type ModelName = GetObjectValue<typeof MODELS>;

export const getChatModel = (model: ModelName, temperature: number) => {
  if (OPENAI_MODELS.includes(model as any)) {
    return new ChatOpenAI({
      model,
      temperature,
      openAIApiKey: import.meta.env.VITE_API_KEY,
      configuration: {
        baseURL: import.meta.env.VITE_API_URL,
      },
    });
  }
  if (ANTHROPIC_MODELS.includes(model as any)) {
    return new ChatOpenAI({
      model,
      temperature,
      openAIApiKey: import.meta.env.VITE_API_KEY,
      configuration: {
        baseURL: import.meta.env.VITE_API_URL,
      },
    });
    // return new ChatAnthropic({
    //   model,
    //   temperature,
    //   anthropicApiKey: import.meta.env.VITE_API_KEY,
    //   clientOptions: {
    //     baseURL: import.meta.env.VITE_API_URL,
    //   },
    // });
  }
  if (GOOGLE_MODELS.includes(model as any)) {
    // return new ChatGoogleGenerativeAI({
    //   model,
    //   temperature,
    //   apiKey: import.meta.env.VITE_API_KEY,
    //   baseUrl: "http://localhost:5173/api/openrouter",
    // });
    return new ChatOpenAI({
      model,
      temperature,
      openAIApiKey: import.meta.env.VITE_API_KEY,
      configuration: {
        baseURL: import.meta.env.VITE_API_URL,
      },
    });
  }
  if (XAI_MODELS.includes(model as any)) {
    // return new ChatGroq({
    //   model,
    //   temperature,
    //   apiKey: import.meta.env.VITE_API_KEY,
    //   baseUrl: import.meta.env.VITE_API_URL,
    // });
    return new ChatOpenAI({
      model,
      temperature,
      openAIApiKey: import.meta.env.VITE_API_KEY,
      configuration: {
        baseURL: import.meta.env.VITE_API_URL,
      },
    });
  }
  if (DEEPSEEK_MODELS.includes(model as any)) {
    // return new ChatDeepSeek({
    //   model,
    //   temperature,
    //   apiKey: import.meta.env.VITE_API_KEY,
    //   // openAIApiKey: import.meta.env.VITE_API_KEY,
    //   configuration: {
    //     baseURL: import.meta.env.VITE_API_URL,
    //   },
    // });
    return new ChatOpenAI({
      model,
      temperature,
      openAIApiKey: import.meta.env.VITE_API_KEY,
      configuration: {
        baseURL: import.meta.env.VITE_API_URL,
      },
    });
  }
  throw new Error(`Model ${model} not found`);
};
