import { GraphEvents, StateAnnotation } from "@/graph/state/state";

export const node = async (state: typeof StateAnnotation.State) => {
  console.log("regeneration node", state);
  GraphEvents.trigger("regeneration");
  return {
    regeneration: true,
    actorAttempts: 0,
    criticAttempts: 0,
  };
};
