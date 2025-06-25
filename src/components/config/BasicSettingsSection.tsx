import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ConfigSlider } from "./ConfigSlider";

interface BasicSettingsSectionProps {
  maxGenerationAttempts: number;
  choiseThreshold: number;
  onMaxGenerationAttemptsChange: (value: number) => void;
  onChoiseThresholdChange: (value: number) => void;
}

export const BasicSettingsSection = ({
  maxGenerationAttempts,
  choiseThreshold,
  onMaxGenerationAttemptsChange,
  onChoiseThresholdChange,
}: BasicSettingsSectionProps) => (
  <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full" />
        Коьрта конфигаш
      </CardTitle>
      <CardDescription>Генерацин а, сацамаш баран низам а.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <ConfigSlider
        label="Генераци яран максимум г1ортам"
        value={maxGenerationAttempts}
        onValueChange={onMaxGenerationAttemptsChange}
        max={10}
        min={1}
        step={1}
        description="Сацам тӀеэцале хьалха генераци ян гӀортаман терахь."
      />

      <ConfigSlider
        label="Критикан барт хиларан не1саг1а."
        value={choiseThreshold}
        onValueChange={onChoiseThresholdChange}
        max={100}
        min={0}
        step={1}
        unit="%"
        description="Критикашна юкъахь сацам тӀеэца барт хиларан лаххара процент"
      />
    </CardContent>
  </Card>
);
