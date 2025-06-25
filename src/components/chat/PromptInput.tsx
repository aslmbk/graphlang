import { Input } from "../ui/input";

interface PromptInputProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const PromptInput = ({
  prompt,
  onPromptChange,
  onKeyPress,
}: PromptInputProps) => {
  return (
    <div className="mb-6">
      <label
        htmlFor="prompt-input"
        className="block text-sm font-medium text-foreground mb-2"
      >
        Промпт язйе
      </label>
      <Input
        id="prompt-input"
        type="text"
        placeholder="Масала: Жопдоцу безамах лаьцна мог1анаш дазде..."
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        onKeyPress={onKeyPress}
        className="h-12 text-base placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
      />
    </div>
  );
};
