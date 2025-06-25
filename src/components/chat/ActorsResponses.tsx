import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

type Response = {
  payload: string;
  generation: boolean;
  chosen: boolean;
  votes: number;
};

interface ActorsResponsesProps {
  responses: Record<string, Response>;
}

export const ActorsResponses = ({ responses }: ActorsResponsesProps) => {
  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold text-foreground/80">
        Ответы акторов
      </h3>
      <div className="grid gap-4">
        {Object.entries(responses).map(([actorName, response]) => (
          <ActorResponseCard
            key={actorName}
            actorName={actorName}
            response={response}
          />
        ))}
      </div>
    </div>
  );
};

interface ActorResponseCardProps {
  actorName: string;
  response: Response;
}

const ActorResponseCard = ({ actorName, response }: ActorResponseCardProps) => {
  const getBackgroundClass = () => {
    if (response.chosen) {
      return "bg-green-500/20 border-green-500/30 shadow-lg shadow-green-500/20";
    }
    if (response.generation) {
      return "bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 border-blue-500/30 shadow-lg shadow-blue-500/20 bg-[length:200%_100%] animate-gradient-x";
    }
    return "bg-card/50 border-border/50";
  };

  return (
    <Card
      className={`p-4 border transition-all duration-300 ${getBackgroundClass()}`}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-foreground">{actorName}</h4>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {response.votes} голосов
          </Badge>
          {response.chosen && (
            <Badge
              variant="default"
              className="bg-green-500 text-white text-xs"
            >
              Выбран
            </Badge>
          )}
          {response.generation && (
            <Badge variant="outline" className="text-xs animate-pulse">
              Генерация...
            </Badge>
          )}
        </div>
      </div>

      <p className="text-foreground/80 text-sm leading-relaxed">
        {response.payload}
      </p>
    </Card>
  );
};
