---
title: Controllers
description:
image:
---
# Controllers

Controllers are the classes responsible for processing the incoming requests and returning requests to the client.

It's prupose is to receive a specific request, perform some business logic and return a response back to the client. 
For the server to know which controller will be handling which requests is made possible by `hyper-express`.

Controllers can group related request handling logic in a class. For example, `UserController` class can handle all incoming
requests related to users.

## Creating Controllers

Controllers are placed inside the `app/http/controllers` directory.

### Manually Creating Controllers

To create a controller manually, you can create a file inside the `app/http/controllers` directory. For example, `user-controller.ts`.

```ts
import { Controller, Get } from '@intentjs/core';

@Controller('/users/')
export class UserController {
  constructor() {}

  @Get('')
  async create() {
    return 'Hello with an intent!';
  }
}
```

For a class to be identified as a controller, it needs to be anotated with `@Controller` decorator from `@intentjs/core`. In this class, we will define our various routes.

### Registering Controller
For Intent to know, you will need to register the `UserController` inside the the `controllers` method in `app/http/kernel.ts`.

```ts
import { Kernel } from '@intentjs/core';
import { UserController } from 'app/http/controllers/users';

export class HttpKernel extends Kernel {
  public controllers(): Type<any>[] {
    return [
      UserController
    ];
  }
}
```

The `HttpKernel` class is then passed to the `IntentHttpServer` inside `main.ts`. 

We don't use `HttpKernel` just for registering controllers, but also for adding global middlewares, route based middlewares and guards. 
If you would like to know more how to use HttpKernel, read [middlewares](/middlewares) and [guards](/guards).

## Routing

### Creating Routes

If you have used `express` in the past, you would remember how the routes were defined in the `express` servers. For example,

```js
// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('hello world')
})
```

In Intent, you can define the same route in your controller, just like below.

```ts
import { Controller, Get, Req, Request } from '@intentjs/core';

@Controller('/users')
export class UserController {
  constructor() {}

  @Get('')
  async get(@Req() req: Request) {
    return 'hello world';
  }
}
```

The `@Get` decorator before the `get` method tells Intent to bind all requests which come to `GET /users` to this method. 
So whenever the client pings `GET /users` they will receive `hello world` as response. 

The method will return a 200 status code and the response, which is a string.

You can also add a subpath in the HTTP request method decorator, for example `@Get('/all')` will bind `GET /users/all` to the method.

### Available Methods

In the previous section, we created an endpoint to fetch list of all users (GET /users). But in real world scenario, you will need multiple endpoints to create, update, delete data.

Intent comes with the support for following methods. 

| Decorator | Http Method |
|---|---|
| `@Get(path?:string)` | `GET` |
| `@Post(path?:string)` | `POST` |
| `@Put(path?:string)` | `PUT` |
| `@Patch(path?:string)` | `PATCH` |
| `@Delete(path?:string)`| `DELETE` |
| `@Options(path?:string)` | `OPTIONS` |
| `@Head(path?:string)` | `HEAD` | 
| `@Any(path?:string)` | `ANY` |

An example of this would be

```ts
import { Controller, Delete, Get, Patch, Post, Put, Req, Request } from '@intentjs/core';

@Controller('/users')
export class UserController {
  constructor() {}

  @Get('')
  async index(@Req() req: Request) {}

  @Post('')
  async create(@Req() req: Request) {}

  @Put(':id')
  async update(@Req() req: Request) {}

  @Patch(':id')
  async patch(@Req() req: Request) {}

  @Delete(':id')
  async delete(@Req() req: Request) {}
}
```

## Request Object

If you are building an endpoint, you will need to access the request object which let's you get the details from the request.
To do so, you can make use of the `@Req` decorator and `Request` class from `@intentjs/core` package.

Intent comes with it's own `Request` utility which is more powerful than those available, you can read more about the `Request` objects [here](/docs/requests).

For example, let's say you want to build an endpoint which creates customer. For this, you will need to create a `POST` handler.

```ts
import { Req, Request, Controller, Post, } from '@intentjs/core';

@Controller('/users')
export class UserController {
  constructor() {}

  @Post('')
  async create(@Req() req: Request) {
    console.log(req.all());
    // your create user logic here...
  }
}
```

There are multiple approaches to using `Requests` inside Intent. You can read about them in detail [here](/docs/requests).

## Route Wildcards

By default, out of the box Intent also supports Pattern based routes as well. For instance, the asterisk `*` is used as wildcard.

```ts
@Get('ab*cd')
findAll() {
  return 'This route uses a wildcard';
}
```

The `ab*cd` route path will match abcd, ab_cd, abecd, and so on. The characters ?, +, *, and () may be used in a route path, and are subsets of their regular expression counterparts. The hyphen ( -) and the dot (.) are interpreted literally by string-based paths.

## Route Parameters

If you wish to accept dynamic data as part of your request, you can make use of the route parameters, for example `GET /users/1` to get user with id 1.
In order to define routes with parameters, we can add route parameter tokens in the part of the route to capture the dynamic value at that position in the request URL.

:::info
Route with parameters should always be declared after any static paths. This prevents the parameterized paths from intercepting the routes destined for static paths.
:::

```ts
@Get(':id')
findOne(@Param('id') id: string) {
  return `This action returns a user with id ${id}.`;
}
```

<!-- ## Sub-Domain Routing

The `@Controller` decorator can take a `host` option to require that the HTTP host of the incoming requests should match the specific value.

```ts
@Controller({host: 'users.tryintent.com'})
export class UserController {
}
```

Similar to route `path`, the `host` option can also take tokenized strings to capture the dynamic value at that position in the host name.

```ts
@Controller({host: ':tenantId.tryintent.com'})
export class UserController {
}
```

If you would like to access these host params, you can make use of the `HostParams` decorator. -->

## Request Payload

There are multiple ways you can retrieve the payload from the request, you can either make use of the `req.all()` method from `Request` object or alternatively make use of the `@Payload()` decorator to retrieve the payload.

```ts
@Controller('/users')
export class UserController {
  constructor() {}

  @Get('')
  async index(@Req() req: Request) {
    const payload = req.all();
  }

  @Post('')
  async create(@Payload() payload: CreateUserDto) {
    console.log(payload);
  }
}
```

:::info
We recommend using `@Payload` decorator as it provides a typed safe object, whereas `req.all` only returns a POJO.
:::