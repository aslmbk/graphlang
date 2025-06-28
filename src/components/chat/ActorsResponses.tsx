import { useStore } from "zustand";
import { thinking } from "@/graph/state/thinking";
import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

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
    <div className="mt-2">
      <div className="text-muted-foreground text-sm">
        {(answer || isGeneration) && (
          <div
            onClick={() => setIsThinkingProcessOpened(!isThinkingProcessOpened)}
            className="flex items-center cursor-pointer"
          >
            {isThinkingProcessOpened ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            Thinking process...
          </div>
        )}
      </div>
      {isThinkingProcessOpened && (
        <div className="text-muted-foreground text-sm">
          {thinkingState.iterations.map((iteration, index) => {
            const options = Object.values(iteration.options);
            const evaluations = Object.keys(iteration.evaluations);
            return (
              <React.Fragment key={index}>
                {thinkingState.iterations.length > 1 && (
                  <div>Iteration #{index + 1}</div>
                )}
                <div>Options:</div>
                {options.map((option, index) => (
                  <div key={option.name}>
                    <div>
                      Option #{index + 1} ({option.model}){" "}
                      {option.isGenerating && (
                        <span className="text-muted-foreground/50">
                          Generating...
                        </span>
                      )}
                    </div>
                    <div>{option.text}</div>
                  </div>
                ))}
                <div>Evaluation:</div>
                {evaluations.map((key, index) => {
                  const evaluation = iteration.evaluations[key];
                  return (
                    <div key={key}>
                      <div>
                        Evaluation #{index + 1} ({evaluation.model}){" "}
                        {evaluation.isGenerating && (
                          <span className="text-muted-foreground/50">
                            Generating...
                          </span>
                        )}
                      </div>
                      {!evaluation.isGenerating && !evaluation.choice && (
                        <div>Something went wrong</div>
                      )}
                      {evaluation.choice && (
                        <>
                          <div>
                            Choice: Option #
                            {options.findIndex(
                              (option) =>
                                option.name === evaluation.choice!.name
                            ) + 1}{" "}
                            ({evaluation.choice.model})
                          </div>
                          <div>
                            <div>Pros:</div>
                            {evaluation.evaluation[
                              evaluation.choice.name
                            ].pros.map((pro, index) => (
                              <div key={index}>{pro}</div>
                            ))}
                            <div>Cons:</div>
                            {evaluation.evaluation[
                              evaluation.choice.name
                            ].cons.map((con, index) => (
                              <div key={index}>{con}</div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      )}
      <div>
        {isGeneration ? (
          <div className="text-muted-foreground">Generating...</div>
        ) : (
          answer
        )}
      </div>
    </div>
  );
};
