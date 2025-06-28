import { useState, useEffect, useCallback, useMemo } from "react";
import { config } from "./graph/state/config";
import { useStore } from "zustand";
import { MainLayout } from "./components/layout/MainLayout";
import { ChatContainer } from "./components/chat/ChatContainer";
import { state } from "./lib/state";
import type { Payload } from "./graph/state/state";
import graph from "./graph";

export const App = () => {
  const [prompt, setPrompt] = useState("");
  const [criticsGeneration, setCriticsGeneration] = useState<
    Record<string, boolean>
  >({});
  const responses = useStore(state, (state) => state.responses);

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
      graph.invoke(prompt).catch((error) => {
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

    graph.events.on("actor-generation", actorGenerationCallback);
    graph.events.on("critic-generation", criticGenerationCallback);
    graph.events.on("actor-response", actorResponseCallback);
    graph.events.on("critic-response", criticResponseCallback);
    graph.events.on("choise", choiseCallback);
    graph.events.on("regeneration-node", regenerationCallback);

    config.subscribe(clearResponses);
    config.setState({});

    return () => {
      graph.events.off("actor-generation", actorGenerationCallback);
      graph.events.off("critic-generation", criticGenerationCallback);
      graph.events.off("actor-response", actorResponseCallback);
      graph.events.off("critic-response", criticResponseCallback);
      graph.events.off("choise", choiseCallback);
      graph.events.off("regeneration-node", regenerationCallback);
    };
  }, [clearResponses]);

  const isCriticsGeneration = useMemo(() => {
    return Object.values(criticsGeneration).some((value) => value);
  }, [criticsGeneration]);

  const handleGetFeedback = useCallback((actorName: string) => {
    return graph.getActorFeedback(actorName);
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
