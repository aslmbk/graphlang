import { useStore } from "zustand";
import { thinking } from "@/graph/state/thinking";
import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Brain,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const ActorsResponses = () => {
  const thinkingState = useStore(thinking, (state) => state);

  const [isThinkingProcessOpened, setIsThinkingProcessOpened] = useState(false);

  const { answer, isGeneration } = useMemo(() => {
    const lastIteration =
      thinkingState.iterations[thinkingState.iterations.length - 1];
    const chosenModel = thinkingState.choise;
    if (!lastIteration) return { answer: null, isGeneration: false };

    let isGeneration = false;
    Object.values(lastIteration.options).forEach((option) => {
      if (option.isGenerating) isGeneration = true;
    });
    Object.values(lastIteration.evaluations).forEach((evaluation) => {
      if (evaluation.isGenerating) isGeneration = true;
    });

    return {
      answer: lastIteration.options[chosenModel ?? ""]?.text,
      isGeneration,
    };
  }, [thinkingState.choise, thinkingState.iterations]);

  return (
    <div className="mt-2 space-y-2">
      {/* Thinking Process Toggle */}
      {(answer || isGeneration) && (
        <div className="flex items-center">
          <button
            onClick={() => setIsThinkingProcessOpened(!isThinkingProcessOpened)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 p-1 rounded-md hover:bg-muted/50"
          >
            {isThinkingProcessOpened ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <Brain className="h-4 w-4" />
            <span className="font-medium">Thinking Process</span>
          </button>
        </div>
      )}

      {/* Thinking Process Details */}
      {isThinkingProcessOpened && (
        <div className="space-y-2">
          {thinkingState.iterations.map((iteration, iterationIndex) => {
            const options = Object.values(iteration.options);
            const evaluations = Object.keys(iteration.evaluations);

            return (
              <Card key={iterationIndex} className="border-dashed">
                <CardHeader className="py-0">
                  <CardTitle className="flex items-center gap-1 text-base">
                    {thinkingState.iterations.length > 1 && (
                      <Badge variant="secondary">
                        Iteration #{iterationIndex + 1}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Options Section */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      Generated Options
                    </div>
                    <div className="grid gap-2">
                      {options.map((option, optionIndex) => (
                        <Card
                          key={option.name}
                          className="border-l-4 border-l-blue-500/20 bg-blue-50/30 dark:bg-blue-950/20 py-2"
                        >
                          <CardContent className="py-2">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1">
                                <Badge variant="outline" className="text-xs">
                                  Option #{optionIndex + 1}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {option.model}
                                </Badge>
                              </div>
                              {option.isGenerating && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  Generating...
                                </div>
                              )}
                            </div>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap">
                              {option.text}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Evaluations Section */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                      <CheckCircle className="h-4 w-4" />
                      Evaluations
                    </div>
                    <div className="grid gap-2">
                      {evaluations.map((key, evalIndex) => {
                        const evaluation = iteration.evaluations[key];
                        return (
                          <Card
                            key={key}
                            className="border-l-4 border-l-green-500/20 bg-green-50/30 dark:bg-green-950/20 py-2"
                          >
                            <CardContent className="py-2">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1">
                                  <Badge variant="outline" className="text-xs">
                                    Evaluation #{evalIndex + 1}
                                  </Badge>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {evaluation.model}
                                  </Badge>
                                </div>
                                {evaluation.isGenerating && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Evaluating...
                                  </div>
                                )}
                              </div>

                              {!evaluation.isGenerating &&
                                !evaluation.choice && (
                                  <div className="flex items-center gap-1 text-sm text-destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    Something went wrong
                                  </div>
                                )}

                              {evaluation.choice && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium">
                                      Selected: Option #
                                      {options.findIndex(
                                        (option) =>
                                          option.name ===
                                          evaluation.choice!.name
                                      ) + 1}{" "}
                                      ({evaluation.choice.model})
                                    </span>
                                  </div>

                                  <div className="grid gap-2">
                                    {/* Pros */}
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1 text-sm font-medium text-green-700 dark:text-green-400">
                                        <CheckCircle className="h-3 w-3" />
                                        Pros
                                      </div>
                                      <div className="pl-4 space-y-0.5">
                                        {evaluation.evaluation[
                                          evaluation.choice.name
                                        ].pros.map((pro, index) => (
                                          <div
                                            key={index}
                                            className="text-sm text-green-700/80 dark:text-green-400/80"
                                          >
                                            • {pro}
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Cons */}
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1 text-sm font-medium text-red-700 dark:text-red-400">
                                        <AlertCircle className="h-3 w-3" />
                                        Cons
                                      </div>
                                      <div className="pl-4 space-y-0.5">
                                        {evaluation.evaluation[
                                          evaluation.choice.name
                                        ].cons.map((con, index) => (
                                          <div
                                            key={index}
                                            className="text-sm text-red-700/80 dark:text-red-400/80"
                                          >
                                            • {con}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Final Answer */}
      <div className="mt-2">
        {isGeneration ? (
          <Card className="border-l-4 border-l-blue-500 bg-blue-50/30 dark:bg-blue-950/20">
            <CardContent className="pt-2 pb-2">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="font-medium">Generating...</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          answer && (
            <Card className="border-l-4 border-l-green-500 bg-green-50/30 dark:bg-green-950/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-1 text-base">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Final Answer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {answer}
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
};
