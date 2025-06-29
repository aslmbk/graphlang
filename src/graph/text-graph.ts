import { START, END, StateGraph } from "@langchain/langgraph/web";
import {
  ActorModels,
  CriticModels,
  GraphEvents,
  StateAnnotation,
} from "./state/state";
import { node as actorsNode } from "./nodes/actors";
import { node as criticsNode } from "./nodes/critics";
import { node as choiseNode } from "./nodes/choise";
import { node as regenerationNode } from "./nodes/regeneration";
import { config } from "./state/config";

const workflow = new StateGraph(StateAnnotation)
  .addNode("actors_node", actorsNode)
  .addNode("critics_node", criticsNode)
  .addNode("choise_node", choiseNode)
  .addNode("regeneration_node", regenerationNode)
  .addEdge(START, "actors_node")
  .addConditionalEdges("actors_node", (state) => {
    if (
      state.actorAttempts < config.getState().maxGenerationAttempts &&
      Array.from(ActorModels.values()).some(({ error }) => error)
    ) {
      return "actors_node";
    }
    return "critics_node";
  })
  .addConditionalEdges("critics_node", (state) => {
    if (
      state.criticAttempts < config.getState().maxGenerationAttempts &&
      Array.from(CriticModels.values()).some(({ error }) => error)
    ) {
      return "critics_node";
    }
    return "choise_node";
  })
  .addConditionalEdges("choise_node", (state) => {
    if (state.choise === null) {
      return "regeneration_node";
    }
    return END;
  })
  .addEdge("regeneration_node", "actors_node")
  .compile();

const invoke = (prompt: string) => {
  GraphEvents.trigger("start-generation");
  return workflow.invoke(
    {
      prompt,
      choise: null,
      actorAttempts: 0,
      criticAttempts: 0,
      actorResponses: {},
      criticResponses: {},
      regeneration: false,
    },
    {
      recursionLimit: 1000,
    }
  );
};

export default { invoke, events: GraphEvents };
