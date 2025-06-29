// import { RunnableLambda, RunnableSequence } from "@langchain/core/runnables";
// import { fal } from "@fal-ai/client";

// const falaiImageGenerator = RunnableLambda.from(
//   async ({ prompt }: { prompt: string }) => {
//     console.log("prompt", prompt);
//     const result = await fal.subscribe("fal-ai/flux/dev", {
//       input: { prompt },
//     });
//     return { imageUrl: result.data.images[0].url };
//   }
// );

// const falaiImageChain = RunnableSequence.from([
//   (raw: string) => {
//     console.log("raw", raw);
//     return { prompt: raw };
//   },
//   falaiImageGenerator,
// ]);

// export { falaiImageChain };
