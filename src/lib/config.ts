/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AgentConfig, ModelType } from "./types";
import { generateRandomName, MODEL_PROVIDERS } from "./types";
import { MODELS } from "../agent/models/models";

const CONFIG_STORAGE_KEY = "agent-config";

export const getDefaultConfig = (): AgentConfig => {
  // Генерируем 3 случайных актора
  const actorModels: ModelType[] = [];
  const usedModels = new Set<string>();

  for (let i = 0; i < 3; i++) {
    let modelKey: string;
    let providerKey: string;

    do {
      const provider =
        MODEL_PROVIDERS[Math.floor(Math.random() * MODEL_PROVIDERS.length)];
      providerKey = provider.name;
      const modelKeys = Object.keys(provider.models);
      modelKey = modelKeys[Math.floor(Math.random() * modelKeys.length)];
    } while (usedModels.has(`${providerKey}/${modelKey}`));

    usedModels.add(`${providerKey}/${modelKey}`);

    const modelValue = (MODELS as any)[providerKey]?.[modelKey];
    if (modelValue) {
      actorModels.push({
        id: crypto.randomUUID(),
        name: generateRandomName(),
        model: modelValue,
        temperature: 0.5,
      });
    }
  }

  // Генерируем 3 случайных критика
  const criticModels: ModelType[] = [];
  usedModels.clear();

  for (let i = 0; i < 3; i++) {
    let modelKey: string;
    let providerKey: string;

    do {
      const provider =
        MODEL_PROVIDERS[Math.floor(Math.random() * MODEL_PROVIDERS.length)];
      providerKey = provider.name;
      const modelKeys = Object.keys(provider.models);
      modelKey = modelKeys[Math.floor(Math.random() * modelKeys.length)];
    } while (usedModels.has(`${providerKey}/${modelKey}`));

    usedModels.add(`${providerKey}/${modelKey}`);

    const modelValue = (MODELS as any)[providerKey]?.[modelKey];
    if (modelValue) {
      criticModels.push({
        id: crypto.randomUUID(),
        name: generateRandomName(),
        model: modelValue,
        temperature: 0.5,
      });
    }
  }

  return {
    maxGenerationAttempts: 3,
    choiseThreshold: 51,
    actorModels,
    criticModels,
  };
};

export const loadConfig = (): AgentConfig => {
  try {
    const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (stored) {
      const config = JSON.parse(stored);
      if (
        config.maxGenerationAttempts &&
        config.choiseThreshold &&
        Array.isArray(config.actorModels) &&
        Array.isArray(config.criticModels)
      ) {
        return config;
      }
    }
  } catch (error) {
    console.warn("Failed to load config from localStorage:", error);
  }

  return getDefaultConfig();
};

export const saveConfig = (config: AgentConfig): void => {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error("Failed to save config to localStorage:", error);
  }
};

export const getModelDisplayName = (modelPath: string): string => {
  const [provider, model] = modelPath.split("/");
  const providerData = MODEL_PROVIDERS.find((p) => p.name === provider);
  if (providerData && providerData.models[model]) {
    return `${providerData.displayName} - ${providerData.models[model]}`;
  }
  return modelPath;
};

export const getProviderDisplayName = (modelPath: string): string => {
  const [provider] = modelPath.split("/");
  const providerData = MODEL_PROVIDERS.find((p) => p.name === provider);
  return providerData?.displayName || provider;
};
