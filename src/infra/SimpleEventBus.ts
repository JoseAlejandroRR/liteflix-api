import { IEvent } from '@/domain/events/IEvent'
import { IEventBus } from '@/domain/events/IEventBus'
import { injectable } from 'tsyringe'

@injectable()
export class SimpleEventBus implements IEventBus {
  private handlers: Map<string, Array<(event: IEvent) => Promise<void>>>

  constructor() {
    this.handlers = new Map()
  }

  async emit(event: IEvent): Promise<void> {
    const handlers = this.handlers.get(event.name) || []
    for (const handler of handlers) {
      await handler(event)
    }
  }

  on(eventName: string, handler: (event: IEvent) => Promise<void>): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, [])
    }
    this.handlers.get(eventName)?.push(handler)
  }
}
