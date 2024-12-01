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

```bash
node intent make:config settings
```

This command would automatically create a `settings.ts` file inside `config` directory. Using this command automatically registers the `settings` namespace inside your config service. All you need to do now is to populate values and use them inside your application.

## Accessing the configuration values

If you want to refer the configuration inside your application, you can make use `IntentConfig` class.

```typescript
export class AppService {
  constructor(private config: IntentConfig) {}

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

- `app`
- `db`
- `cache`
- `filesystem`
- `queue`
- `logger`
- `cron`
- `locale`

## Best Practices

This section mentions some of the best practices when it comes to managing and accessing configurations in your applications.

✅ We recommend keeping the usage of `process.env` limited to the `config` directory only. You can then read the values from the IntentConfig class. Another reason of doing this is that reading process.env will be a little slow as compared to reading the value from `IntentConfig` class.

✅ Use `IntentConfig` wherever possible, it comes with an internal caching which automatically caches the keys you are accessing during run-time.