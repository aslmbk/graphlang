import { create } from "zustand";

type Response = {
  payload: string;
  generation: boolean;
  chosen: boolean;
  votes: number;
};

type State = {
  responses: Record<string, Response>;
};

type Actions = {
  setResponse: (name: string, response: Response) => void;
  resetResponse: (name: string) => void;
  clearResponses: () => void;
};

export const blankResponse: Response = {
  payload: "",
  generation: false,
  chosen: false,
  votes: 0,
};

const defaultState: State = {
  responses: {},
};

export const state = create<State & Actions>()((set, get) => ({
  ...defaultState,
  setResponse: (name, response) => {
    set({ responses: { ...get().responses, [name]: response } });
  },
  resetResponse: (name) => {
    set({ responses: { ...get().responses, [name]: blankResponse } });
  },
  clearResponses: () => {
    set({ responses: {} });
  },
}));
