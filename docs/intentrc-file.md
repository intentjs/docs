---
title: IntentRC File
description: Learn how to configure your IntentJS application using the intentrc.ts file, including server boot settings, debug mode, meta files, and type checking options.
keywords: intentrc.ts, runtime configuration, server boot file, debug mode, meta files, type checking, development settings, watch mode
image:
---

# IntentRC File

`intentrc.ts` file is used to provide the runtime configurations for your application. In this file, you can pass the source root of your application, and dev server configurations like `debug`, `watch assets`, etc.

The file contains the minimum configuration needed to run your application.

```ts
import { defineConfig } from '@intentjs/cli/config';

export default defineConfig({
  /**
   * @description The file to be executed when the server starts.
   */
  serverBootFile: 'server',

  /**
   * @description Whether to enable debug mode.
   */
  debug: true,

  /**
   * @description Whether to watch meta files.
   */
  watchMetaFiles: true,

  /**
   * @description The meta files to be watched.
   */
  metaFiles: [{ path: 'resources/lang/*.json', watch: false }],

  /**
   * @description Whether to enable type checking in dev and build mode.
   */
  typeCheck: false,
});
```

## Configurations

### `serverBootFile`

Intent uses the `serverBootFile` property to understand which file should be called to start the Intent HTTP Server, the file should be present in `boot` directory of your project root mandatorily.

```ts
  /**
   * @description The file to be executed when the server starts.
   */
  serverBootFile: 'server',
```

### `debug`

If you want to run your application in `debug` mode, and have a deeper look of what's happening behind the scenes, then you can setup the `debug: true`. By default, it's `false`.

```ts
  /**
   * @description Whether to enable debug mode.
   */
  debug: true,
```

### `metaFiles`

Intent calls files non-ts files as `meta files`. You may want to copy files like `json`, `pdf`, etc to your `dist` directory and read them inside your code.

You can pass the following type of options to the `metaFiles` attribute, it accepts glob patterns to evaluate the files.

```ts
  /**
   * @description The meta files to be watched.
   */
  metaFiles: [{ path: 'resources/lang/*.json', watch: false }],
```

`metaFiles` can also accept some settings that you want to have different for different glob patterns. For Example,

```ts
  /**
   * @description The meta files to be watched.
   */
  metaFiles: [
    { path: 'resources/lang/*.json', watch: true },
    { path: 'resources/data/*.json', watch: false }
  ],
```

### `watchMetaFiles`

During development, you may want to watch these meta files for their changes and restart the server automatically, you can do so by setting `watchMetaFiles: true` in `intentrc.ts` file.


```ts
  /**
   * @description Whether to watch meta files.
   */
  watchMetaFiles: true,
```

::: tip
The set value of `watchMetaFiles` will only be used for the glob patterns which doesn't have the `metaFiles.*.watch` value set.
:::

### `typeCheck`

Since, Intent is typescript first, it is super crucial for us to have type-checking in place. Intent internally uses `tsc`, `swc` to quickly type-check and transpile your code. You can disable the type check by setting the `typeCheck: false` attribute. By default, the value is `true`.

::: danger
Disabling type checking in your application is not recommended as your code can run into unknown issues.
:::
