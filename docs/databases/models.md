---
title: Models
description: Create powerful Database Models using IntentJS + ObjectionJS
image:
---

# Models

IntentJS ships with a wrapper on ObjectionJS, it comes packed with some powerful features like optimised eager loading, custom repositories, soft delete models and custom query builders.

Just like any other ORM, ObjectionJS also provides support for models. We have added a `BaseModel` which you can use to create your own models.

## BaseModel

We have added a `BaseModel` which you can use to create your models.

- Uses Custom Query Builder which offers some powerful query methods.
- Already tuned for high performance.
- `$load` function for better performance, only loads the relation if it is not already loaded
- `$forceLoad` function for reloading the requested relation forcefully.

Let's take a look at how to create our own model.

```typescript
import { BaseModel } from '@intentjs/core/db';

export class UserModel extends BaseModel {
  static tableName = 'users';
}
```

## Model Conventions

### Database Connections

By default, all models will use the default database conneciton that is configured for your application. If you would like to specify a different connection that should be used when interacting with a particular model, you should define a `connection` property on the model.

:::info
Currently, only repositories support multiple connections. Querying models directly on different connection other than default connection is currently not supported.
:::

The repository will automatically read `connection` property and use the specified connection. :::

```typescript
import { BaseModel } from '@intentjs/core/db';

export class UserModel extends BaseModel {
  static tableName = 'users';
  static connection = 'postgres';
}
```

## Model Helpers

### $load

This method expects an object obeying `RelationExpression`, as explained [here](https://vincit.github.io/objection.js/api/types/#type-relationexpression).

```typescript
const user = await User.query().first();

// runs the relational query to fetch all related models of address
console.log(await user.$load({ address: true }));

// returns the already fetched data
console.log(await user.$load({ address: true }));
```

### $forceLoad

This method expects an object obeying `RelationExpression`, as explained [here](https://vincit.github.io/objection.js/api/types/#type-relationexpression).

```typescript
const user = await User.query().first();

// reloads the relational query to fetch all related models of address
console.log(await user.$forceLoad({ address: true }));

// will again reload the already fetched data
console.log(await user.$forceLoad({ address: true }));
```