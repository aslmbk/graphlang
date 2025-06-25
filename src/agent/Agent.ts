/* eslint-disable @typescript-eslint/no-explicit-any */
import { Graph } from "../graph/Graph";
import { Annotation, type CompiledGraph } from "@langchain/langgraph/web";
import { OpenAIActor } from "./models/OpenAIActor";
import { OpenAICritic } from "./models/OpenAICritic";
import { getChatModel } from "./models/models";
import { Events } from "@/lib/Events";

const StateAnnotation = Annotation.Root({
  actorResponses: Annotation<Record<string, string>>({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({}),
  }),
  criticResponses: Annotation<Record<string, string>>({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({}),
  }),
  actorAttempts: Annotation<number>({
    reducer: (_, y) => y,
    default: () => 0,
  }),
  criticAttempts: Annotation<number>({
    reducer: (_, y) => y,
    default: () => 0,
  }),
  prompt: Annotation<string>({
    reducer: (_, y) => y,
    default: () => "",
  }),
  choise: Annotation<string | null>({
    reducer: (_, y) => y,
    default: () => null,
  }),
  regeneration: Annotation<boolean>({
    reducer: (_, y) => y,
    default: () => false,
  }),
});

export type ModelType = {
  name: string;
  model: string;
  temperature: number;
};

export type Payload<T> = {
  name: string;
  payload: T;
};

export class Agent {
  private graph: Graph<typeof StateAnnotation>;
  private compiledGraph: CompiledGraph<any>;

  private choiseThreshold: number = 51;
  private maxGenerationAttempts: number = 3;
  private actorModels: ModelType[] = [];
  private criticModels: ModelType[] = [];

  public events = new Events<{
    "actor-response": Payload<string>;
    "critic-response": Payload<string>;
    "actor-generation": Payload<boolean>;
    "critic-generation": Payload<boolean>;
    choise: Payload<string>;
    regeneration: void;
  }>();

