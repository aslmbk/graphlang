import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

export const CriticsGenerationIndicator = () => {
  return (
    <div className="mt-6">
      <Card className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30">
        <div className="flex items-center gap-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-foreground">Критикийн таллам</h4>
            <p className="text-sm text-foreground/70">
              Критикаш бу тоьлла жоп хоржуш
            </p>
          </div>
          <Badge
            variant="outline"
            className="text-orange-600 border-orange-500/50"
          >
            Процесс
          </Badge>
        </div>
      </Card>
    </div>
  );
};
