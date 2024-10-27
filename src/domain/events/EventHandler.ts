import { IEventBus } from './IEventBus'

export abstract class EventHandler {

  constructor(protected eventBus: IEventBus) {
    this.on(eventBus);
  }

  protected abstract on(eventBus: IEventBus): void;
}
