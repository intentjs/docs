---
title: Logging
description: Learn how to implement robust logging in your IntentJS application using the winston-based logging framework, including log levels, transports, and formats.
keywords: logging, winston, log levels, transports, formats, console logging, file logging, HTTP logging, stream logging, debug mode
image:
---

# Logging

When you build a production application, it often becomes crucial for you to know what is going on inside your application. Intent provides a robust `winston` based logging framework that allows you to log messages to files, system error logs. Logging is very crucial for any application. It is used to record any event when something occurs within (or affects) the application.

Application logging is the process of saving application events. With this information in hand, tech pros can assess threats and analyze errors before they disrupt broader business workflows.

Intent comes with simple methods to store all your application logs in the format and storage of your choice.

## Configuration

By default, all of the configurations for loggers are stored inside `config/logger.ts` . You would see a similar configuration as below

```ts copy
import {
  Formats,
  LoggerOptions,
  LogLevel,
  Transports,
} from "@intentjs/core/logger";
import { configNamespace } from "@intentjs/core/config";

export default configNamespace('logger', () => ({
  default: 'app',
  disableConsole: false,
  loggers: {
    app: {
      level: LogLevel.debug,
      transports: [
        { transport: Transports.Console, format: Formats.Default },
        {
          transport: Transports.File,
          format: Formats.Json,
          filename: 'intent.log',
        },
      ],
    },
  },
}));
```

Out of the box, your application comes pre-configured with `file` and `console` based log. 

:::info
All of the logs are stored inside `storage/logs` directory.
:::

### Log Levels

Take note of the `level` configuration option. Intent currently supports the [RFC 5424 specification](https://datatracker.ietf.org/doc/html/rfc5424#page-11). This option determins the minimum "level" a message must be in order to be logged.
Each level is given an integer priority with the most severe being the lowest number and the least one being the highest.

To set the log level in your application, you can make use of the `LogLevel` enum from the `@intentjs/core/logger` package. It currently supports the following levels:

|Level|Description|
|---|---|
|`error`|Whenever you encounter any Exception preventing one or more functionalities from properly functioning and want to log the information about that event|
|`warn`|The log level that indicates that something unexpected happened in the application, a problem, or a situation that might disturb one of the processes. But that doesn't mean that the application failed|
|`info`| The standard log level for logs indicating something happened,the application entered a certain state, some API called, etc.|
|`http`| This level is used to log HTTP request-related messages. HTTP transactions ranging from the host, path, response, requests, etc.|
|`verbose`| The Verbose level logs a message for both the activity start and end, plus the values of the variables and arguments that are used.|
|`debug`| The DEBUG log level should be used for information that may be needed for diagnosing issues and troubleshooting or when running application in the test environment for the purpose of making sure everything is running correctly.|
|`silly`| The current stack trace of the calling function should be printed out when silly messages are called. This information can be used to help developers and internal teams debug problems.|

Whichever `level` you select, the logs having level lower than that will be silenced.

### Supported Transports

|Transport|Description|
|---|---|
|`Default` or [`Console`](https://github.com/winstonjs/winston/blob/master/docs/transports.md#console-transport)|This is the default transport and logs are printed on console.|
|[`File`](https://github.com/winstonjs/winston/blob/master/docs/transports.md#file-transport)|This transport is used to store all your logs in a file.|
|[`HTTP`](https://github.com/winstonjs/winston/blob/master/docs/transports.md#http-transport)|This transport is used to pass an Http url to send all your logs to some host.|
|[`Stream`](https://github.com/winstonjs/winston/blob/master/docs/transports.md#stream-transport)|This transport is used to create a stream of logs and pass/save it according to your accord.|

#### HTTP Transport

If you want to post logs to an `http` endpoint, you can use the `HTTP` transport. 

```ts copy
transports: [
  {
    transport: Transports.Http,
    format: Formats.Json,
    options: {
      host: 'webhook.site',
      path: 'eee28314-b4ae-4706-a45f-719ee7e30a51',
      ssl: true,
    },
  },
],
```

#### Stream Transport

If you want to post logs through a write stream, you can use the `stream` transport.

```ts copy
transports: [
  {
    format: Formats.Default,
    transport: Transports.Stream,
    options: {
      stream: createWriteStream('storage/stream.log'),
    },
  },
]
```

### Formats

Intent supports all of the formats that come preconfigured with `wintson`, so you free to use those formats.

To use any of the format mentioned below, you can use `Formats` enum from `@intentjs/core/logger`;

- `Default`
- `Simple`
- `Align`
- `Cli`
- `Colorize`
- `Combine`
- `Errors`
- `Json`
- `Label`
- `Logstash`
- `Metadata`
- `Ms`
- `PadLevels`
- `PrettyPrint`
- `Printf`
- `Splat`
- `Timestamp`
- `Uncolorize`

### Disable Console Log
If you want to disable console based logs in your non-dev environments, irrespective of the level, transport or format. You can simply set the `disableConsole` value to true.

```ts
disableConsole: true
```

## Writing to Log

You can log almost any type of object. Let's take a simple look at how to do it.

```ts
import { Log } from '@intentjs/core/logger';

const logger = Log();
// returns the default logger

logger.debug('hello world!');
// [debug] 2024-07-20T20:07:24.862Z : "hello world!"
```

You can pass the `logger` name to the `Log` method that we configured in the `config/logger.ts` file to pick a specific logger type.

```ts
const logger = Log("app");
// returnts the "app" logger
```

:::info
If you are using the default configuration, apart from console logging, the log will also be printed in the `storage/logs/intent.log` file.
:::

Following methods are available for different log levels.

```ts
const logger = Log();

logger.debug('hello world!');
logger.verbose('verbose');
logger.info('info');
logger.warn('warn');
logger.error('error', e);
```