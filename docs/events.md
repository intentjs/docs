---
title: Events in Intent.js - Event-Driven Architecture Made Simple
description: Learn how to implement event-driven architecture in Intent.js applications. Master event dispatching, listeners, and queueable events with practical examples. Perfect for decoupling business logic and building scalable applications.
keywords: Intent.js events, event-driven architecture, event listeners, queueable events, observer pattern, event dispatching, application events
image: /images/events-management.png
---
# Events

Intent offers a simple yet useful implementation of the observer pattern, allowing you to listen to various events that occur within your application. Event classes are typically stored in the `app/events` directory, and listeners are stored in the `app/events/listeners` directory. When you create your first event and listeners, these directories will get created automatically.

Events provide a great mechanism to decouple your business logic which do not depend on each other. Let's understand it better with the help of an example: Let's say you are building a book store, when a user orders a book, we want to send them a notification.

1. Send "Order Successful" notification.
2. Send a notification to Seller as well.
3. Do some 3rd party API calls

See how the above mentioned points, do not depend on each other, they can run independently and complete their own specified task. Instead of coupling the logic, we can simply trigger an `OrderPlaced` event which listeners can receive and use to dispatch notifications.

## Generating Events and Listeners

### Using intent command

To quickly generate events and listeners, you can make use of `make:event` and `make:listener` commands. The events and listeners by default are stored inside the `app/events` and `app/events/listeners` directories respectively.

```bash
node intent make:event order_placed
node intent make:listener order_placed --event=order_placed
```

This would generate the following files and classes.

```ts filename="app/events/orderPlacedEvent.ts"
import { EmitsEvent, Event } from '@intentjs/core/events';

@Event('order_placed')
export class OrderPlacedEvent extends EmitsEvent {
  constructor() {
    super();
  }
}
```

```ts filename="app/events/listeners/orderPlacedListener.ts"
import { Injectable } from '@intentjs/core';
import { ListensTo } from '@intentjs/core/events';

@Injectable()
export class OrderPlacedListener {
  @ListensTo('order_placed')
  async handle(data: Record<string, any>): Promise<void> {
    // write your code here...
  }
}
```

Also, the listener class automatically gets registered inside the `module.ts` file as a provider.

### Defining Events

To create an event class, you can create a class similar to below inside the `app/events` directory. An event class is a data container which holds the information related to the event

```ts filename="app/events/orderPlacedEvent.ts"
import { EmitsEvent, Event } from '@intentjs/core/events';

@Event('order_placed')
export class OrderPlacedEvent extends EmitsEvent {
  constructor() {
    super();
  }
}
```

As you can see, the event class doesn't contain any logic, and whatever data we pass to this event shall automatically be passed to all listeners. Event class has a few configuration options available, which we will see in later sections.

### Defining Listeners

To create a listener for a particular event, we can utilize the `@ListensTo` decorator from the `@intentjs/core` package.

:::info
All of the listeners only receive the normalised form of the all the data passed to the event.
:::

```ts filename="app/events/listeners/orderPlacedListener.ts"
import { Injectable } from '@intentjs/core';
import { ListensTo } from '@intentjs/core/events';

@Injectable()
export class OrderPlacedListener {
  @ListensTo('order_placed')
  async handle(data: Record<string, any>): Promise<void> {
    // write your code here...
  }
}
```

Since the listener classes needs to be discovered, you will have to register it inside the `providers` array in the `module.ts` file.

Intent will automatically scan the class and store it as a listener for the specific event. Also, it will look for `handle` method inside the listener class at the time of booting up the application.&#x20;

## Dispatching Events

To dispatch an event, you can make either use of the `emit()` method on the event class, or `Emit()` helper method. You can access the `emit` method after creating an instance of the event class.

Let's take a look on how to use the `emit` method.

```typescript
const order = { id: 123, product: "A book" };
const event = new OrderPlacedEvent(order);
event.emit();
```

If you would like to conditionally dispatch an event, you can make use of either `emitIf` or `emitUnless` method.

As the name suggest, `emitIf` will only emit event if the `condition` evaluates to `true`.
```typescript
const order = { id: 123, product: "A book" };
const event = new OrderPlacedEvent(order);
event.emitIf(condition);
```

Unlike `emitIf`, if you would like to only emit an event if the `condition` evalues to `false`, then you can use `emitUnless` method.

```typescript
const order = { id: 123, product: "A book" };
const event = new OrderPlacedEvent(order);
event.emitUnless(condition);
```

For a better readability, Intent also ships and `Emit` method which accepts multiple events which can emit simulataneously.

```typescript
import { Emit } from '@intentjs/core/events';

Emit(
  new OrderPlacedEvent(order);
  new SomeOtherEvent(order);
)
```

Similar to the `emitIf` and `emitUnless` method, you can use also `EmitIf` and `EmitUnless` methods to conditionally dispatch your events. The only change in this is that you pass the condition as the first logic. This helper method helps you avoid the `condition` multiple times.

```typescript
import { Emit, EmitUnless } from '@intentjs/core/events';

EmitIf(
  condition,
  new OrderPlacedEvent(order),
  new SomeOtherEvent(order)
);

EmitUnless(
  condition,
  new OrderPlacedEvent(order),
  new SomeOtherEvent(order)
);
```

## Queuable Events

If your listeners are going to perform slow tasks like sending notifications, emails or making an HTTP request, Queueable Events can be beneficial for you. Events internally make use of the Intent [Queue](./queues.md) to do so.

Making an events queueable means it will be processed automatically via the configured queue. To make an event to go through queue, you will need to implement `QueueableEvent` interface and implement the `shouldBeQueued` method. 

Doing so, you may define `connection`, `queue`, or `delay` properties.

```typescript
import { Event, QueueableEvent } from "@intentjs/core/events";

export class OrderPlacedEvent extends Event implements QueueableEvent {
  /**
   * The name of the connection on which the event should be sent to.
   * Leave it blank to use the configured queue for the connection.
   */
  public connection = "sqs";

  /**
   * The name of the queue on which the event should be sent to.
   * Leave it blank to use the configured queue for the connection.
   */
  public queue = "order_notifications";

  /**
   * The delay(in seconds) before the job should be processed.
   */
  public delay = 50;

  constructor(public order: OrderModel) {
    // your logic here.
  }

  shouldBeQueued(): boolean | JobOptions {
    return true;
  }
}
```

If you would like to define the event's queue connection, queue name, or delay at the runtime, you can return an object implementation of `JobOptions` from the `shouldBeQueued` method.

```typescript
shouldBeQueued(): boolean | JobOptions {
  return {
    connection: 'redis',
    delay: 0,
  };
}
```

### Conditionally queueing events

Just like `emitIf` method, you can make use of `shouldQueue` method inside the event class to determine if the event should be queued and processed or not. Returning `true` will mean the event will be queued and processed, and `false` means it will neither be queued, nor be processed.

```typescript
shouldBeQueued(): boolean {
  return this.order.isConfirmed;
}
```
