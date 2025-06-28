import { Runnable } from "@langchain/core/runnables";
import { BaseMessage } from "@langchain/core/messages";
import { v4 as uuidv4 } from "uuid";

export abstract class Model {
  public name: string;
  public id = uuidv4();
  protected abstract model: Runnable;
  public abstract modelName: string;

  constructor(params: { name: string }) {
    this.name = params.name;
  }

  public abstract call(prompt: string): Promise<BaseMessage>;

  public abstract get error(): boolean;
}
