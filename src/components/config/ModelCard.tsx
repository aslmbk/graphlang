import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent } from "../ui/card";
import { MODELS } from "@/agent/models/models";
import { X } from "lucide-react";
import type { ModelType } from "@/agent/Agent";

interface ModelCardProps {
  model: ModelType;
  onUpdate: (updates: Partial<ModelType>) => void;
  onRemove: () => void;
}

export const ModelCard = ({ model, onUpdate, onRemove }: ModelCardProps) => (
  <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary/60 relative">
    <Button
      variant="ghost"
      size="sm"
      onClick={onRemove}
      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 z-10"
    >
      <X className="w-4 h-4" />
    </Button>
    <CardContent className="space-y-4 pt-6">
      <div>
        <label className="text-sm font-medium mb-2 block text-muted-foreground">
          Модель
        </label>
        <Select
          value={model.model}
          onValueChange={(value) => onUpdate({ model: value })}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(MODELS).map(([provider, models]) => (
              <div key={provider}>
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground bg-muted/50">
                  {provider.toUpperCase()}
                </div>
                {Object.entries(models).map(([key, modelPath]) => (
                  <SelectItem key={modelPath} value={modelPath}>
                    {key}
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-muted-foreground">
            Температура
          </label>
          <span className="text-xs text-muted-foreground">
            {model.temperature}
          </span>
        </div>
        <Slider
          value={[model.temperature]}
          onValueChange={([value]) => onUpdate({ temperature: value })}
          max={1}
          min={0}
          step={0.1}
          className="w-full"
        />
        <div className="text-xs text-muted-foreground mt-1">
          {model.temperature < 0.3
            ? "Консервативный"
            : model.temperature < 0.7
            ? "Сбалансированный"
            : "Креативный"}
        </div>
      </div>
    </CardContent>
  </Card>
);
