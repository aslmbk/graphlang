import {
  ActorModels,
  CriticModels,
  GraphEvents,
  StateAnnotation,
} from "@/graph/state/state";

export const node = async (state: typeof StateAnnotation.State) => {
  console.log("critics node", state);
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

  const responses = await Promise.allSettled(
    filteredModels.map(async (critic) => {
      const model = CriticModels.get(critic.name)!;
      GraphEvents.trigger("critic-generation", {
        name: critic.name,
        payload: true,
      });
      const answer = await model.generateResponse(state.prompt, actorResponses);
      return {
        name: critic.name,
        answer,
      };
    })
  );

  responses.forEach((response) => {
    if (response.status === "fulfilled") {
      criticResponses[response.value.name] = response.value.answer.content;

      const criticModel = CriticModels.get(response.value.name)!;
      GraphEvents.trigger("critic-response", {
        name: response.value.name,
        payload: criticModel.result?.choice ?? "",
      });
    }
  });

  Object.keys(criticResponses).forEach((name) => {
    GraphEvents.trigger("critic-generation", {
      name,
      payload: false,
    });
  });

  return {
    criticAttempts: state.criticAttempts + 1,
    criticResponses,
  };
};
