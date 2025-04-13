---
title: Services
description: Learn how to create and use services in IntentJS applications, including dependency injection, service registration, and integrating services with controllers.
keywords: services, dependency injection, injectable classes, service registration, service providers, controller integration, NestJS providers
image:
---
# Services

Services are an essential concept in Intent, they reuse the same providers that are avaialble in NestJS. Many of the classes that you see here like
Services, Repositories, Console Commands, Jobs, etc, all of them are providers. The main idea of providers is that it can be injected as a dependency inside another `Injectable` class.
This means that the objects can create various relationships with each other, and the responsibility of "wiring up" can be delegated to Nest runtime system.

In "Controllers" document, you saw how you can create a `Controller`, register it and start using it. Well, in a real world scenario, you would need more than just a controller,
you will likely need a separate class called `Services`, this service class now then gets registered inside the `providers`.

## Creating Service

To see service in action, we will need to create a service class first, let's start by creating a `UserService` class inside `app/services` directory.

```ts
import { Injectable } from '@intentjs/core';

@Injectable()
export class UserService {
  constructor() {}

  async create(payload: Record<string,any>) {
  }
}
```

Notice the `Injectable` decorator above the `UserService`, this lets runtime system know that this call will either have some class injected inside it, or this will be injected somewhere.

After creating the `Injectable` class, you will now need to register it inside the `app/boot/sp/app.ts` file. You can read more about
[Service Providers](./service-providers.md) if you are not entirely clear.

```ts
import { ServiceProvider } from '@intentjs/core';
import { UserService } from '#services/user';

export class AppServiceProvider extends ServiceProvider {
  register() {
    this.bind(UserService);
  }
}
```

After these two steps, we can inject the `UserService` inside the `UserController` now. To inject, you just need to pass it as an argument inside the contructor.

```ts
import { Controller, Get, Req, Request } from '@intentjs/core';
import { UserService } from '#services/user';

@Controller('/users')
export class UserController {
  constructor(private service: UserService) {}

  @Get('')
  async create(@Req() req: Request) {
    return this.service.create(req.all());
  }
}
```

The `UserService` is injected through the class constructor. Notice the use of the private syntax. This shorthand allows us to both declare and initialize the `service` member immediately in the same location.

Services are based on providers, if you would like to read more about it, check [here](./providers.md).