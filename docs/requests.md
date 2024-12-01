---
title: Requests
description: Using Requests inside IntentJS Controllers
image:
---
# Requests

IntentJS provides a useful `Request` class. It automatically parses the incoming data, headers, and comes packed with many utilities.

Out of the box Intent supports following `Content-Type`.

- `application/json`
- `text/plain`
- `application/x-www-form-urlencoded`
- `multipart/form-data`
- `text/html`
- `application/xml`
- `buffer`
- `binary`

## Using the Request

To get the `Request` object, you will need to type-hint the `Request` class from `@intentjs/core`. The incoming request will automatically be injected into the controller's method.

```ts
import { Req, Request, Controller } from "@intentjs/core";

@Controller('books')
export class BookController {

  @Post('')
  async create(@Req() req: Request) {
    const payload = req.all();
    const name = payload.name
    return { msg: "Book Created Successfully!" };
  }
}
```

In the next section, you will see how can access the data we receive inside the request object using the `Route Param Decorators`

## Route Param Decorators

The request object represents the HTTP Request and has properties of the query string, paramters, HTTP headers, etc. To access these data inside your route handler, you can use the dedicated decorators, such as `@Body()` or `@Query()`. Below is the complete list of decorators and their descriptions available.

| Decorator | Description |
|---|---|
| `@Req()` | The Raw HTTP Request Object |
| `@Res()` | The Raw HTTP Response Object, read more about it [here](./response.md) |
| `@Dto()` | Injects the instance of the class against which you do the typing |
| `@Query(key?: string)` | Injects the value of the key present in the query param, if no key is passed, injects an object. |
| `@Param(key?: string)` | Injects the value of the key present in the path param, if no key is passed, an object is injected. |
| `@Body(key?: string)` | Injects the value of the key present in the body, if no key is passed, an object is injected. |
| `@Header(key? :string)` | Injects the value of the header key passed, if no key is present, all headers are injected. |
| `@IP()` | Injects the IP of the client |
| `@UserAgent()` | Injects the user agent of the client |
| `@Host()` | Injects the `hostname` of the client |
| `@Accepts()` | Injects the `accept` header of the request |
| `@BufferBody()` | Injects the payload as a buffer |

Let's see how we can use these decorators.

### Request

To inject a Raw HTTP request object inside your route handler, you can make use of the `@Req()` decorator.

```ts
@Get('')
async get(@Req() req: Request) {
  console.log(req)
}
```

### DTOs

To enable strict typing inside your request payloads, you can make use of the `@Dto()` decorator. Intent internally uses `class-transformer` to convert the request payload into a strongly typed class instances.

::: code-group

```ts [request-dto.ts]
export class LoginDto {
  email: string;

  password: string;
}
```

```ts [auth-controller.ts]
@Post('login')
async get(@Dto() dto: LoginDto) {
  console.log(dto);
}
```
:::

### Query Params
To inject values received from query string inside your route handler, you can make use of the `@Query` decorator.

```ts
@Post('login')
async get(@Query('page') page: number) {
  console.log(page);
}

@Post('register')
async get(@Query() queryParams: Record<string, any>) {
  console.log(queryParams); // injects the complete query params object
}
```

### Path Params
To inject values received from path parameters inside your route handler, you can make use of the `@Param` decorator.

```ts
@Get('users/:id')
async get(@Param('id') id: string) {
  console.log(id);
}

@Get('users/:id/:key')
async get(@Param() params: Record<string, any>) {
  console.log(params); // injects the complete path params object
}
```

### Body
To inject the values received from path parameters inside your route handler, you can make use of the `@Body` decorator.

```ts
@Post('login')
async get(@Body('email') email: string) {
  console.log(email)
}

@Post('register')
async get(@Body() payload: Record<string, any>) {
  console.log(payload); // injects the complete body object
}
```

### Headers
To inject the headers inside your route handler


```ts
@Post('register')
async get(@Header() headers: Record<string, any>) {
  console.log(headers); // injects the complete headers object
}
```

### IP Address

To inject the IP of the client, you can use the `@IP` decorator.

```ts
@Post('register')
async get(@IP() ip: string) {
  console.log(ip);
}
```

### User Agent

To inject the user agent of the client

```ts
@Post('register')
async get(@UserAgent() agent: string) {
  console.log(agent);
}
```

### Host

To inject the `req.hostname` you can use the `@Host` decorator.

```ts
@Post('register')
async get(@Host() host: string) {
  console.log(host);
}
```

### Accepts Header

To inject the `accepts` header you can use the `@Accepts` decorator.

```ts
@Post('register')
async get(@Accepts() accepts: string) {
  console.log(accepts);
}
```

