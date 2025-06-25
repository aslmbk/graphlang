import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = Record<string, unknown>;

type Actions = Record<string, unknown>;

const defaultState: State = {};

export const state = create<State & Actions>()(
  persist(
    () => ({
      ...defaultState,
    }),
    {
      name: "state",
    }
  )
);
