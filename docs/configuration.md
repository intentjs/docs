---
title: Configuration
description:
image:
---

# Configuration

All of the configurations for your application are stored inside `config` directory. We have tried to document as much options as possible, so you can go through them at your own pace.

IntentJS comes packed with pre-defined configurations for databases, caches, filesystems, http settings, etc. You can use the same folder to create your own configurations and use them as needed in the application.

## Environment Variables

IntentJS makes use of `dotenv` package to read environment variables from your .env files. Environment variables are useful when you are building application for multi-environments, this gives you the flexibility to keep your environment specific values isolated. For example, you can run a db on localhost when developing the app on your system, whereas in Prod it is likely that you will be using some server to host your db.

One added advantage of using Environment Variables is that it helps you keep your sensitive values as hidden and keep them away from unnecessary access.

IntentJS already makes use of some environment variables to configure database, cache, filesystems, queue, http, mailers etc. It should be already setup when you created your application using `create-intent-app` command. You can see all of the environment variables inside `.env`, and `.env.example` files.

## Create a custom configuration

While IntentJS comes with pre-defined configurations, you can always come across instances where you will need to create your own custom configuration. In this section, you will learn how to create your own configuration.

All of the configs are stored inside the `config` directory present at the root.

Let's say you want to create a namespaced config with `settings` name, you can do so by creating a file `config/settings.ts`.

This is how your config will look

```ts [config/settings.ts]
import { configNamespace } from '@intentjs/core/config';

export default configNamespace('settings', () => ({
  yourCustomConfigSetting: true
}));

```

After creating the `settings` namespace, we now need to register it. You can simply export the `settings` namespaced config from the `config/index.ts` file.

```ts
import settings from './settings';

export default [
  settings,
  // other configs
];
```

## Accessing the configuration values

If you want to refer the configuration inside your application, you can make use `IntentConfig` class.

```typescript
import { ConfigService } from '@intentjs/core/config';

export class AppService {
  constructor(private config: ConfigService) {}

  async getName() {
    const appName = this.config.get("app.name");
    return appName;
  }
}
```

:::info
  `IntentConfig` is optimised for performance as it automatically caches your
  config the first time you request any config by it's key. We recommend using
  `IntentConfig`.
:::

## Reserved Namespaces

Following namespaces are reserved for IntentJS.

:::warning
  Changing the namespaces can potentially cause some unexpected behaviour in the
  code, and ultimately result in some functionality not working.
:::

|Namespace| File Path|
|---|---|
|`app` | [`config/app.ts`](https://github.com/intentjs/new-app-starter/blob/main/config/app.ts)|
|`db` | [`config/db.ts`](https://github.com/intentjs/new-app-starter/blob/main/config/db.ts) |
| `cache` | [`config/cache.ts`](https://github.com/intentjs/new-app-starter/blob/main/config/cache.ts) |
| `filesystem` | [`config/filesystem.ts`](https://github.com/intentjs/new-app-starter/blob/main/config/filesystem.ts) |
| `http` | [`config/http.ts`](https://github.com/intentjs/new-app-starter/blob/main/config/http.ts) |
| `localization` | [`config/localization.ts`](https://github.com/intentjs/new-app-starter/blob/main/config/localization.ts) |
| `logger` | [`config/logger.ts`](https://github.com/intentjs/new-app-starter/blob/main/config/logger.ts)|
| `mailer` | [`config/mailer.ts`](https://github.com/intentjs/new-app-starter/blob/main/config/mailer.ts) |
| `queue` | [`config/queue.ts`](https://github.com/intentjs/new-app-starter/blob/main/config/queue.ts) |

## Best Practices

This section mentions some of the best practices when it comes to managing and accessing configurations in your applications.

✅ We recommend keeping the usage of `process.env` limited to the `config` directory only. You can then read the values from the IntentConfig class. Another reason of doing this is that reading process.env will be a little slow as compared to reading the value from `ConfigService` class.