import { IEvent } from './IEvent'

export interface IEventBus {
  emit(event: IEvent): Promise<void>
  on(eventName: string, handler: (event: IEvent) => Promise<void>): void
}
