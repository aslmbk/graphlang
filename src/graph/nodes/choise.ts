import {
  ActorModels,
  CriticModels,
  GraphEvents,
  StateAnnotation,
} from "@/graph/state/state";
import { config } from "@/graph/state/config";

export const node = async (state: typeof StateAnnotation.State) => {
  console.log("choise node", state);
  GraphEvents.trigger("choise-node");
  const actorModelsArray = Array.from(ActorModels.values());
  const criticModelsArray = Array.from(CriticModels.values());
  const choises: Record<string, number> = {};
  actorModelsArray.forEach((actor) => {
    choises[actor.name] = 0;
  });
  criticModelsArray.forEach((critic) => {
    const criticModel = CriticModels.get(critic.name)!;
    const choise = criticModel.result?.choice;
    console.log(`choise of critic ${critic.name}`, criticModel.result);
    if (choise) choises[choise]++;
  });
  const maxChoise = Math.max(...Object.values(choises));
  const nonErrorCritics = criticModelsArray.filter((critic) => !critic.error);
  const maxChoiseInPercent = (maxChoise / nonErrorCritics.length) * 100;
  if (maxChoiseInPercent < config.getState().choiseThreshold)
    return { choise: null };
  const chosenActor = Object.keys(choises).find(
    (name) => choises[name] === maxChoise
  )!;
  GraphEvents.trigger("choise", {
    name: chosenActor,
    model: ActorModels.get(chosenActor)!.modelName,
    payload: state.actorResponses[chosenActor],
  });
  return {
    choise: state.actorResponses[chosenActor],
  };
};
