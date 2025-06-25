import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  clearResponse: (name: string) => void;
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

export const state = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...defaultState,
      setResponse: (name, response) => {
        set({ responses: { ...get().responses, [name]: response } });
      },
      clearResponse: (name) => {
        set({ responses: { ...get().responses, [name]: blankResponse } });
      },
    }),
    {
      name: "state",
    }
  )
);
