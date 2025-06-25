import { MODELS } from "@/agent/models/models";
import type { ModelType } from "../agent/Agent";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

type State = {
  choiseThreshold: number;
  maxGenerationAttempts: number;
  actorModels: ModelType[];
  criticModels: ModelType[];
};

type Actions = {
  setChoiseThreshold: (choiseThreshold: number) => void;
  setMaxGenerationAttempts: (maxGenerationAttempts: number) => void;
  setActorModels: (actorModels: ModelType[]) => void;
  setCriticModels: (criticModels: ModelType[]) => void;
};

const defaultState: State = {
  choiseThreshold: 51,
  maxGenerationAttempts: 3,
  actorModels: [
    {
      name: uuidv4(),
      model: MODELS.xai.grok_3,
      temperature: 0.2,
    },
    {
      name: uuidv4(),
      model: MODELS.openai.gpt_4o,
      temperature: 0.5,
    },
    {
      name: uuidv4(),
      model: MODELS.google.gemini_2_5_flash,
      temperature: 0.8,
    },
  ],
  criticModels: [
    {
      name: uuidv4(),
      model: MODELS.deepseek.deepseek_chat_v3_0324,
      temperature: 0.2,
    },
    {
      name: uuidv4(),
      model: MODELS.anthropic.claude_3_7_sonnet,
      temperature: 0.5,
    },
  ],
};

export const config = create<State & Actions>()(
  persist(
    (set) => ({
      ...defaultState,
      setChoiseThreshold: (choiseThreshold: number) => set({ choiseThreshold }),
      setMaxGenerationAttempts: (maxGenerationAttempts: number) =>
        set({ maxGenerationAttempts }),
      setActorModels: (actorModels: ModelType[]) => set({ actorModels }),
      setCriticModels: (criticModels: ModelType[]) => set({ criticModels }),
    }),
    {
      name: "config2",
    }
  )
);
