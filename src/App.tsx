import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Agent, type Payload } from "./agent/Agent";
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
  const responses = useStore(state, (state) => state.responses);

  const agentRef = useRef(new Agent());

  const clearResponses = useCallback(() => {
    const actorModels = config.getState().actorModels;
    const criticModels = config.getState().criticModels;
    const resetResponse = state.getState().resetResponse;
    state.getState().clearResponses();
    actorModels.forEach((model) => {
      resetResponse(model.name);
    });
    setCriticsGeneration({});
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
    const agent = agentRef.current;
    const actorGenerationCallback = ({ payload, name }: Payload<boolean>) => {
      const currentResponse = state.getState().responses[name];
      if (!currentResponse) return;
      state.getState().setResponse(name, {
        ...currentResponse,
        generation: payload,
      });
    };
    const criticGenerationCallback = ({ payload, name }: Payload<boolean>) => {
      setCriticsGeneration((prev) => ({ ...prev, [name]: payload }));
    };
    const actorResponseCallback = ({ payload, name }: Payload<string>) => {
      const currentResponse = state.getState().responses[name];
      if (!currentResponse) return;
      state.getState().setResponse(name, {
        ...currentResponse,
        payload: currentResponse.payload + payload,
      });
    };
    const criticResponseCallback = ({ payload }: Payload<string>) => {
      const currentResponse = state.getState().responses[payload];
      if (!currentResponse) return;
      state.getState().setResponse(payload, {
        ...currentResponse,
        votes: currentResponse.votes + 1,
      });
    };
    const choiseCallback = ({ name }: Payload<string>) => {
      const currentResponse = state.getState().responses[name];
      if (!currentResponse) return;
      state.getState().setResponse(name, {
        ...currentResponse,
        chosen: true,
      });
    };
    const regenerationCallback = () => {
      Object.keys(state.getState().responses).forEach((name) => {
        state.getState().setResponse(name, {
          ...state.getState().responses[name],
          payload: "",
          generation: true,
          chosen: false,
          votes: 0,
        });
      });
    };

    agent.events.on("actor-generation", actorGenerationCallback);
    agent.events.on("critic-generation", criticGenerationCallback);
    agent.events.on("actor-response", actorResponseCallback);
    agent.events.on("critic-response", criticResponseCallback);
    agent.events.on("choise", choiseCallback);
    agent.events.on("regeneration", regenerationCallback);

    return () => {
      agent.events.off("actor-generation", actorGenerationCallback);
      agent.events.off("critic-generation", criticGenerationCallback);
      agent.events.off("actor-response", actorResponseCallback);
      agent.events.off("critic-response", criticResponseCallback);
      agent.events.off("choise", choiseCallback);
      agent.events.off("regeneration", regenerationCallback);
    };
  }, []);

  const isCriticsGeneration = useMemo(() => {
    return Object.values(criticsGeneration).some((value) => value);
  }, [criticsGeneration]);

  const handleGetFeedback = useCallback((actorName: string) => {
    return agentRef.current.getActorFeedback(actorName);
  }, []);

  return (
    <MainLayout>
      <ChatContainer
        prompt={prompt}
        responses={responses}
        isCriticsGeneration={isCriticsGeneration}
        onPromptChange={setPrompt}
        onKeyPress={handleKeyPress}
        onSubmit={handleSubmit}
        onClear={handleClear}
        onGetFeedback={handleGetFeedback}
      />
    </MainLayout>
  );
};
