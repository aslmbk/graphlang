import { useStore } from "zustand";
import { config } from "../graph/state/config";
import { ConfigSheet } from "./config/ConfigSheet";

export const AgentConfig = () => {
  const configStore = useStore(config, (state) => state);

  return (
    <ConfigSheet
      maxGenerationAttempts={configStore.maxGenerationAttempts}
      choiseThreshold={configStore.choiseThreshold}
      actorModels={configStore.actorModels}
      criticModels={configStore.criticModels}
      onMaxGenerationAttemptsChange={configStore.setMaxGenerationAttempts}
      onChoiseThresholdChange={configStore.setChoiseThreshold}
      onActorModelsChange={configStore.setActorModels}
      onCriticModelsChange={configStore.setCriticModels}
    />
  );
};
