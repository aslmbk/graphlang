import { Graph } from "../graph/Graph";
import { Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
});

export class Agent {
  constructor() {
    this.graph = new Graph(StateAnnotation);
  }
}
