import { useState } from "react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import { Settings } from "lucide-react";
import { BasicSettingsSection } from "./BasicSettingsSection";
import { ModelsSection } from "./ModelsSection";
import { MODELS } from "@/agent/models/models";
import type { ModelType } from "@/agent/Agent";

interface ConfigSheetProps {
  maxGenerationAttempts: number;
  choiseThreshold: number;
  actorModels: ModelType[];
  criticModels: ModelType[];
  onMaxGenerationAttemptsChange: (value: number) => void;
  onChoiseThresholdChange: (value: number) => void;
  onActorModelsChange: (models: ModelType[]) => void;
  onCriticModelsChange: (models: ModelType[]) => void;
}

export const ConfigSheet = ({
  maxGenerationAttempts,
  choiseThreshold,
  actorModels,
  criticModels,
  onMaxGenerationAttemptsChange,
  onChoiseThresholdChange,
  onActorModelsChange,
  onCriticModelsChange,
}: ConfigSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/80"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto bg-gradient-to-b from-background to-background/95">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Model settings
          </SheetTitle>
          <SheetDescription className="text-base">
            Configure your AI agent's behavior for better results
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8">
          <BasicSettingsSection
            maxGenerationAttempts={maxGenerationAttempts}
            choiseThreshold={choiseThreshold}
            onMaxGenerationAttemptsChange={onMaxGenerationAttemptsChange}
            onChoiseThresholdChange={onChoiseThresholdChange}
          />

          <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

          <ModelsSection
            title="Actors"
            description="Models that generate responses to your questions."
            models={actorModels}
            onModelsChange={onActorModelsChange}
            defaultModel={MODELS.openai.gpt_3_5_turbo}
            color="bg-green-500"
            bgGradient="bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20"
          />

          <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

          <ModelsSection
            title="Critics"
            description="Models that evaluate the quality of actor responses."
            models={criticModels}
            onModelsChange={onCriticModelsChange}
            defaultModel={MODELS.openai.gpt_4o}
            color="bg-orange-500"
            bgGradient="bg-gradient-to-br from-orange-50/50 to-red-50/50 dark:from-orange-950/20 dark:to-red-950/20"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
