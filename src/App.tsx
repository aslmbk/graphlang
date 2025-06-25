import { useState, useEffect, useRef, useCallback } from "react";
import { Agent } from "./agent/Agent";
import { config } from "./lib/config";
import { useStore } from "zustand";
import { MainLayout } from "./components/layout/MainLayout";
import { ChatContainer } from "./components/chat/ChatContainer";
import { state } from "./lib/state";

export const App = () => {
  const [prompt, setPrompt] = useState("");
  const [criticsGeneration, setCriticsGeneration] = useState<
    Record<string, boolean>
  >({});
  const configStore = useStore(config, (state) => state);

  const agentRef = useRef(new Agent());

  const clearResponses = useCallback(() => {
    const actorModels = config.getState().actorModels;
    const criticModels = config.getState().criticModels;
    const clearResponse = state.getState().clearResponse;
    actorModels.forEach((model) => {
      clearResponse(model.name);
    });
    criticModels.forEach((model) => {
      setCriticsGeneration((prev) => ({ ...prev, [model.name]: false }));
    });
  }, []);

  const handleClear = () => {
    setPrompt("");
    clearResponses();
  };

  const handleSubmit = () => {
    if (prompt.trim()) {
      agentRef.current.invoke(prompt).catch((error) => {
        console.error("Error:", error);
      });
      handleClear();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    agentRef.current.setMaxGenerationAttempts(
      configStore.maxGenerationAttempts
    );
    agentRef.current.setChoiseThreshold(configStore.choiseThreshold);
    agentRef.current.setActorModels(configStore.actorModels);
    agentRef.current.setCriticModels(configStore.criticModels);

    clearResponses();
  }, [configStore, clearResponses]);

  useEffect(() => {
    const { responses, setResponse } = state.getState();
    agentRef.current.events.on("actor-generation", ({ payload, name }) => {
      const currentResponse = responses[name];
      if (!currentResponse) return;
      setResponse(name, {
        ...currentResponse,
        generation: payload,
      });
    });
    agentRef.current.events.on("critic-generation", ({ payload, name }) => {
      setCriticsGeneration((prev) => ({ ...prev, [name]: payload }));
    });
    agentRef.current.events.on("actor-response", ({ payload, name }) => {
      const currentResponse = responses[name];
      if (!currentResponse) return;
      setResponse(name, {
        ...currentResponse,
        payload,
      });
    });
    agentRef.current.events.on("critic-response", ({ payload }) => {
      const currentResponse = responses[payload];
      if (!currentResponse) return;
      setResponse(payload, {
        ...currentResponse,
        votes: currentResponse.votes + 1,
      });
    });
    agentRef.current.events.on("choise", ({ name }) => {
      const currentResponse = responses[name];
      if (!currentResponse) return;
      setResponse(name, {
        ...currentResponse,
        chosen: true,
      });
    });
  }, []);

  return (
    <MainLayout>
      <ChatContainer
        prompt={prompt}
        response={null}
        isLoading={false}
        onPromptChange={setPrompt}
        onKeyPress={handleKeyPress}
        onSubmit={handleSubmit}
        onClear={handleClear}
        onCloseResponse={() => {}}
      />
    </MainLayout>
  );
};
