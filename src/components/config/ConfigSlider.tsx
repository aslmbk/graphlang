import { Slider } from "../ui/slider";
import { Badge } from "../ui/badge";

interface ConfigSliderProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  max: number;
  min: number;
  step: number;
  description?: string;
  unit?: string;
}

export const ConfigSlider = ({
  label,
  value,
  onValueChange,
  max,
  min,
  step,
  description,
  unit = "",
}: ConfigSliderProps) => (
  <div>
    <div className="flex items-center justify-between mb-3">
      <label className="text-sm font-medium">{label}</label>
      <Badge variant="secondary" className="text-xs">
        {value}
        {unit}
      </Badge>
    </div>
    <Slider
      value={[value]}
      onValueChange={([newValue]) => onValueChange(newValue)}
      max={max}
      min={min}
      step={step}
      className="w-full"
    />
    {description && (
      <div className="text-xs text-muted-foreground mt-2">{description}</div>
    )}
  </div>
);
