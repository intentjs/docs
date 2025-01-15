---
title: Cache
description:
image:
---
# Cache

In some cases, applications may perform resource-intensive operations, such as complex computations or retrieving large amounts of data. These tasks can be time-consuming and put a strain on the CPU. Additionally, if the data doesn't change frequently, it's often beneficial to store it in a cache. This approach allows the application to quickly access the information from the cache instead of making repeated network calls, which can improve performance and reduce system load.

In those cases, you may want to save it in a fast-read store so that you don't need to run the computation again and again. When the data is cached, it can be retrieved quickly on subsequent requests for the same data.

Intent provides a multi-store cache provider for your applications. We support the following caches.

## Configuration

Cache configuration is defined in `config/cache.ts` file. By default, Intent comes with a pre-configured with `local` cache, to use it you don't need to do anything.

### Local Cache

Local cache is a zero-dependency store that you can use without starting any extra server.

```ts
import { CacheOptions, configNamespace } from "@intentjs/core";

export default configNamespace(
  "cache",
  () =>
    ({
      default: "local",
      stores: {
        local: {
          driver: "local",
          prefix: "intentjs",
        },
      },
    } as CacheOptions)
);
```

### Redis Cache

For production related workloads, we recommend using an external cache store like `Redis`. To configure Redis, you can configure your store like below.

If you would like to configure different cache stores, you can do so like below in `config/cache.ts` file:

```typescript
import { CacheOptions, configNamespace } from "@intentjs/core";

export default configNamespace(
  "cache",
  () =>
    ({
      default: "redis",
      stores: {
        redis: {
          driver: "redis",
          host: process.env.REDIS_HOST || "127.0.0.1",
          username: process.env.REDIS_USERNAME || undefined,
          password: process.env.REDIS_PASSWORD || undefined,
          port: process.env.REDIS_PORT || 6379,
          database: process.env.REDIS_DB || 0,
          prefix: "intentjs",
        },
      },
    } as CacheOptions)
);
```

### DiceDB Cache

Intent also supports integration of [DiceDB](https://dicedb.io)(An alternative of Redis with more performance!), you can do so by using the configuration below.

If you would like to configure dicedb cache stores, you can do so like below in `config/cache.ts` file:

```typescript
import { CacheOptions, configNamespace } from "@intentjs/core";

export default configNamespace(
  "cache",
  () =>
    ({
      default: "dicedb",
      stores: {
        dicedb: {
          driver: "dicedb",
          host: process.env.DICEDB_HOST || "127.0.0.1",
          username: process.env.DICEDB_USERNAME || undefined,
          password: process.env.DICEDB_PASSWORD || undefined,
          port: process.env.DICEDB_PORT || 6379,
          database: process.env.DICEDB_DB || 0,
          prefix: "intentjs",
        },
      },
    } as CacheOptions)
);
```

## Usage

Intent ships two `Cache` and `CacheStore` utilities to start interacting with the stores. Both are importable from '@intentjs/core'.

```typescript
// method
import { CacheStore } from "@intentjs/core";
const store = CacheStore();
// returns the default store

// class
import { Cache } from "@intentjs/core";
const store = Cache.store();
// returns the default store
```

If you would like to access a store other than the `default` store, you can pass the name of the store as an arg.

```ts
import { CacheStore } from "@intentjs/core";
const store = CacheStore("redis");
// returns the "redis" store

// class
import { Cache } from "@intentjs/core";
const store = Cache.store("local");
// returns the "local" store
```

### Writing to Cache

To write data to a cache, you can use the `set` method.

```ts
await Cache.store().set("otp", 1234);
// returns true if successfully written

await Cache.store().set("book_name", "Shoe Dog");
// returns true if successfully written
```

Apart from `number` and `strings`, you can also store `objects` or `arrays` in the cache store. It internally converts them to `string` and returns back as POJO objects when you try to get it.

```ts
const books = [
  {
    name: 'Shoe Dog',
    author: 'Phil Knight',
  },
  {
    name: 'The Silva Mind Control Method',
    author: 'José Silva',
  },
];

await Cache.store().set('books', books);
```

If you want your cache to only be valid for certain time, you can pass `ttl (time to live)` in seconds as 3rd parameter.

```ts
// saved for 120 seconds in the store
await CacheStore().set("books", books, 120);
```

### Reading Cache

To read data from a store, you can make use of the `get` method.

:::info
If you pass a class instance to the `get` method, it is converted to Plain Old Javascript Object (POJO), and stored as a string. When you 
:::

```typescript
await CacheStore().get("book_name");
// will return 'Shoe Dog'

await Cache.store().get('books');
/**
  [
    { name: 'Shoe Dog', author: 'Phil Knight' },
    { name: 'The Silva Mind Control Method', author: 'José Silva' }
  ]
*/
```

There can be some situations where you are not sure if a data exists in the cache or not. Intent has `rememberForever` and `remember` method which you can use to build your data if it doesn't exist in the cache or else return directly from the cache.

In a much more real world use case, you may want to process something and then save it to the store, and then read from there on. Let's see how you can use these methods.

```ts
const cb = () => {
  // your custom logic here, for eg. a db query, an api call.
  return [
    {
      name: 'Shoe Dog',
      author: 'Phil Knight',
    },
    {
      name: 'The Silva Mind Control Method',
      author: 'José Silva',
    },
  ];
};

await CacheStore().remember("books", cb, 120);
```

Notice the 2nd arg `cb` callback, and the 3rd arg `ttl` timeout, passed to the `remember` method. The `cb` will be processed and the value returned by the callback will be serialized and saved to the store automatically for `ttl` time.

:::info
You can pass `async` callbacks in the `remember` and `rememberForever` methods.
:::

If you want to just store the data without any expiry, you can use the `rememberForever` method.

```ts
const cb = () => {
  // your custom logic here, for eg. a db query, an api call.
  return []; // books here.
};

await CacheStore().rememberForever("books", cb);
```

The above example saves the data indefinitely in the redis store. The only difference between the `rememberForever` and `remember` method is the expiry time (3rd argument) of the key in the store.


### Other Operations

Till now we have seen how to write and read data from cache, but it is much more than that. Fortunately, Intent comes with multiple utility based methods which are meant to ease your interaction with cache.

Let's take a look at those.

To check if key exists in the store, you can use `.has()` method

```typescript
await CacheStore().has("books");
// will return `true` if found, else `false`
```

To remove a key from the store, use `.forget()` method

```typescript
await CacheStore().forget("books");
```

When it comes to interacting with cache, it can often become cumbersome to maintain a standardisation of how keys are being built and used in an application. We have added a `genKey` method or `CacheKeyGen` helper which you can use to generate keys.

For example, let's say you want to build a key for a user which is responsibe for holding user's data in the cache.

```ts
const keyObj = { type: 'info', id: 'user_1234' };
Cache.genKey(keyObj);
// id[user_1234],type[info]
```

:::info
If the key length is more than `10000 characters`, it would automatically hash(sha1) the keys and return the hashed key.
:::

`genKey` method automatically sorts the object's key in lexical order and return a string which later can be used as a key.
