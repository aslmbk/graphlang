import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {};

type Actions = {};

const defaultState: State = {};

export const state = create<State & Actions>()(
  persist(
    (set) => ({
      ...defaultState,
    }),
    {
      name: "state",
    }
  )
);
