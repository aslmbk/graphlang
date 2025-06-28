import {
  ActorModels,
  CriticModels,
  GraphEvents,
  StateAnnotation,
} from "@/graph/state/state";

export const node = async (state: typeof StateAnnotation.State) => {
  console.log("critics node", state);
  GraphEvents.trigger("critics-node");
  const criticResponses = { ...state.criticResponses };
  const criticModelsArray = Array.from(CriticModels.values());

  const actorResponses = Object.keys(state.actorResponses)
    .filter((name) => {
      const actorModel = ActorModels.get(name);
      return actorModel && !actorModel.error;
    })
    .map((name) => ({
      name,
      option: state.actorResponses[name],
    }));

  const filteredModels = criticModelsArray.filter(
    (critic) =>
      state.criticAttempts === 0 || (state.criticAttempts > 0 && critic.error)
  );

  await Promise.allSettled(
    filteredModels.map(async (critic) => {
      const model = CriticModels.get(critic.name)!;
      GraphEvents.trigger("critic-generation", {
        name: critic.name,
        model: critic.modelName,
        payload: true,
      });
      const answer = await model.generateResponse(state.prompt, actorResponses);
      criticResponses[critic.name] = answer.content;
      GraphEvents.trigger("critic-response", {
        name: critic.name,
        model: critic.modelName,
        payload: critic.result?.choice ?? "",
      });
      GraphEvents.trigger("critic-generation", {
        name: critic.name,
        model: critic.modelName,
        payload: false,
      });
    })
  );

  return {
    criticAttempts: state.criticAttempts + 1,
    criticResponses,
  };
};
