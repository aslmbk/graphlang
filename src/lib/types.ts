export type ModelType = {
  id: string;
  name: string;
  model: string;
  temperature: number;
};

export type AgentConfig = {
  maxGenerationAttempts: number;
  choiseThreshold: number;
  actorModels: ModelType[];
  criticModels: ModelType[];
};

export type ModelProvider = {
  name: string;
  displayName: string;
  models: {
    [key: string]: string;
  };
};

export const MODEL_PROVIDERS: ModelProvider[] = [
  {
    name: "openai",
    displayName: "OpenAI",
    models: {
      gpt_3_5_turbo: "GPT-3.5 Turbo",
      gpt_4o: "GPT-4o",
      o1: "O1",
      gpt_4_1: "GPT-4.1",
    },
  },
  {
    name: "anthropic",
    displayName: "Anthropic",
    models: {
      claude_opus_4: "Claude Opus 4",
      claude_sonnet_4: "Claude Sonnet 4",
      claude_3_7_sonnet: "Claude 3.7 Sonnet",
    },
  },
  {
    name: "google",
    displayName: "Google",
    models: {
      gemini_2_5_flash: "Gemini 2.5 Flash",
      gemini_2_5_pro: "Gemini 2.5 Pro",
    },
  },
  {
    name: "xai",
    displayName: "xAI",
    models: {
      grok_3: "Grok 3",
    },
  },
  {
    name: "deepseek",
    displayName: "DeepSeek",
    models: {
      deepseek_chat_v3_0324: "DeepSeek Chat v3",
      deepseek_r1_0528: "DeepSeek R1",
    },
  },
];

export const generateRandomName = () => {
  const adjectives = [
    "Быстрый",
    "Умный",
    "Творческий",
    "Логичный",
    "Аналитический",
    "Интуитивный",
    "Системный",
    "Гибкий",
    "Надежный",
    "Эффективный",
    "Мудрый",
    "Опытный",
    "Профессиональный",
    "Квалифицированный",
    "Экспертный",
  ];
  const nouns = [
    "Аналитик",
    "Мыслитель",
    "Советник",
    "Эксперт",
    "Консультант",
    "Специалист",
    "Профессионал",
    "Мастер",
    "Гуру",
    "Мудрец",
    "Стратег",
    "Планировщик",
    "Координатор",
    "Организатор",
    "Руководитель",
  ];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${adjective} ${noun}`;
};
