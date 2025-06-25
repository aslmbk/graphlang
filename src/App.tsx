import { useState, useEffect, useRef } from "react";
import { Agent } from "./agent/Agent";
import { config } from "./lib/config";
import { useStore } from "zustand";
import { MainLayout } from "./components/layout/MainLayout";
import { ChatContainer } from "./components/chat/ChatContainer";

export const App = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const configStore = useStore(config, (state) => state);

  const agentRef = useRef(new Agent());

  // Применяем конфигурацию к агенту
  useEffect(() => {
    agentRef.current.setMaxGenerationAttempts(
      configStore.maxGenerationAttempts
    );
    agentRef.current.setChoiseThreshold(configStore.choiseThreshold);
    agentRef.current.setActorModels(configStore.actorModels);
    agentRef.current.setCriticModels(configStore.criticModels);
  }, [configStore]);

  const handleSubmit = () => {
    if (prompt.trim()) {
      setIsLoading(true);
      agentRef.current
        .invoke(prompt)
        .then((response) => {
          setResponse(response.choise);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setResponse("Error бах цо");
          setIsLoading(false);
        });
      setPrompt("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClear = () => setPrompt("");
  const handleCloseResponse = () => setResponse(null);

  return (
    <MainLayout>
      <ChatContainer
        prompt={prompt}
        response={response}
        isLoading={isLoading}
        onPromptChange={setPrompt}
        onKeyPress={handleKeyPress}
        onSubmit={handleSubmit}
        onClear={handleClear}
        onCloseResponse={handleCloseResponse}
      />
    </MainLayout>
  );
};
