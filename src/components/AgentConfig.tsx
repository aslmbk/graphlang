import { useState } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { config } from "../lib/config";
import { useStore } from "zustand";
import { MODELS } from "@/agent/models/models";
import { v4 as uuidv4 } from "uuid";
import type { ModelType } from "@/agent/Agent";
import { Settings, X, Plus } from "lucide-react";

const ModelCard = ({
  model,
  onUpdate,
  onRemove,
}: {
  model: ModelType;
  onUpdate: (updates: Partial<ModelType>) => void;
  onRemove: () => void;
}) => (
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

export const AgentConfig = () => {
  const configStore = useStore(config, (state) => state);
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
          Настройки
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto bg-gradient-to-b from-background to-background/95">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Настройки агента
          </SheetTitle>
          <SheetDescription className="text-base">
            Настройте параметры работы вашего AI агента для получения лучших
            результатов
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8">
          {/* Основные настройки */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Основные параметры
              </CardTitle>
              <CardDescription>
                Настройки генерации и принятия решений
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">
                    Максимум попыток генерации
                  </label>
                  <Badge variant="secondary" className="text-xs">
                    {configStore.maxGenerationAttempts}
                  </Badge>
                </div>
                <Slider
                  value={[configStore.maxGenerationAttempts]}
                  onValueChange={([value]) =>
                    configStore.setMaxGenerationAttempts(value)
                  }
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground mt-2">
                  Количество попыток генерации ответа перед принятием решения
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">
                    Порог согласия критиков
                  </label>
                  <Badge variant="secondary" className="text-xs">
                    {configStore.choiseThreshold}%
                  </Badge>
                </div>
                <Slider
                  value={[configStore.choiseThreshold]}
                  onValueChange={([value]) =>
                    configStore.setChoiseThreshold(value)
                  }
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground mt-2">
                  Минимальный процент согласия критиков для принятия решения
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Акторы */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Акторы
                  </CardTitle>
                  <CardDescription>
                    Модели, которые генерируют ответы на ваши вопросы
                  </CardDescription>
                </div>
                <Button
                  onClick={() =>
                    configStore.setActorModels([
                      ...configStore.actorModels,
                      {
                        name: uuidv4(),
                        model: MODELS.openai.gpt_3_5_turbo,
                        temperature: 0.5,
                      },
                    ])
                  }
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {configStore.actorModels.map((model) => (
                <ModelCard
                  key={model.name}
                  model={model}
                  onUpdate={(updates) =>
                    configStore.setActorModels(
                      configStore.actorModels.map((m) =>
                        m.name === model.name ? { ...m, ...updates } : m
                      )
                    )
                  }
                  onRemove={() =>
                    configStore.setActorModels(
                      configStore.actorModels.filter(
                        (m) => m.name !== model.name
                      )
                    )
                  }
                />
              ))}
              {configStore.actorModels.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-muted-foreground/20 rounded-lg">
                  <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Нет добавленных акторов</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Критики */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50/50 to-red-50/50 dark:from-orange-950/20 dark:to-red-950/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    Критики
                  </CardTitle>
                  <CardDescription>
                    Модели, которые оценивают качество ответов акторов
                  </CardDescription>
                </div>
                <Button
                  onClick={() =>
                    configStore.setCriticModels([
                      ...configStore.criticModels,
                      {
                        name: uuidv4(),
                        model: MODELS.openai.gpt_4o,
                        temperature: 0.5,
                      },
                    ])
                  }
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {configStore.criticModels.map((model) => (
                <ModelCard
                  key={model.name}
                  model={model}
                  onUpdate={(updates) =>
                    configStore.setCriticModels(
                      configStore.criticModels.map((m) =>
                        m.name === model.name ? { ...m, ...updates } : m
                      )
                    )
                  }
                  onRemove={() =>
                    configStore.setCriticModels(
                      configStore.criticModels.filter(
                        (m) => m.name !== model.name
                      )
                    )
                  }
                />
              ))}
              {configStore.criticModels.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-muted-foreground/20 rounded-lg">
                  <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Нет добавленных критиков</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};
