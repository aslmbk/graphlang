/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from "./Model";
import {
  START,
  END,
  StateGraph,
  type StateDefinition,
  type AnnotationRoot,
} from "@langchain/langgraph/web";
import { v4 as uuidv4 } from "uuid";

type NodeCallback<S> = (
  state: S,
  models: Record<string, Model>
) => Promise<Partial<S>>;

type EdgeNode = string | Node;

type EdgeParams = {
  from: EdgeNode;
  to: EdgeNode;
};

type ConditionalEdgeParams<S> = {
  from: EdgeNode;
  to: {
    to: EdgeNode;
    condition: (state: S) => boolean;
  }[];
  defaultTo: EdgeNode;
};

export class Graph<GraphStateType extends AnnotationRoot<any>> {
  public static readonly START_EDGE = START;
  public static readonly END_EDGE = END;

  private workflow: StateGraph<StateDefinition>;

  private _models: Map<string, Model> = new Map();
  private _nodes: Map<string, Node> = new Map();

  constructor(state: GraphStateType) {
    this.workflow = new StateGraph(state);
  }

  public addModel(model: Model) {
    this._models.set(model.name, model);
  }

  public get models(): Readonly<Record<string, Model>> {
    return Object.fromEntries(this._models);
  }

  public compile() {
    return this.workflow.compile();
  }

  public createNode(
    name: string,
    callback: NodeCallback<GraphStateType["State"]>
  ) {
    const node = new Node(name);
    this._nodes.set(node.name, node);
    this.workflow.addNode(node.name, async (state) => {
      const newState = await callback(state, this.models);
      return {
        ...state,
        ...newState,
      };
    });

    return node;
  }

  public createEdge(edgeParams: EdgeParams) {
    const handledParams = this.handleEdgeParams(edgeParams);
    this.validateEdgeParams(handledParams);
    this.workflow.addEdge(handledParams.from as any, handledParams.to as any);
  }

  public createConditionalEdge(
    edgeParams: ConditionalEdgeParams<GraphStateType["State"]>
  ) {
    const handledParams = this.handleEdgeParams({
      from: edgeParams.from,
      to: edgeParams.defaultTo,
    });
    this.validateEdgeParams(handledParams);
    this.workflow.addConditionalEdges(handledParams.from as any, (state) => {
      for (const edge of edgeParams.to) {
        if (edge.condition(state)) return edge.to as any;
      }
      return handledParams.to as any;
    });
  }

  private handleEdgeParams(edgeParams: EdgeParams) {
    const from =
      edgeParams.from instanceof Node ? edgeParams.from.name : edgeParams.from;
    const to =
      edgeParams.to instanceof Node ? edgeParams.to.name : edgeParams.to;

    return { from, to };
  }

  private validateEdgeParams(edgeParams: EdgeParams) {
    const { from, to } = this.handleEdgeParams(edgeParams);
    if (from !== Graph.START_EDGE && !this._nodes.has(from)) {
      throw new Error(`Node ${from} does not exist`);
    }
    if (to !== Graph.END_EDGE && !this._nodes.has(to)) {
      throw new Error(`Node ${to} does not exist`);
    }
    if (from === Graph.END_EDGE) {
      throw new Error("Cannot create edge from END node");
    }
    if (to === Graph.START_EDGE) {
      throw new Error("Cannot create edge to START node");
    }
  }
}

export class Node {
  public name: string;
  public id = uuidv4();

  constructor(name: string) {
    this.name = name;
  }
}
