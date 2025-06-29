import { useState, useEffect } from "react";
import { config } from "./graph/state/config";
import { MainLayout } from "./components/layout/MainLayout";
import { ChatContainer } from "./components/chat/ChatContainer";
import { textGen } from "./graph";

export const App = () => {
  const [prompt, setPrompt] = useState("");

  const handleClear = () => {
    setPrompt("");
  };

  const handleSubmit = () => {
    if (prompt.trim()) {
      textGen.invoke(prompt).catch((error) => {
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
    config.setState({});
  }, []);

  return (
    <MainLayout>
      <ChatContainer
        prompt={prompt}
        onPromptChange={setPrompt}
        onKeyPress={handleKeyPress}
        onSubmit={handleSubmit}
        onClear={handleClear}
      />
    </MainLayout>
  );
};
