---
title: Reflectors
description: Using Reflections in IntentJS.
image:
---

# Reflectors

Intent provides the option to set custom metadata on controllers and retrieve these values inside your guards. For this, we make use of `Reflectors`,
a custom class to handle the metadata in Intent on your behalf.

You can use `Reflector` class to create decorators, set metadata and get these values. Let's take a look how can you can use `Reflector`.

To create a typed decorator in Intent, you can use `Reflector.createDecorator` method, specify the type argument. For example, let's create a
`HasRoles` decorator

```ts
import { Reflector } from '@intentjs/core';

const HasRoles = Reflector.createDecorator<string[]>();

// equivalent to

const HasRoles = <TParams=any>(metadataValue: TParam) =>
  (target: object | Function, key?: string | symbol, descriptor?: any) => {
    if (descriptor) {
      Reflect.defineMetadata(metadataKey, metadataValue, descriptor.value);
      return descriptor;
    }

    Reflect.defineMetadata(metadataKey, metadataValue, target);
    return target;
  };
```

The `HasRoles` here is a function which accepts `string[]` argument.

You can also pass a custom decorator key as an argument if you plan to read the metadata by yourself.

```ts
const HasRoles = Reflector.createDecorator<string[]>('hasRoles');
```

Once you created the decorator, you can now use it directly inside your controller.

```ts
import { Controller, Get } from '@intentjs/core';
import { HasRoles } from '../decorators'

@Controller('/users/')
@HasRoles(['admin'])
export class UserController {
  constructor() {}
}
```

Here we have attached the `HasRoles` decorator to the `UserController` class, indicating that only users with `admin` role should be allowed to
access this route. You can also attach the `HasRoles` decorator to the controller's method.

```ts
@Get('')
@HasRoles(['manager'])
async create() {
    return 'Hello with an intent!';
}
```

After setting the metadata, we will now need to read it inside our guard. To access a route's custom metadata, you can make use of `Reflector` class inside your guard.
The `Reflector` is automatically injected as 3rd argument in you Guard's `guard` method.

```ts
import { HasRoles } from '../decorators';

const requiredRoles = reflector.getFromClass(HasRoles); // returns ['admin']
```

If you want to read data from the controller's handler method, you can use `getFromMethod` method.

```ts
const requiredRoles = reflector.getFromMethod(HasRoles); // returns ['manager']
```

Since, `HasRoles` is just a function, so you can use it anyway you like, and also attach it to the controller class and method both. For example,

```ts
import { Controller, Get } from '@intentjs/core';
import { HasRoles } from '../decorators'

@Controller('/users/')
@HasRoles(['admin'])
export class UserController {
  constructor() {}

  @Get('')
  @HasRoles(['manager'])
  async create() {
      return 'Hello with an intent!';
  }
}
```
Given the ability to set metadata at multiple levels, you may need to extract and merge all of the custom metadata in different ways. Intent provides two methods
`allAndMerge` and `allAndOverride` to help with this. Let's take a quick look,

If your intent is to specify 'admin' as the default role, and override it selectively for certain methods, you would probably use the getAllAndOverride() method.
`allAndOverride` method will read the data from both, class and method. Returns the method metadata if present, otherwise returns the class metadata.

```ts
const roles = reflector.allAndOverride(HasRoles);
// returns ['manager']
```

If you would like to simply merge all of the metadata values set at all levels, you can just use `allAndMerge` method. This method can merge arrays and objects both.

```ts
const roles = reflector.allAndMerge(HasRoles);
// ['admin', 'manager']
```

# Low Level Approach
Instead of using `Reflector#createDecorator` method, you can also use the in-built `SetMetadata` helper function to quickly set the metadata on a custom class or method.
Let's take how we would create the same `HasRoles` decorator using `SetMetadata`.

```ts
const HasRoles = (...roles: string[]) => SetMetadata('roles', roles);
```

This approach provides a much cleaner approach, and using `SetMetadata` you can also create decorators which accept multiple arguments.

You can now use the `HasRoles` decorator just like how you did it before.

```ts
import { Controller, Get } from '@intentjs/core';
import { HasRoles } from '../decorators'

@Controller('/users/')
@HasRoles(['admin'])
export class UserController {
  constructor() {}
}
```

To access the route's metadata using `Reflector` class, instead of passing the `HasRoles` decorator, you can now simply pass the key with which we set our metadata. For example,

```ts
const roles = reflector.getFromClass('roles');
```