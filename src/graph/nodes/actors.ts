import {
  ActorModels,
  CriticModels,
  GraphEvents,
  StateAnnotation,
} from "@/graph/state/state";

export const node = async (state: typeof StateAnnotation.State) => {
  console.log("actors node", state);
  const actorResponses = { ...state.actorResponses };
  const actorModelsArray = Array.from(ActorModels.values());
  const criticModelsArray = Array.from(CriticModels.values());

  const filteredModels = actorModelsArray.filter(
    (actor) =>
      state.actorAttempts === 0 || (state.actorAttempts > 0 && actor.error)
  );

  await Promise.allSettled(
    filteredModels.map(async (actor) => {
      const model = ActorModels.get(actor.name)!;
      let stream: ReturnType<typeof model.streamGenerateResponse>;
      GraphEvents.trigger("actor-generation", {
        name: actor.name,
        payload: true,
      });
      if (state.regeneration) {
        const pros: string[] = [];
        const cons: string[] = [];
        criticModelsArray.forEach((critic) => {
          const criticResult = CriticModels.get(critic.name)!.result;
          criticResult?.cons.forEach(({ name, con }) => {
            if (name === actor.name) cons.push(con);
          });
          criticResult?.pros.forEach(({ name, pro }) => {
            if (name === actor.name) pros.push(pro);
          });
        });
        const prompt = `Regenerate the answer for the following prompt:
          ${state.prompt}
          Here is pros for the previous answer:
          ${pros.join("\n")}
          Here is cons for the previous answer:
          ${cons.join("\n")}`;
        stream = model.streamRegenerateResponse(prompt);
      } else {
        stream = model.streamGenerateResponse(state.prompt);
      }
      for await (const chunk of stream) {
        if (!model.error) {
          GraphEvents.trigger("actor-response", {
            name: actor.name,
            payload: chunk.content,
          });
        }
        if (chunk.isComplete) {
          if (model.error) {
            GraphEvents.trigger("actor-response", {
              name: actor.name,
              payload: "Error generating response",
            });
          }
          actorResponses[actor.name] = chunk.fullResponse.content.toString();
          GraphEvents.trigger("actor-generation", {
            name: actor.name,
            payload: false,
          });
        }
      }
      return {
        name: actor.name,
      };
    })
  );

  return {
    actorAttempts: state.actorAttempts + 1,
    actorResponses,
  };
};
