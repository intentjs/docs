---
title: Providers
description:
image:
---
# Providers

Providers are an essential concept in Intent, they reuse the same providers that are avaialble in NestJS. Many of the classes that you see here like
Services, Repositories, Console Commands, Jobs, etc, all of them are providers. The main idea of providers is that it can be injected as a dependency inside another `Injectable` class.
This means that the objects can create various relationships with each other, and the responsibility of "wiring up" can be delegated to Nest runtime system.

## Standard Providers

To see providers in action, we we will need to create an injectable class first, in Intent a classic example of Standard Providers can be `Service` class, so let's start by creating a `UserService` class inside `app/services` directory.

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
import { UserService } from 'app/services/user';

export class AppServiceProvider extends ServiceProvider {
  register() {
    this.bind(UserService);
  }
}
```

After these two steps, we can inject the `UserService` inside the `UserController` now. To inject, you just need to pass it as an argument inside the contructor.

```ts
import { Controller, Get, Req, Request } from '@intentjs/core';
import { UserService } from 'app/services/userService';

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

## Dependency Injection

Since Intent is built on top of of NestJS, it makes complete sense to utilise the Nest's in-built Inversion of Control (IoC) container in Intent as well.
All of the dependency injection concepts that you know of Intent is fully valid and applicable in Intent as well (with some syntax changes).

