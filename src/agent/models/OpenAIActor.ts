import { Model } from "@/graph/Model";
import {
  BaseMessage,
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import type { Runnable } from "@langchain/core/runnables";

type OpenAIActorParams = {
  name: string;
  model: Runnable;
};

export class OpenAIActor extends Model {
  protected model: Runnable;
  private history: BaseMessage[] = [];

  private _error: boolean = false;

  constructor(params: OpenAIActorParams) {
    super(params);
    this.model = params.model;
  }

  public async call(prompt: string) {
    const systemMessage = new SystemMessage("You are a helpful assistant.");
    const humanMessage = new HumanMessage(prompt);
    const promptMessages = [systemMessage, ...this.history, humanMessage];
    this._error = false;
    try {
      const response = await this.model.invoke(promptMessages);
      console.log("actor response", response);
      this.history.push(humanMessage, response);
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
