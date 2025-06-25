import { AgentConfig } from "../AgentConfig";
import { PromptInput } from "./PromptInput";
import { ActionButtons } from "./ActionButtons";
import { LoadingIndicator } from "./LoadingIndicator";
import { ResponseDisplay } from "./ResponseDisplay";
import { HelpText } from "./HelpText";

interface ChatContainerProps {
  prompt: string;
  response: string | null;
  isLoading: boolean;
  onPromptChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSubmit: () => void;
  onClear: () => void;
  onCloseResponse: () => void;
}

export const ChatContainer = ({
  prompt,
  response,
  isLoading,
  onPromptChange,
  onKeyPress,
  onSubmit,
  onClear,
  onCloseResponse,
}: ChatContainerProps) => {
  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-2xl p-8">
      {/* Кнопка настроек */}
      <div className="flex justify-end mb-6">
        <AgentConfig />
      </div>

      {/* Поле ввода */}
      <PromptInput
        prompt={prompt}
        onPromptChange={onPromptChange}
        onKeyPress={onKeyPress}
      />

      {/* Кнопки */}
      <ActionButtons
        prompt={prompt}
        isLoading={isLoading}
        onSubmit={onSubmit}
        onClear={onClear}
      />

      {/* Блок ответа */}
      {isLoading && <LoadingIndicator />}

      {response && !isLoading && (
        <ResponseDisplay response={response} onClose={onCloseResponse} />
      )}

      {/* Дополнительная информация */}
      <HelpText />
    </div>
  );
};
