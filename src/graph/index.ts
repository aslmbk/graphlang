import { fal } from "@fal-ai/client";
import textGen from "./text-graph";

fal.config({
  credentials: import.meta.env.VITE_FAL_KEY,
});

export { textGen };
