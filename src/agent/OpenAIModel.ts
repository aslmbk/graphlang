import { ChatOpenAI } from "@langchain/openai";
import { Model } from "../graph/Model";
import { MODELS } from "./types";

type OpenAIModelParams = {
  name: string;
  model: MODELS;
  temperature: number;
};

export class OpenAIModel extends Model {
  protected model: ChatOpenAI;

  constructor(params: OpenAIModelParams) {
    super(params);
    this.model = new ChatOpenAI({
      model: params.model,
      temperature: params.temperature,
      openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
    });
  }

  public async call(prompt: string) {
    return await this.model.invoke(prompt);
  }

  public get error() {
    return false;
  }
}
