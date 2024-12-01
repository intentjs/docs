---
title: Guards
description: Using Guards in IntentJS.
image:
---
# Guards

Guards are single responsibility classes that run before each request and determine whethere the request should be handled or not (like permissions, roles, ACLs, etc.).
Unlike Middlewares, Guards are contextful in nature which means in guards which controller class and method will be called. 
They have access to the instance of [`Reflector`](/reflectors) which lets you access the metadata and perform logic in your guard accordingly.

:::info
Guards are executed after all middlewares.
:::

Guards are `Injectable` in nature, which means you can inject any of your other `Injectable` classes (services, repositories, etc.) inside your guard.

## Writing Guards

Since Guards can only be used during an HTTP request lifecycle, they are stored at `app/http/guards` directory.

Let's create our first guard, `role-guard.ts`.

```ts
import { Injectable, IntentGuard, ExecutionContext } from '@intentjs/core';

@Injectable()
export class RoleGuard extends IntentGuard {
  async guard(ctx: ExecutionContext): Promise<boolean> {
    const userHasNecessaryRoles = true; // change this to your own custom logic.

    if (userHasNecessaryRoles) {
        return true; // pass through guard.
    }

    return false; // aborts the request
  }
}
```

When you crearte a new guard, you extend the `IntentGuard` class and implement the method `guard`. Whenever a new request comes in, the `guard` method runs
and depending on it's return value (`true` or `false`), it passes or fails the guard respectively.

Inside the `guard` method, you get access to only 1 arguments, ie `ExecutionContext`, you can read more about it [here](./execution-context.md).

The `guard` method needs to return `true` or `false` as return values, where `true` means it's a pass and `false` means it's a fail. When a guard fails, it throws a `403` error code.

You can also throw errors directly from your guard. All of the exceptions thrown from the guards are captured inside the [Exception Filters](/error-handling).

```ts
import { Injectable, IntentGuard, ExecutionContext } from '@intentjs/core';

@Injectable()
export class RoleGuard extends IntentGuard {
  async guard(ctx: ExecutionContext): Promise<boolean> {
    const userHasNecessaryRoles = true; // change this to your own custom logic.

    if (!userHasNecessaryRoles) {
        throw new HttpException('User doesn\'t have sufficient roles.')
    }

    return true.
  }
}
```

## Using Guards

After creating guard, we now need to start using it. To do so, we will make use of `UseGuards` decorator.

```ts
import { Controller, Get, UseGuards } from '@intentjs/core';
import { RoleGuard } from '../guards/role-guard'

@Controller('/users/')
@UseGuards(RoleGuard)
export class UserController {
  constructor() {}

  @Get('')
  async create() {
    return 'Hello with an intent!';
  }
}
```

With the help of the `UseGuards` decorator, we bind the `RoleGuard` to the `UserController`, this will ensure that our guard runs everytime whenever there is a new request on `/users` route. The controller will only be executed if the guard have successfully passed.

## Using Reflector
As we discussed earlier that the Guards are contextful, in this section we will see how we can retrieve context and metadata inside our guard.
Let's say you want to make a route accessible to users with `admin` role only, and reject all other roles. To achieve this, we will need to follow these steps.

1. Create a `HasRoles` decorator.
2. Set the decorator on our controller.
2. Read the metadata from the `HasRoles` decorator inside the guard.

Now, let's create our `HasRoles` decorator inside the `http/decorators.ts`
```ts
import { Reflector } from '@intentjs/core';

export const HasRoles = Reflector.createDecorator<string[]>();
```

After creating the `HasRoles` decorator, we can now use it to set the metadata on our controller.

```ts
import { Controller, Get, UseGuards } from '@intentjs/core';
import { RoleGuard } from '../guards/role-guard'
import { HasRoles } from '../decorators'

@Controller('/users/')
@UseGuards(RoleGuard)
@HasRoles(['admin'])
export class UserController {
  constructor() {}

  @Get('')
  async create() {
    return 'Hello with an intent!';
  }
}
```

You can alternatively set the metadata on a route handler as well.

```ts
@Get('')
@HasRoles(['admin'])
async create() {
    return 'Hello with an intent!';
}
```

Now after setting the metadata, we will now need to read the value from `HasRoles` decorator inside our `RoleGuard`.

```ts
import { Injectable, IntentGuard, ExecutionContext } from '@intentjs/core';
import { HasRoles } from '../decorators';

@Injectable()
export class RoleGuard extends IntentGuard {
  async guard(ctx: ExecutionContext): Promise<boolean> {
    const reflector = ctx.getReflector(); // returns an instance of the Reflector class.

    /** If you are setting the metadata on a method, then you can use the `getFromMethod` method. */
    const requiredRoles = reflector.getFromClass(HasRoles); // returns ['admin']
    const user = req.user();

    if (!requiredRoles.includes(user.role)) {
        return false;
    }

    return true;
  }
}
```

You can read more about `Reflector` class [here](./reflectors).

## Global Guards
You can also create Global Guards, which automatically gets applied on every request. You can use the same guard that we created earlier by simply registering
it inside the `http/kernel.ts`.

```ts
import { IntentGuard, Kernel, Type, } from '@intentjs/core';
import { RateLimiter } from './guards/rate-limiter';

export class HttpKernel extends Kernel {
  /**
   * Register all of your global guards here.
   * Guards added in the return array will be
   * applied to all routes by default.
   *
   * Read more - https://tryintent.com/docs/guards
   */
  public guards(): Type<IntentGuard>[] {
    return [RateLimiter];
  }
}
```