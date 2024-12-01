---
title: Error Handling
description:
image:
---
# Error Handling

Intent utilises `ExceptionFilter` by NestJS. When you create a new app, it comes with an HTTP Exception Filter which you can customise as per your need. You can make changes to the `handleHttp` method as per your need.

When you start a new Intent application, it comes pre-configured with an `ApplicationExceptionFilter` located inside `app/errors/filter.ts` directory.

Your application comes with out-of-the-box `Sentry` integration, making it easier for you to report your errors directly to Sentry. We will see how we can do it.

## Configuration

You can configure your exception filter by changing settings inside the `config/app.ts` file. It comes with a few default configuration which provides elegant error handlings in your application.

```ts
import { configNamespace, toBoolean, AppConfig, ValidationErrorSerializer } from '@intentjs/core';

export default configNamespace(
  'app',
  () =>
    ({
      name: process.env.APP_NAME || 'NestJS App',
      env: process.env.APP_ENV || 'local',
      debug: toBoolean(process.env.APP_DEBUG || true),
      url: process.env.APP_URL || 'localhost',
      port: +process.env.APP_PORT || 5000,
      cors: { origin: true },
      locale: 'en',
      currency: 'INR',

      error: {
        validationErrorSerializer: ValidationErrorSerializer,
      },

      sentry: {
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: 1.0,
        profilesSampleRate: 1.0,
        integrateNodeProfile: true,
      },
    }) as AppConfig,
);

```
### Debug Mode

The `debug` option in `config/app.ts` file determines how much information shall be exposed in the response. By default, this settings is based on `APP_DEBUG` environment variable.

### Validation Error Serializer
Using the `validationErrorSerializer` config you can customise the validation error object which is passed to the client whenever there is a `422` exception.

Intent comes with a default serializer `ValidationErrorSerializer` which should be good enough, however you can change it by providing your own custom class.


```ts
import { ValidationError } from 'class-validator';
import { isEmpty, Str } from '@intentjs/core';

export class CustomValidationErrorSerializer {
  async handle(errors: ValidationError[]): Promise<Record<string, any>> {
    // add your custom logic here.
    return '';
  }
}
```
## Handling Exceptions

To handle `HttpException` inside your application, the `ApplicationExceptionFilter` comes with a `handleHttp` method, where you can write your own logic for handling a custom exception.

Let's say you want to handle `ValidationFailed` exception, you can do it like below

```ts
handleHttp(exception: any, req: Request, res: Response) {
    if (exception instanceof ValidationFailed) {
        return res.send(422).send({ error: 'validation failed' });
    }
    return res.status(this.getStatus(exception)).send(exception);
}
```

## Reporting Exceptions

There can be situations when you don't to report an exception to other tools like `Sentry` or some custom error listener, in such cases, you can add your exception
to the `doNotReport` method in your `ApplicationExceptionFilter`.

Let's say we don't want to report the `ValidationFailed` exceptions to Sentry, you can simply add it in the `doNotReport` array, and it will never be reported.

```ts
doNotReport(): Array<Type<HttpException>> {
    return [
        ValidationFailed
    ];
}
```

### Sentry Integration

We have added support for Sentry in Intent, so that you don't have to set it up manually. To start reporting your errors to Sentry, we first need to follow a few steps

```bash
npm i @sentry/node --save
```

If you would also like to enable Sentry Node Profiling in your application, you can also install

```bash
npm i @sentry/profiling-node --save
```

Now that the essential packages are installed, we just need to configure the `SENTRY_DSN` attribute in the `.env` file. You can get this value from the Sentry console.

:::info
Intent will only report errors which are not added in the `doNotReport` array.
:::