Intent tries to simplify the concept of IoC container with the help of [Service Providers](./service-providers.md). If you are trying out intent for the first time, we recommend reading [`Angular's`](https://angular.dev/guide/di) explanation of Dependency Injection.

To understand, how you can implement it in Intent, you can do so by using [`Service Providers`](./service-providers.md). 

## Property Based Injection

Till now we have seen how to inject properties inside the class constructor methods automatically, it's called constructor-based injection, but there can be cases where your top level class
is dependent on one or multiple providers from the child class. Traditionally, you would have to call `super()` method inside the subclass and pass the injections by yourself. But by using `property-based-injection`,
you can inject properties directly on a property in a class. Let's look at the below example.

```ts
import { Injectable } from '@intentjs/core';

@Injectable()
export class UserBaseService<T> {
  @Inject('PROVIDER_TOKEN')
  provider: T
}
```

:::warning
If your class doesn't extend another class, you should always prefer using constructor-based injection. The constructor explicitly outlines what dependencies are required and provides better visibility than class attributes annotated with @Inject.
:::

## Registering Providers
To register a provider, you can make the following changes to the `app/boot/sp/services.ts`.

```ts
register() {
  this.provide(UserService)
}
```

## Custom Providers

Till now, you have seen how to create `constructor-based` and `property-based` injections, but as your application grows you are likely to be dependent on
several patterns of dependency injection. In this document, we try to explain the same concepts.

Apart from creating standard providers, you can also create your own custom providers using Intent. To do so, you can use class, value, some factory method, etc.

Custom providers can be useful in the following scenarios:
1. When you need to inject a service with complex configuration or initialization logic.
2. Creating providers dynamically based on certain conditions or configurations.
3. Injecting constant values or configuration objects into your application.
4. Injecting simple objects, functions, or primitives that aren't traditional classes.

Besides Standard Providers, Intent offers four additional providers.

1. [Value Providers](#value-providers)
2. [Class Based Providers](#class-based-providers)
3. [Factory Providers](#factory-providers)
4. [Existing Providers](#existing-providers)

### Value Providers
The `bindWithValue` method is useful for injecting constant value inside Intent container, or replacing an implementation of a real object.
Let's say you want to force Nest to mock `UserService` for testing purpose.

```ts
import { ServiceProvider } from '@intentjs/core';
import { UserService } from 'app/services/user';

const mockUserService = {
  create: () => {}
}

export class AppServiceProvider extends ServiceProvider {
  register() {
    this.bindWithValue(UserService, mockUserService);
  }
}
```

In this example, the `UserService` token will be replaced with the `mockUserService` mock object.

### Non-class based provider tokens.

Till now, we have used class as our tokens for injection (the first argument in the `bind*` methods). This is matched
by the standard pattern used with [constructor based injection](#providers) where the class name is also the token. Sometimes, you want the
flexibility to use strings or symbols as the DI token. For example

```ts
import { ServiceProvider } from '@intentjs/core';
import { UserService } from 'app/services/user';

const dbConnection = {
  // db connection logic here...
}

export class AppServiceProvider extends ServiceProvider {
  register() {
    this.bindWithValue('DB_CONNECTION', dbConnection);
  }
}
```

You can now inject the `mockUserService` everywhere by using `@Inject('DB_CONNECTION')` in your application.

```ts
import { Injectable, Inject } from '@intentjs/core';

@Injectable()
export class UserService {
  constructor(
    @Inject('DB_CONNECTION') 
    private readonly db: DbConnection
  ) {}
}
```

### Class Based Providers

The `bindWithClass` method allows you to dynamically determine the class to be injected. Suppose, you want to inject different configuration depending on the current
environment. Let's take a quick look at the example.

```ts
import { ServiceProvider } from '@intentjs/core';

export class AppServiceProvider extends ServiceProvider {
  register() {
    this.bindWithClass(
      ConfigService,by
      process.env.NODE_ENV === 'development'
        ? DevelopmentConfigService
        : ProductionConfigService,
    );
  }
}
```

Let's understand this in detail, you will notice that we have used `ConfigService` as our injection token. For any class that depends on
`ConfigService`, Intent will inject an instance of the provided class (`DevelopmentConfigService` or `ProductionConfigService`) overriding any
default implementation that may have been declared anywhere else.

### Factory Providers

The `bindWithFactory` method allows you to create providers dynamically. The actual provider will be supplied by the value
returned from the factory method. The factory based providers can be simple or complex as needed. A simple factory provider may not depend
on anything, whereas a complex factory provider can itself inject different providers it needs to compute result. For the latter case, the factory
provider syntax has a pair of related mechanisms.

1. The factory method can accept optional arguments.
2. The optional third parameter `inject` in `bindWithFactory` method accepts an array of providers, Intent will resolve and pass
as arguments to the factory method during the initiation process. You can also mark these providers as optionals. Note that the order of the arguments passed in the
factory method and the order of injections in the third argument are correlated, which means Intent will try to inject them in the same order.

```ts
import { ServiceProvider } from '@intentjs/core';

export class AppServiceProvider extends ServiceProvider {
  register() {
    this.bindWithFactory(
      'TEST',
      (config: IntentConfig) => {
        const dbOptions = config.get('db');
        return newConnection(dbOptions);
      },
      [IntentConfig],
    );
  }
}
```

### Existing Providers

There can be cases where you would want to alias an existing provider with a new token, to do so you can use
`bindWithExisting` method. Intent will automatically resolve the token `AliasedUserService` with the previously binded
`UserService` provider.

```ts
import { ServiceProvider } from '@intentjs/core';
import { UserService } from 'app/services/user';

export class AppServiceProvider extends ServiceProvider {
  register() {
    this.bind(UserService);
    this.bindWithExisting('AliasedUserService', UserService);
  }
}
```

## Async providers

Intent also supports the usage of async providers. Let's say you would want to establish connection with the database before you 
can start listening to the HTTP requests, this is where the async providers can help you out. Let's look at a sample implementation of any async provider.

```ts
  this.bindWithFactory(
    'ASYNC_DB_CONNECTION',
    async (config: IntentConfig) => {
      const dbOptions = config.get('db');
      return await newConnection(dbOptions);
    },
    [IntentConfig],
  );
```

Async providers are injected into other components just like any other provider. To inject the above async provider, you can simply do `@Inject('ASYNC_DB_CONNECTION')`
