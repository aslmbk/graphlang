import { AgentConfig } from "../AgentConfig";
import { PromptInput } from "./PromptInput";
import { ActionButtons } from "./ActionButtons";
import { HelpText } from "./HelpText";
import { ActorsResponses } from "./ActorsResponses";
import { CriticsGenerationIndicator } from "./CriticsGenerationIndicator";

type Response = {
  payload: string;
  generation: boolean;
  chosen: boolean;
  votes: number;
};

interface ChatContainerProps {
  prompt: string;
  responses: Record<string, Response>;
  isCriticsGeneration: boolean;
  onPromptChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSubmit: () => void;
  onClear: () => void;
}

export const ChatContainer = ({
  prompt,
  responses,
  isCriticsGeneration,
  onPromptChange,
  onKeyPress,
  onSubmit,
  onClear,
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
        isLoading={false}
        onSubmit={onSubmit}
        onClear={onClear}
      />

      {/* Блок ответов акторов */}
      <ActorsResponses responses={responses} />

      {/* Индикатор генерации критиков */}
      {isCriticsGeneration && <CriticsGenerationIndicator />}

      {/* Дополнительная информация */}
      <HelpText />
    </div>
  );
};