  constructor() {
    this.graph = new Graph(StateAnnotation);

    const actorsNode = this.graph.createNode(
      "actorsNode",
      async (state, models) => {
        console.log("actors node", state);
        const actorResponses = { ...state.actorResponses };

        const filteredModels = this.actorModels.filter(
          (actor) =>
            state.actorAttempts === 0 ||
            (state.actorAttempts > 0 && this.graph.models[actor.name].error)
        );

        await Promise.allSettled(
          filteredModels.map(async (actor) => {
            const model = models[actor.name] as OpenAIActor;
            let stream: ReturnType<typeof model.streamGenerateResponse>;
            this.events.trigger("actor-generation", {
              name: actor.name,
              payload: true,
            });
            if (state.regeneration) {
              const pros: string[] = [];
              const cons: string[] = [];
              this.criticModels.forEach((critic) => {
                const criticResult = (
                  this.graph.models[critic.name] as OpenAICritic
                ).result;
                criticResult?.cons.forEach(({ name, con }) => {
                  if (name === actor.name) cons.push(con);
                });
                criticResult?.pros.forEach(({ name, pro }) => {
                  if (name === actor.name) pros.push(pro);
                });
              });
              const prompt = `Regenerate the answer.
              Here is pros for the previous answer:
              ${pros.join("\n")}
              Here is cons for the previous answer:
              ${cons.join("\n")}`;
              stream = model.streamRegenerateResponse(prompt);
            } else {
              stream = model.streamGenerateResponse(state.prompt);
            }
            for await (const chunk of stream) {
              this.events.trigger("actor-response", {
                name: actor.name,
                payload: chunk.content,
              });
              if (chunk.isComplete) {
                actorResponses[actor.name] =
                  chunk.fullResponse.content.toString();
                this.events.trigger("actor-generation", {
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
      }
    );

    const criticsNode = this.graph.createNode(
      "criticsNode",
      async (state, models) => {
        console.log("critics node", state);
        const criticResponses = { ...state.criticResponses };

        const actorResponses = Object.keys(state.actorResponses).map(
          (name) => ({
            name,
            option: state.actorResponses[name],
          })
        );

        const filteredModels = this.criticModels.filter(
          (critic) =>
            state.criticAttempts === 0 ||
            (state.criticAttempts > 0 && this.graph.models[critic.name].error)
        );

        const responses = await Promise.allSettled(
          filteredModels.map(async (critic) => {
            const model = models[critic.name] as OpenAICritic;
            this.events.trigger("critic-generation", {
              name: critic.name,
              payload: true,
            });
            const answer = await model.generateResponse(
              state.prompt,
              actorResponses
            );
            return {
              name: critic.name,
              answer,
            };
          })
        );

        responses.forEach((response) => {
          if (response.status === "fulfilled") {
            criticResponses[response.value.name] =
              response.value.answer.content;
          }
        });

        Object.keys(criticResponses).forEach((name) => {
          const criticModel = this.graph.models[name] as OpenAICritic;
          this.events.trigger("critic-response", {
            name,
            payload: criticModel.result?.choice ?? "",
          });
          this.events.trigger("critic-generation", {
            name,
            payload: false,
          });
        });

        return {
          criticAttempts: state.criticAttempts + 1,
          criticResponses,
        };
      }
    );

    const choiseNode = this.graph.createNode("choiseNode", async (state) => {
      console.log("choise node", state);
      const choises: Record<string, number> = {};
      this.actorModels.forEach((actor) => {
        choises[actor.name] = 0;
      });
      this.criticModels.forEach((critic) => {
        const criticModel = this.graph.models[critic.name] as OpenAICritic;
        const choise = criticModel.result?.choice;
        if (choise) choises[choise]++;
      });
      const maxChoise = Math.max(...Object.values(choises));
      const maxChoiseInPercent = (maxChoise / this.criticModels.length) * 100;
      if (maxChoiseInPercent < this.choiseThreshold) return { choise: null };
      const chosenActor = Object.keys(choises).find(
        (name) => choises[name] === maxChoise
      )!;
      this.events.trigger("choise", {
        name: chosenActor,
        payload: state.actorResponses[chosenActor],
      });
      return {
        choise: state.actorResponses[chosenActor],
      };
    });

    const regenerationNode = this.graph.createNode(
      "regenerationNode",
      async (state) => {
        console.log("regeneration node", state);
        this.events.trigger("regeneration");
        return {
          regeneration: true,
          actorAttempts: 0,
          criticAttempts: 0,
        };
      }
    );

    this.graph.createEdge({
      from: Graph.START_EDGE,
      to: actorsNode,
    });
    this.graph.createConditionalEdge({
      from: actorsNode,
      to: [
        {
          to: actorsNode,
          condition: (state) =>
            state.actorAttempts < this.maxGenerationAttempts &&
            this.actorModels.some(({ name }) => this.graph.models[name].error),
        },
      ],
      defaultTo: criticsNode,
    });
    this.graph.createConditionalEdge({
      from: criticsNode,
      to: [
        {
          to: criticsNode,
          condition: (state) =>
            state.criticAttempts < this.maxGenerationAttempts &&
            this.criticModels.some(({ name }) => this.graph.models[name].error),
        },
      ],
      defaultTo: choiseNode,
    });
    this.graph.createConditionalEdge({
      from: choiseNode,
      to: [
        {
          to: regenerationNode,
          condition: (state) => state.choise === null,
        },
      ],
      defaultTo: Graph.END_EDGE,
    });
    this.graph.createEdge({
      from: regenerationNode,
      to: actorsNode,
    });

    this.compiledGraph = this.graph.compile();
  }

  public setChoiseThreshold(threshold: number) {
    this.choiseThreshold = threshold;
  }

  public setMaxGenerationAttempts(attempts: number) {
    this.maxGenerationAttempts = attempts;
  }

  public setActorModels(models: ModelType[]) {
    this.actorModels.forEach((model) => {
      this.graph.removeModel(model.name);
    });
    this.actorModels = models;
    this.actorModels.forEach((model) => {
      const actor = new OpenAIActor({
        name: model.name,
        model: getChatModel(model.model as any, model.temperature),
      });
      this.graph.addModel(actor);
    });
  }

  public setCriticModels(models: ModelType[]) {
    this.criticModels.forEach((model) => {
      this.graph.removeModel(model.name);
    });
    this.criticModels = models;
    this.criticModels.forEach((model) => {
      const critic = new OpenAICritic({
        name: model.name,
        model: getChatModel(model.model as any, model.temperature),
      });
      this.graph.addModel(critic);
    });
  }

  public async invoke(prompt: string) {
    return this.compiledGraph.invoke({
      prompt,
      choise: null,
      actorAttempts: 0,
      criticAttempts: 0,
      actorResponses: {},
      criticResponses: {},
      regeneration: false,
    });
  }
}
