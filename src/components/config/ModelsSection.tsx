import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ModelCard } from "./ModelCard";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import type { ModelType } from "@/agent/Agent";

interface ModelsSectionProps {
  title: string;
  description: string;
  models: ModelType[];
  onModelsChange: (models: ModelType[]) => void;
  defaultModel: string;
  color: string;
  bgGradient: string;
}

export const ModelsSection = ({
  title,
  description,
  models,
  onModelsChange,
  defaultModel,
  color,
  bgGradient,
}: ModelsSectionProps) => {
  const handleAddModel = () => {
    onModelsChange([
      ...models,
      {
        name: uuidv4(),
        model: defaultModel,
        temperature: 0.5,
      },
    ]);
  };

  const handleUpdateModel = (
    modelName: string,
    updates: Partial<ModelType>
  ) => {
    onModelsChange(
      models.map((m) => (m.name === modelName ? { ...m, ...updates } : m))
    );
  };

  const handleRemoveModel = (modelName: string) => {
    onModelsChange(models.filter((m) => m.name !== modelName));
  };

  return (
    <Card className={`border-0 shadow-lg ${bgGradient}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <div className={`w-2 h-2 ${color} rounded-full`} />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button
            onClick={handleAddModel}
            size="sm"
            className={`${color
              .replace("bg-", "bg-")
              .replace("500", "600")} hover:${color
              .replace("bg-", "bg-")
              .replace("500", "700")}`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {models.map((model) => (
          <ModelCard
            key={model.name}
            model={model}
            onUpdate={(updates) => handleUpdateModel(model.name, updates)}
            onRemove={() => handleRemoveModel(model.name)}
          />
        ))}
        {models.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-muted-foreground/20 rounded-lg">
            <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Нет добавленных {title.toLowerCase()}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
