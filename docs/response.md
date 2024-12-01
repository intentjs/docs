---
title: Response
description:
image:
---
# Response

IntentJS provides a useful `Response` class which you can use to send back response to your clients. By default whatever value you return from the route handler is processed and accordingly a data is sent back to the client with appropriate headers and body. But you could also make use of the `Response` instance to have more control of the headers, status code, body, etc.

## Returning Response

Let's take a look at how you can send back response from your route handlers.

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

Now whenever the client will call `GET /users` they will get the response of `hello world` with `200 OK` status code and appropriate headers. The value that you return from the handler is sent back to the client.

Similarly you can also send back variety of response to the client. Below mentioned sections will show you how you can send them with or without the `Response` class.

### JSON Response
To send back the JSON response

```ts
import { Controller, Get, Req, Request } from '@intentjs/core';

@Controller('/users')
export class UserController {
  constructor() {}

  @Get('')
  async get(@Req() req: Request) {
    return [{id: 1, name: 'Vinayak'}]; // returns a JSON to the client
  }
}
```

Now if you would like to make use of the `Response` class, you could do so by injecting the `Response` instance using the `@Res` decorator.

```ts
import { Controller, Get, Req, Request } from '@intentjs/core';

@Controller('/users')
export class UserController {
  constructor() {}

  @Get('')
  async get(@Req() req: Request, @Res() res: Response) {
    return res.json([{id: 1, name: 'Vinayak'}]); // this would immediately send back the response to the client.
  }
}
```

### Text Response
There could be cases where you want to send back a text as a response, you could either simply return the `text` from the route handler or else make use of the `res.send` method.

```ts
@Get('')
async get(@Req() req: Request) {
    return "Hello world";
}
```

Now, using the `res.send` method.

```ts
import { HttpStatus } from '@intentjs/core';

@Get('')
async get(@Req() req: Request, @Res() res: Response) {
    return res.status(HttpStatus.OK)
        .type('text')
        .send('Hello world');
}
```

### Streaming Files

Intent also supports streaming file, it comes with a `StreamableFile` class which you can use to send back streams as a response.

```ts
import { HttpStatus, StreamableFile } from '@intentjs/core';

@Get('')
async get(@Req() req: Request) {
    const readStream = createReadStream(
      join(findProjectRoot(), 'storage/uploads/sample-image.jpg'),
    );

    return new StreamableFile(readStream, { type: 'image/jpeg' });
}
```

The Intent Server identifies the instance of `StreamableFile` and returns the file stream with appropriate headers to the client.

## Response Helpers

### Send
`res.send` is a generic method to send back all of your responses except the streams. It only accepts strings as a argument.

```ts
res.send(JSON.stringify({name: 'vinayak'}));
```

:::warning
Calling the `send` method immediately sends back the response, so if you are chaining different methods, make sure that you are calling the `send` method in the last of the chain.
:::

### Type
In most of the cases you should be good with the `json` based response, but for scenarios where it is not sufficient, the `Response` class comes with `type` method which let's you easily set the `mime-type` of the response.

```ts
res.type('text') // 'Content-Type': 'text/plain'

res.type('html') // 'Content-Type': 'text/html'
```

You can read more about the available mime-types [here](https://www.iana.org/assignments/media-types/media-types.xhtml).

### Status Code

By default, all of the HTTP Methods except `@Post()` return `200 OK` status code, only `POST` method returns a `201 Created` status code. You can easily change this behavious by calling the `res.status` method at the handler level.

```ts
res.status(204);
```

### Headers
To specify a custom response header, you can make use of the `res.header` method.

```ts
res.header('x-custom-header', 'value');
```

### Not Found

If would like to send back a `404 Not Found` error to the client, you can simply call `res.notFound()` method from your route handler.

```ts
res.header('x-custom-header', 'value');
```

### Redirection
To redirect an incoming request to a different url, you can make use of the `res.redirect` method.

```ts
res.redirect('https://tryhanalabs.com');
```