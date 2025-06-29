// import { fal } from "@fal-ai/client";
// import { RunnableLambda } from "@langchain/core/runnables";
// import { Annotation, StateGraph, START, END } from "@langchain/langgraph/web";

// export const StateAnnotation = Annotation.Root({
//   prompt: Annotation<string>({
//     reducer: (_, y) => y,
//     default: () => "",
//   }),
//   imageUrl: Annotation<string>({
//     reducer: (_, y) => y,
//     default: () => "",
//   }),
// });

// const formatPrompt = RunnableLambda.from(
//   ({ prompt }: typeof StateAnnotation.State) => {
//     console.log("do anything");
//     return { prompt };
//   }
// );

// const generateImage = RunnableLambda.from(
//   async ({ prompt }: typeof StateAnnotation.State) => {
//     const result = await fal.subscribe("fal-ai/flux/dev", {
//       input: { prompt },
//     });
//     return { imageUrl: result.data.images[0].url };
//   }
// );

// const graph = new StateGraph(StateAnnotation)
//   .addNode("formatPrompt", formatPrompt)
//   .addNode("generateImage", generateImage)
//   .addEdge(START, "formatPrompt")
//   .addEdge("formatPrompt", "generateImage")
//   .addEdge("generateImage", END)
//   .compile();

// export { graph };
