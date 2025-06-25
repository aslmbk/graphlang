import { useState } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { FeedbackModal } from "./FeedbackModal";

type Response = {
  payload: string;
  generation: boolean;
  chosen: boolean;
  votes: number;
};

interface ActorsResponsesProps {
  responses: Record<string, Response>;
  onGetFeedback: (actorName: string) => { pros: string[]; cons: string[] };
}

export const ActorsResponses = ({
  responses,
  onGetFeedback,
}: ActorsResponsesProps) => {
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    actorName: string;
    pros: string[];
    cons: string[];
  }>({
    isOpen: false,
    actorName: "",
    pros: [],
    cons: [],
  });

  const handleShowFeedback = (actorName: string) => {
    const feedback = onGetFeedback(actorName);
    setFeedbackModal({
      isOpen: true,
      actorName,
      pros: feedback.pros,
      cons: feedback.cons,
    });
  };

  const handleCloseFeedback = () => {
    setFeedbackModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold text-foreground/80">
        Actor responses
      </h3>
      <div className="grid gap-4">
        {Object.entries(responses).map(([actorName, response]) => (
          <ActorResponseCard
            key={actorName}
            actorName={actorName}
            response={response}
            onShowFeedback={handleShowFeedback}
          />
        ))}
      </div>

      <FeedbackModal
        actorName={feedbackModal.actorName}
        pros={feedbackModal.pros}
        cons={feedbackModal.cons}
        isOpen={feedbackModal.isOpen}
        onClose={handleCloseFeedback}
      />
    </div>
  );
};

interface ActorResponseCardProps {
  actorName: string;
  response: Response;
  onShowFeedback: (actorName: string) => void;
}

const ActorResponseCard = ({
  actorName,
  response,
  onShowFeedback,
}: ActorResponseCardProps) => {
  const getBackgroundClass = () => {
    if (response.chosen) {
      return "bg-green-500/20 border-green-500/30 shadow-lg shadow-green-500/20";
    }
    if (response.generation) {
      return "bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 border-blue-500/30 shadow-lg shadow-blue-500/20 bg-[length:200%_100%] animate-gradient-x";
    }
    return "bg-card/50 border-border/50";
  };

  // Проверяем, есть ли ошибка у актора
  const hasError = response.payload === "Error generating response";

  return (
    <Card
      className={`p-4 border transition-all duration-300 ${getBackgroundClass()}`}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-foreground">{actorName}</h4>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {response.votes} votes
          </Badge>
          {response.chosen && (
            <Badge
              variant="default"
              className="bg-green-500 text-white text-xs"
            >
              Chosen
            </Badge>
          )}
          {response.generation && (
            <Badge variant="outline" className="text-xs animate-pulse">
              Generating...
            </Badge>
          )}
          {!hasError && !response.generation && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShowFeedback(actorName)}
              className="text-xs h-6 px-2"
            >
              Feedback
            </Button>
          )}
        </div>
      </div>

      <p className="text-foreground/80 text-sm leading-relaxed">
        {response.payload}
      </p>
    </Card>
  );
};
