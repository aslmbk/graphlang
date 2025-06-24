import { useState, useEffect } from "react";
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
import type { AgentConfig as AgentConfigType, ModelType } from "../lib/types";
import { MODEL_PROVIDERS, generateRandomName } from "../lib/types";
import { loadConfig, saveConfig, getProviderDisplayName } from "../lib/config";

interface AgentConfigComponentProps {
  onConfigChange: (config: AgentConfigType) => void;
}

export const AgentConfig = ({ onConfigChange }: AgentConfigComponentProps) => {
  const [config, setConfig] = useState<AgentConfigType>(loadConfig());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    onConfigChange(config);
    saveConfig(config);
  }, [config, onConfigChange]);

  const addActorModel = () => {
    const newModel: ModelType = {
      id: crypto.randomUUID(),
      name: generateRandomName(),
      model: "openai/gpt-3.5-turbo",
      temperature: 0.5,
    };
    setConfig((prev) => ({
      ...prev,
      actorModels: [...prev.actorModels, newModel],
    }));
  };

  const removeActorModel = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      actorModels: prev.actorModels.filter((model) => model.id !== id),
    }));
  };

  const updateActorModel = (id: string, updates: Partial<ModelType>) => {
    setConfig((prev) => ({
      ...prev,
      actorModels: prev.actorModels.map((model) =>
        model.id === id ? { ...model, ...updates } : model
      ),
    }));
  };

  const addCriticModel = () => {
    const newModel: ModelType = {
      id: crypto.randomUUID(),
      name: generateRandomName(),
      model: "openai/gpt-3.5-turbo",
      temperature: 0.5,
    };
    setConfig((prev) => ({
      ...prev,
      criticModels: [...prev.criticModels, newModel],
    }));
  };

  const removeCriticModel = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      criticModels: prev.criticModels.filter((model) => model.id !== id),
    }));
  };

  const updateCriticModel = (id: string, updates: Partial<ModelType>) => {
    setConfig((prev) => ({
      ...prev,
      criticModels: prev.criticModels.map((model) =>
        model.id === id ? { ...model, ...updates } : model
      ),
    }));
  };

  const ModelCard = ({
    model,
    onUpdate,
    onRemove,
    type,
  }: {
    model: ModelType;
    onUpdate: (updates: Partial<ModelType>) => void;
    onRemove: () => void;
    type: "actor" | "critic";
  }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                type === "actor" ? "bg-blue-500" : "bg-purple-500"
              }`}
            />
            <div>
              <CardTitle className="text-base font-semibold">
                {model.name}
              </CardTitle>
              <CardDescription className="text-xs">
                {getProviderDisplayName(model.model)}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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
              {MODEL_PROVIDERS.map((provider) => (
                <div key={provider.name}>
                  <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground bg-muted/50">
                    {provider.displayName}
                  </div>
                  {Object.entries(provider.models).map(([key, displayName]) => {
                    const modelPath = `${provider.name}/${key}`;
                    return (
                      <SelectItem key={modelPath} value={modelPath}>
                        {displayName}
                      </SelectItem>
                    );
                  })}
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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/80"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
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
                    {config.maxGenerationAttempts}
                  </Badge>
                </div>
                <Slider
                  value={[config.maxGenerationAttempts]}
                  onValueChange={([value]) =>
                    setConfig((prev) => ({
                      ...prev,
                      maxGenerationAttempts: value,
                    }))
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
                    {config.choiseThreshold}%
                  </Badge>
                </div>
                <Slider
                  value={[config.choiseThreshold]}
                  onValueChange={([value]) =>
                    setConfig((prev) => ({ ...prev, choiseThreshold: value }))
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
                  onClick={addActorModel}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Добавить
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.actorModels.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  onUpdate={(updates) => updateActorModel(model.id, updates)}
                  onRemove={() => removeActorModel(model.id)}
                  type="actor"
                />
              ))}
              {config.actorModels.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-muted-foreground/20 rounded-lg">
                  <svg
                    className="w-8 h-8 mx-auto mb-2 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
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
                  onClick={addCriticModel}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Добавить
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.criticModels.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  onUpdate={(updates) => updateCriticModel(model.id, updates)}
                  onRemove={() => removeCriticModel(model.id)}
                  type="critic"
                />
              ))}
              {config.criticModels.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-muted-foreground/20 rounded-lg">
                  <svg
                    className="w-8 h-8 mx-auto mb-2 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
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
