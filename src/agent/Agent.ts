import { Graph } from "../graph/Graph";
import { Annotation } from "@langchain/langgraph";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { OpenAIModel } from "./OpenAIModel";
import { MODELS } from "./types";

const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
});

export class Agent {
  private graph: Graph<typeof StateAnnotation>;
  constructor() {
    this.graph = new Graph(StateAnnotation);

    const model = new OpenAIModel({
      name: "model",
      model: MODELS.GPT_3_5_TURBO,
      temperature: 0,
    });

    this.graph.addModel(model);

    const firstNode = this.graph.createNode(
      "firstNode",
      async (state, models) => {
        console.log("firstNode state", state);
        const response = await models.model.call("Hello, how are you?");
        return {
          messages: [new HumanMessage("Hello, how are you?"), response],
        };
      }
    );

    const secondNode = this.graph.createNode(
      "secondNode",
      async (state, models) => {
        console.log("secondNode state", state);
        console.log("secondNode models", models);
        return state;
      }
    );

    this.graph.createEdge({
      from: Graph.START_EDGE,
      to: firstNode,
    });

    this.graph.createEdge({
      from: firstNode,
      to: secondNode,
    });

    this.graph.createEdge({
      from: secondNode,
      to: Graph.END_EDGE,
    });

    const compiled = this.graph.compile();

    const response = compiled.invoke({
      messages: [new HumanMessage("First")],
    });

    console.log("response", response);
  }
}
