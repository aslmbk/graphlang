import { Model } from "@/graph/Model";
import {
  BaseMessage,
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import type { Runnable } from "@langchain/core/runnables";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

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

  public async *streamCall(prompt: string) {
    const systemMessage = new SystemMessage(`You are a helpful assistant.
You have to answer the user's prompt.
Answer should be in the same language as the user's prompt.
Answer shouldn't include any other text than the answer. No additional comments or explanations.
Just the answer. Just do what user asked.`);
    const humanMessage = new HumanMessage(prompt);
    const promptMessages = [systemMessage, ...this.history, humanMessage];
    this._error = false;

    try {
      if (this.model instanceof BaseChatModel) {
        const stream = await this.model.stream(promptMessages);
        let fullContent = "";

        for await (const chunk of stream) {
          const content = chunk.content?.toString() || "";
          fullContent += content;
          yield { content, isComplete: false };
        }

        const response = new AIMessage(fullContent);
        this.history.push(response);
        yield { content: "", isComplete: true, fullResponse: response };
      } else {
        const response = await this.call(prompt);
        yield {
          content: response.content.toString(),
          isComplete: true,
          fullResponse: response,
        };
      }
    } catch (error) {
      this._error = true;
      console.error(error);
      const errorResponse = new AIMessage(
        `I'm sorry, I'm having trouble generating a response. Please try again. ${error}`
      );
      yield {
        content: errorResponse.content.toString(),
        isComplete: true,
        fullResponse: errorResponse,
      };
    }
  }

  public async generateResponse(prompt: string) {
    this.history = [];
    return await this.call(prompt);
  }

  public async *streamGenerateResponse(prompt: string) {
    this.history = [];
    yield* this.streamCall(prompt);
  }

  public async regenerateResponse(prompt: string) {
    return await this.call(prompt);
  }

  public async *streamRegenerateResponse(prompt: string) {
    yield* this.streamCall(prompt);
  }

  public get error() {
    return this._error;
  }
}
