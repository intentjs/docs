---
title: Service Providers
description: Learn how to create and use Service Providers in IntentJS applications to register and bootstrap services, controllers, and other injectable classes.
keywords: service providers, dependency injection, application bootstrapping, register method, boot method, bind method, bindWithClass, application container
image:
---

# Service Providers

Service Providers are central places where all of the essential services and classes are registered. These are responsible for
registering and loading almost all of Intent's internal classes, and your application classes. In simpler words, whenever you start
Intent application, we use Service Providers to bootstrap all of the `Injectables` and similar services.

Internally, Intent uses Service Providers for loading services for Queue, Mail, Storage, Cache, Console, Controllers, etc. In this example, we will use
it for registering our `Controllers`, `Services`, `Console Commands`, `Event Listeners`, `Queues`, etc.

By default, Intent uses the following service providers to load the applications.

|Service Provider Name|Purpose|
|---|---|
|`app/bootstrap/sp/http.ts`|Registers all of the controllers|
|`app/bootstrap/sp/console.ts`|Registers all of the console commands|
|`app/bootstrap/sp/services.ts` |Registers all of the Services, events, jobs, etc.|

In this document, we will see how to build our own Service Provider classes and use them to register classes and boot them.

## Creating Service Provider

To create a service provider class, you can create a class like below. You can create the service provider classes anywhere inside the app folder, but
we recommend creating them inside `app/boot/sp` directory.

```ts
import { IntentApplication, ServiceProvider } from '@intentjs/core';

export class HttpServiceProvider extends ServiceProvider {
  /**
   * Register any application services here.
   */
  register() {
  }

  /**
   * Bootstrap any application service here.
   */
  boot(app: IntentApplication) {
  }
}
```

As you can see, there are two methods `register` and `boot` methods. As the name suggests, we register all our application services inside
the `register` method. Inside the `boot` method you can put any custom code which you would like to run after the application container has been created.

## Understanding Service Provider

In this section, we will understand how to use the register different type of application services.

### The `register` method

Before the application can be started, we need to initially build the app container. For this, we need to register all of the 
application services which we will need throughout our application. Whatever services we register inside the `register` method,
it is available to you all of the applications and you can use it freely.

The simplest way to register a class inside the DI container is to use the `bind` method inside the `register` method.

```ts
import { ServiceProvider } from '@intentjs/core';
import { UserService } from 'app/services/user';

export class AppServiceProvider extends ServiceProvider {
  register() {
    this.bind(UserService);
  }
}
```

The `bind` method registers the `UserService` in the application DI container, and can now be injected inside any class.

Sometimes, you might want to register some tokenized classes. A most famous example of this would be `Repository Design Pattern`. Usually in this pattern,
we register a repository class with a constant token so that we don't have to change injection everywhere whenever we change the class.
To do so in Intent, you can make use of the `bindWithClass` method.

```ts
register() {
    this.bindWithClass(RepoConstants.ORDER_REPO, OrderDbRepository);
}
```

Now to inject this class at desired place, you can simply do

```ts
import { Injectable, Inject } from '@intentjs/core';

@Injectable()
export class UserService {
    constructor(@Inject(RepoConstants.ORDER_REPO) users: UserDbRepository) {}
}
```

### The `boot` method

In `register` method we understood how we can register application services before we start our application. Now, let's say you want to perform some task
after the application container has been created, how do you do that? For this, you can make use of the `boot` method
available inside the `ServiceProvider` class. You get the global instance of `IntentApplication` which you can use to modify settings.

For example, let's say we want to remove the `x-powered-by` header from our response headers.

```ts
import { ServiceProvider, IntentApplication } from '@intentjs/core';
import { UserService } from 'app/services/user';

export class AppServiceProvider extends ServiceProvider {
  register() {
    this.bind(UserService);
  }

  async boot(app: IntentApplication):Promise<void> {
    app.disable('x-powered-by');
  }
}
```

### The `schedules` method

You may use the `schedules` method to register your [Scheduled Tasks](./task-scheduling.md). The method accepts an argument of `ModuleRef` class which gives you access to all of the `Injectable` classes. Let's take a look at a simple example of a simple schedule.

```ts
  /**
   * Define the schedules for the application.
   *
   * @param ref - The module reference.
   */
  async schedules(ref: ModuleRef): Promise<void> {
    Schedule.call(() => {
      console.log("Hello, world!");
    })
      .everyTwoSeconds()
      .run();
  }
```

## Register Service Providers

After creating service providers, we will now need to register it inside an app container. To do so, you can simply call the 
`provide` method inside the `build` method of the `IntentApplicationContainer`. The default application container is available at
`app.ts` file.

```ts
import { ApplicationContainer } from '@intentjs/core';
import { AppServiceProvider } from './sp/app';

export class AppServiceProviderContainer extends ApplicationContainer {
  build() {
    this.add(AppServiceProvider);
  }
}
```