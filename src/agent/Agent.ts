/* eslint-disable @typescript-eslint/no-explicit-any */
import { Graph } from "../graph/Graph";
import { Annotation, type CompiledGraph } from "@langchain/langgraph/web";
import { OpenAIActor } from "./models/OpenAIActor";
import { OpenAICritic } from "./models/OpenAICritic";
import { getChatModel, MODELS } from "./models/models";

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

const ACTORS = [
  {
    name: "actor1",
    model: MODELS.xai.grok_3,
    temperature: 0.2,
  },
  {
    name: "actor2",
    model: MODELS.xai.grok_3,
    temperature: 0.5,
  },
];

const CRITICS = [
  {
    name: "critic1",
    model: MODELS.deepseek.deepseek_r1_0528,
    temperature: 0.2,
  },
  {
    name: "critic2",
    model: MODELS.deepseek.deepseek_r1_0528,
    temperature: 0.5,
  },
];

const MAX_ATTEMPTS = 3;
const MIN_CHOISES = 2;

export class Agent {
  private graph: Graph<typeof StateAnnotation>;
  private compiledGraph: CompiledGraph<any>;

  constructor() {
    this.graph = new Graph(StateAnnotation);

    ACTORS.forEach((act) => {
      const model = getChatModel(act.model, act.temperature);
      const actor = new OpenAIActor({
        name: act.name,
        model,
      });
      this.graph.addModel(actor);
    });

    CRITICS.forEach((crit) => {
      const model = getChatModel(crit.model, crit.temperature);
      const critic = new OpenAICritic({
        name: crit.name,
        model: model,
      });
      this.graph.addModel(critic);
    });

    const actorsNode = this.graph.createNode(
      "actorsNode",
      async (state, models) => {
        const actorResponses = { ...state.actorResponses };

        const responses = await Promise.allSettled(
          ACTORS.map(async (actor) => {
            const model = models[actor.name] as OpenAIActor;
            let answer: any;
            if (state.regeneration) {
              const pros: string[] = [];
              const cons: string[] = [];
              CRITICS.forEach((critic) => {
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
              answer = await model.regenerateResponse(prompt);
            } else {
              answer = await model.generateResponse(state.prompt);
            }
            return {
              name: actor.name,
              answer,
            };
          })
        );

        responses.forEach((response) => {
          if (response.status === "fulfilled") {
            actorResponses[response.value.name] =
              response.value.answer.content.toString();
          }
        });

        return {
          actorAttempts: state.actorAttempts + 1,
          actorResponses,
        };
      }
    );

    const criticsNode = this.graph.createNode(
      "criticsNode",
      async (state, models) => {
        const criticResponses = { ...state.criticResponses };

        const actorResponses = Object.keys(state.actorResponses).map(
          (name) => ({
            name,
            option: state.actorResponses[name],
          })
        );

        const responses = await Promise.allSettled(
          CRITICS.map(async (critic) => {
            const model = models[critic.name] as OpenAICritic;
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

        return {
          criticAttempts: state.criticAttempts + 1,
          criticResponses,
        };
      }
    );

    const choiseNode = this.graph.createNode(
      "choiseNode",
      async (state, models) => {
        const choises: Record<string, number> = {};
        ACTORS.forEach((actor) => {
          choises[actor.name] = 0;
        });
        CRITICS.forEach((critic) => {
          const criticModel = this.graph.models[critic.name] as OpenAICritic;
          const choise = criticModel.result?.choice;
          if (choise) choises[choise]++;
        });
        const maxChoise = Math.max(...Object.values(choises));
        const chosenActor = Object.keys(choises).find(
          (name) => choises[name] === maxChoise
        )!;
        if (maxChoise < MIN_CHOISES) return { choise: null };
        console.log("info", state, models);
        return {
          choise: state.actorResponses[chosenActor],
        };
      }
    );

    const regenerationNode = this.graph.createNode(
      "regenerationNode",
      async () => {
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
            state.actorAttempts < MAX_ATTEMPTS &&
            ACTORS.some(({ name }) => this.graph.models[name].error),
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
            state.criticAttempts < MAX_ATTEMPTS &&
            CRITICS.some(({ name }) => this.graph.models[name].error),
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
