---
title: Execution Context
description: Using Execution Context
image:
---
# Execution Context

Whenever Intent receives a request, it encapsulates the `Request`, `Response`, `Controller`, `Route Handler` and `Reflector` class into a single class. The main aim of this is to provide a standardisation across all type of applications and protocols. Whenever you use [Guards](./guards.md) or [Custom Route Param Decorators](./requests.md), you will come across Execution Context.

## Http Context

To access the `Request`, `Response` of the current HTTP Context, you can call the `switchToHttp` method inside the execution context object.

```ts
const httpCtx = ctx.switchToHttp(); // returns an instance of HttpExecutionContext

const req = ctx.getRequest(); // returns the HTTP Request Object
const res = ctx.getResponse(); // returns the HTTP Response Object
```

Using the same `Execution Context`, you could also get the type of the `Controller` class the `Controller#method` type.

```ts
const cls = ctx.getClass();

const method = ctx.getHandler();
```

Fruther, if you would like to read some data from these methods, you can also get the instance of the `Reflector` class from the execution context and use it like below.

```ts
const reflector = ctx.getReflector();

const roles = reflector.getFromMethod('roles');
```

To read more about the `Reflector` class, [click here](./reflectors.md)