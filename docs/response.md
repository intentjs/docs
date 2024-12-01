---
title: Response
description:
image:
---
# Response

IntentJS provides a useful `Request` class over express' Request object. It automatically parses the incoming data, headers, and comes packed with many utilities.

## Status Code

By default, all of the HTTP Methods except `@Post()` return `200 OK` status code, only `POST` method returns a `201 Created` status code. You can easily change this behavious by adding the `@HttpCode` decorator at the handler level.

```ts
import { HttpCode } from '@intentjs/core';

@Delete()
@HttpCode(204)
async delete() {
  return;
}
```

## Headers
To specify a custom response header, you can use `@Header` decorator or a library-specific response object.

```ts
import { Header } from '@intentjs/core';

@Post()
@Header('Cache-Control', 'none')
async create() {
  return 'This action adds a new user';
}
```

## Redirection
To redirect a response to a specific url, you can use the `@Redirect()` decorator or a library specific reponse object.

`@Redirect()` takes two arguments, `url` and `statusCode`, both are optional. The default value of statusCode is 302 (Found) if omitted.

```ts
@Get()
@Redirect('https://tryintent.com', 301)
```