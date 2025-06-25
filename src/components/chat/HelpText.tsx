import { Info } from "lucide-react";

export const HelpText = () => {
  return (
    <div className="mt-6 pt-6 border-t border-border/30">
      <div className="flex items-center justify-center text-sm text-muted-foreground">
        <Info className="w-4 h-4 mr-2" />
        Press Enter to send your message
      </div>
    </div>
  );
};
