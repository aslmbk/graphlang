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
