import { Button } from "../ui/button";
import { Zap } from "lucide-react";

interface ActionButtonsProps {
  prompt: string;
  isLoading: boolean;
  onSubmit: () => void;
  onClear: () => void;
}

export const ActionButtons = ({
  prompt,
  isLoading,
  onSubmit,
  onClear,
}: ActionButtonsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        onClick={onSubmit}
        disabled={!prompt.trim() || isLoading}
        className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        <Zap className="w-5 h-5 mr-2" />
        {isLoading ? "Generating..." : "Generate"}
      </Button>

      <Button
        variant="outline"
        onClick={onClear}
        disabled={isLoading}
        className="h-12 px-6 border-2 hover:bg-destructive/10 hover:border-destructive/50 transition-all duration-200"
      >
        Clear
      </Button>
    </div>
  );
};
