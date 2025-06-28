import { create } from "zustand";
import { CriticModels, GraphEvents, type Payload } from "./state";

type Option = {
  name: string;
  model: string;
  text: string;
  isGenerating: boolean;
};

type Evaluation = Record<
  string, // actor name
  { pros: string[]; cons: string[] }
>;

type Iteration = {
  options: Record<
    string, // actor name
    Option
  >;
  evaluations: Record<
    string, // critic name
    {
      choice: Option | null;
      isGenerating: boolean;
      model: string;
      evaluation: Evaluation;
    }
  >;
};

type Store = { iterations: Iteration[]; choise: string | null };
type Actions = {
  addIteration: () => void;
  streamOption: (params: Payload<string>) => void;
  generatingOption: (params: Payload<boolean>) => void;
  generatingEvaluation: (params: Payload<boolean>) => void;
  setEvaluation: (
    params: Payload<{
      choice: string; // actor name
      evaluation: Record<string, { pros: string[]; cons: string[] }>;
    }>
  ) => void;
  setChoise: (params: Payload<string>) => void;
  clearState: () => void;
};

export const thinking = create<Store & Actions>((set) => ({
  iterations: [],
  choise: null,
  clearState: () => set({ iterations: [], choise: null }),
  addIteration: () =>
    set((state) => ({
      iterations: [...state.iterations, { options: {}, evaluations: {} }],
    })),
  streamOption: ({ name, payload }) =>
    set((state) => {
      const iteration = { ...state.iterations[state.iterations.length - 1] };
      if (!iteration) return state;
      const restIterations = state.iterations.slice(0, -1);
      iteration.options[name].text += payload;
      return { iterations: [...restIterations, iteration] };
    }),
  generatingOption: ({ name, model, payload }) =>
    set((state) => {
      const iteration = { ...state.iterations[state.iterations.length - 1] };
      if (!iteration) return state;
      const restIterations = state.iterations.slice(0, -1);
      iteration.options[name] ??= {
        name,
        model,
        text: "",
        isGenerating: payload,
      };
      iteration.options[name].isGenerating = payload;
      return { iterations: [...restIterations, iteration] };
    }),
  generatingEvaluation: ({ name, model, payload }) =>
    set((state) => {
      const iteration = { ...state.iterations[state.iterations.length - 1] };
      if (!iteration) return state;
      const restIterations = state.iterations.slice(0, -1);
      iteration.evaluations[name] ??= {
        choice: null,
        isGenerating: payload,
        model,
        evaluation: {},
      };
      iteration.evaluations[name].isGenerating = payload;
      return { iterations: [...restIterations, iteration] };
    }),
  setEvaluation: ({ name, payload }) =>
    set((state) => {
      const iteration = { ...state.iterations[state.iterations.length - 1] };
      if (!iteration) return state;
      const choice = iteration.options[payload.choice];
      if (!choice) return state;
      const restIterations = state.iterations.slice(0, -1);
      iteration.evaluations[name].choice = choice;
      iteration.evaluations[name].evaluation = payload.evaluation;
      return { iterations: [...restIterations, iteration] };
    }),
  setChoise: ({ name }) => set({ choise: name }),
}));

GraphEvents.on("start-generation", () => {
  thinking.getState().clearState();
});
GraphEvents.on("actors-node", () => {
  thinking.getState().addIteration();
});
GraphEvents.on("actor-generation", (params) => {
  thinking.getState().generatingOption(params);
});
GraphEvents.on("actor-response", (params) => {
  thinking.getState().streamOption(params);
});
GraphEvents.on("critic-generation", (params) => {
  thinking.getState().generatingEvaluation(params);
});
GraphEvents.on("critic-response", (params) => {
  const evaluation: Evaluation = {};
  const criticModel = CriticModels.get(params.name)!;
  if (!criticModel.result || criticModel.error) return;
  criticModel.result.pros.forEach((pro) => {
    evaluation[pro.name] ??= { pros: [], cons: [] };
    evaluation[pro.name].pros.push(pro.pro);
  });
  criticModel.result.cons.forEach((con) => {
    evaluation[con.name] ??= { pros: [], cons: [] };
    evaluation[con.name].cons.push(con.con);
  });
  thinking.getState().setEvaluation({
    name: params.name,
    model: params.model,
    payload: {
      choice: params.payload,
      evaluation,
    },
  });
});
GraphEvents.on("choise", (params) => {
  thinking.getState().setChoise(params);
});
