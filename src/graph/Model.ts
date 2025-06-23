import { Runnable } from "@langchain/core/runnables";
import { v4 as uuidv4 } from "uuid";

export abstract class Model {
  public name: string;
  public id = uuidv4();
  protected abstract model: Runnable;

  constructor(params: { name: string }) {
    this.name = params.name;
  }

  public abstract call(prompt: string): unknown;

  public abstract get error(): boolean;
}
