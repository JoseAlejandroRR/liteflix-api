import { IEventBus } from '@/domain/events/IEventBus';
import { IEvent } from '@/domain/events/IEvent'

export class MockEventBus implements IEventBus {
  private events: { [key: string]: ((event: IEvent) => Promise<void>)[] } = {};

  async emit(event: IEvent): Promise<void> {
    const handlers = this.events[event.name];
    if (handlers) {
      for (const handler of handlers) {
        await handler(event)
      }
    }
  }

  on(eventName: string, handler: (event: IEvent) => Promise<void>): void {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(handler)
  }

  clearSubscriptions(): void {
    this.events = {}
  }

  getSubscribedEvents(): string[] {
    return Object.keys(this.events)
  }
}
