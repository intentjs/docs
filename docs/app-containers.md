---
title: Application Containers
description:
image:
---
# Application Containers

Intent is internally dependent on an application container be it for HTTP server, console commands, cron server or queue commands.
You can think of these containers as an encapsulation of multiple [Service Providers](./service-providers.md). This is done so as to keep
the application lightweight, for example you don't need controllers inside the console commands, queue worker or cron servers. So we will simply
skip adding it inside the relevant application containers.

Intent by default comes with only one application container at `app/boot/container.ts`.

```ts
import { IntentAppContainer } from '@intentjs/core';
import { AppServiceProvider } from './sp/app';

export class ApplicationContainer extends IntentAppContainer {
  build() {
    this.add(AppServiceProvider);
  }
}
```

In the above examples, we are adding our service providers to the default container.