### Buffer Body
There could be situations where you will need the raw payload of the request for example to calculate `x-signature`. If you would like to get all of the body as a buffer, you can use the `BufferBody` decorator.

```ts
@Post('register')
async get(@BufferBody() bufferBody: Buffer) {
  console.log(bufferBody);
}
```

### Custom Decorator
If you would like to make your own route param decorator, you could do so easily by making use of the `createParamDecorator` function.

```ts [app/http/decorators.ts]
import { createParamDecorator, ExecutionContext } from '@intentjs/core';

export const CustomParam = createParamDecorator(
  (data: any, ctx: ExecutionContext, argIndex: number) => {
    return 'data from custom decorator param';
  },
);
```

## Request Inputs, Host, Path and Methods

:::info
If you are more used to the approach of accessing the `Request` instance inside your route handler, IntentJS provides some helpful methods to perform the same operations that you could do by just using the dedicated decorators we discussed above.
:::

The `Request` instance comes packed with variety of methods.

### Retrieving Inputs from Payload

To retrieve input for a particular key from the `Request` instance, you can use `input` method.

```ts
const name = req.input("sportsperson");
// Virat Kohli
```

You can also pass the second argument as the default value to the `input` method. If the passed key is not present inside the payload, it will return the default value.

```ts
const name = req.input("sportsperson", 'Rohit Sharma');
// Rohit Sharma
```

If you want to get the complete payload from the `req` object, you can use `all` method, this would give you a unified object of `path`, `query` and `body` params.

:::info
The objects are spread in the order of `path`, `query` and `body`. So all the keys present in the body will be overriding the intersecting keys present in `query` and `path` params.
:::

```ts
const inputs = req.all();
```

:::warning
`req.all()` method only works when the `Content-Type` is `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`.
:::

If you want to fetch a value as a string, you can use `string` method

```ts
const str = req.string("name");
```

Alternatively, if you want to fetch a value parsed as a number, you can use the `number` method

```ts
const num = req.number("amount");
```

If you would to fetch a value as a boolean, you can use the `boolean` method, this method returns `true` for all "truthy" values. It would return `true` for 1, "1", true, "true", "yes", "on", for all other values it would return `false`;

```ts
const bool = req.boolean("tncAgreed");
```

:::info
If you try to access values which cannot be typed by `Request`, it will return `undefined`. It doesn't throw error because it can cause errors at runtime.
:::

### Accessing Query Parameters

If you want to specifically access query parameters, you can make use of `query` method inside the `IntentRequest` object.

To access a query param, you can pass the key to the `query` method like below.

```typescript
const query = req.query("page");
```

If you don't pass any argument to it, it would return all query params.

### Input Presence

There can be situations where you want to just check if a particular key is present inside the payload or not. To do so, you can make use of `has` or `hasAny` method.

Using `has` method, you can check if a particular key is present inside the payload or not.

```typescript
if (req.has("email")) {
  // ...
}
```

Similarly, if you want to check if either of keys are available or not, you can pass multiple keys to the same `has` method. It will return true as soon as any of the passed keys are present inside the payload.

```typescript
if (req.has("email", "phone")) {
  // ...
}
```

### Accessing the Headers

Headers are important if you are building a REST API as they provide lots of meta information which you can use in your application. `Request` offers useful methods for headers which you can use.

To get a header by it's key, you can use the `header` method

```typescript
const authorization = req.header("authorization");
```

You can also pass the second argument as the default value to the `header` method. If the passed key is not present inside the payload, it will return the default value.&#x20;

If you want to get all of the headers, you can use the `headers` method.

```typescript
const headers = req.headers();
```

As most of the REST APIs, use `JWT` for authentication, `Request` comes with a `bearerToken` method to help you easily fetch the bearer token without doing the hassle of parsing the header yourself. You can use the method like below

```typescript
const token = req.bearerToken();
```

To check if a request has a specific header, you can make use of `hasHeader` method.

```typescript
if (req.hasHeader("authorization")) {
  // ...
}
```

If you want to check for multiple headers, you can simply pass the headers to the same `hasHeader` method only. It will return true if any one of the header is present inside the request.

```typescript
if (req.hasHeader("authroization", "cookie")) {
  // ...
}
```

### Playing with Content Types

`Request` comes with variety of methods through which you can use to fetch and check for certain content types in your application.

To check if a particular request expects JSON, you can use `expectsJson` method.

```typescript
if (req.expectsJson()) {
  // ...
}
```

To get all acceptable content types you can use `getAcceptableContentTypes` method.

```typescript
const contentTypes = req.getAcceptableContentTypes();
```