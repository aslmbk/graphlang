import { ChatOpenAI } from "@langchain/openai";
import { Model } from "../graph/Model";
import { MODELS } from "./types";
import {
  BaseMessage,
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";

type OpenAIActorParams = {
  name: string;
  model: MODELS;
  temperature: number;
};

export class OpenAIActor extends Model {
  protected model: ChatOpenAI;
  private history: BaseMessage[] = [];

  private _error: boolean = false;

  constructor(params: OpenAIActorParams) {
    super(params);
    this.model = new ChatOpenAI({
      model: params.model,
      temperature: params.temperature,
      openAIApiKey:
        "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",
    });
  }

  public async call(prompt: string) {
    const systemMessage = new SystemMessage("You are a helpful assistant.");
    const humanMessage = new HumanMessage(prompt);
    const promptMessages = [systemMessage, ...this.history, humanMessage];
    try {
      const response = await this.model.invoke(promptMessages);
      this.history.push(humanMessage, response);
      this._error = false;
      return response;
    } catch (error) {
      this._error = true;
      console.error(error);
      return new AIMessage(
        `I'm sorry, I'm having trouble generating a response. Please try again. ${error}`
      );
    }
  }

  public async generateResponse(prompt: string) {
    this.history = [];
    return await this.call(prompt);
  }

  public async regenerateResponse(prompt: string) {
    return await this.call(prompt);
  }

  public get error() {
    return this._error;
  }
}
