import { Annotation } from "@langchain/langgraph/web";
import type { OpenAIActor } from "../models/OpenAIActor";
import type { OpenAICritic } from "../models/OpenAICritic";
import { Events } from "@/lib/Events";

export type Payload<T> = {
  name: string;
  payload: T;
};

export const StateAnnotation = Annotation.Root({
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

export const ActorModels = new Map<string, OpenAIActor>();
export const CriticModels = new Map<string, OpenAICritic>();
export const GraphEvents = new Events<{
  "actor-response": Payload<string>;
  "critic-response": Payload<string>;
  "actor-generation": Payload<boolean>;
  "critic-generation": Payload<boolean>;
  choise: Payload<string>;
  regeneration: void;
}>();
