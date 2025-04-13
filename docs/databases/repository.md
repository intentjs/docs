---
title: Repository
description:
image:
---

# Repository

## Getting Started

In the previous sections, you saw how to create a migration, create a model and query the database using it. But when it comes to building a product or a production level product, you need some strong typings and opinionated structures to help you streamline the development process and only let you and your team focus on the business logic rather than investing time in figuring out how something works and why it works.

Fortunately, IntentJS comes with a custom repository of very common methods which lets you create a repository class for a Database Model (that we created in the previous section).

A repository is nothing but an abstraction of the querying logic of the models from the business logic.

For better understanding, let's take the below example.

Let's say you want to get count of all successful orders for all users list with a pagination.

```typescript
// without repository pattern
const users = await UserModel.query().select(
  "users.*",
  User.relatedQuery("orders").count().as("ordersCount")
);

// with repository pattern
const usersWithOrdersCount = await userRepo.listWithCount();
```

If you notice, you can clearly see the abstraction happening under the hood. While this doesn't help reduce your lines of code, but it does help to make your code a lot more readable and contextual.

In IntentJS application, creating your own repository is pretty straight forward. You can create your own repo like below

```typescript
import { Injectable } from "@intentjs/core";
import { DatabaseRepository} from '@intentjs/core/db';
import { UserModel } from '#models/user';
@Injectable()
export class UserRepository<UserModel> extends DatabaseRepository<UserModel> {
  @InjectModel(UserModel)
  model: UserModel;
}
```

After you create your repository, now we you need to register this repo as a provider.

```typescript
@Module({
  providers: [{ provide: "USER_REPO", useClass: UserRepository }, UserService],
})
export class UserModule {}
```

After registering the repo inside the provider, you can now inject it inside your service to access user models.

```typescript
@Injectable()
export class UserService {
  constructor(@Inject("USER_REPO") private userRepo: UserRepository) {}
}
```

Now that we have injected it inside our service, we can start using it.

```typescript
const usersList = await this.userRepo.all(); // returns list of all users
```

If you want to only search for one user with some where condition.

```typescript
const users = await this.users.firstWhere(
  { contactNumber: "XXXXXXXXXX" },
  false
);
```

If you want to search for all users with matching where conditions.

```typescript
const users = await this.users.getWhere({ contactNumber: "XXXXXXXXXX" }, false);
```

You can also use repo to create or update entries.

```typescript
const user = await this.users.create({ firstName: "Tony", lastName: "Stark" });
await this.users.update(user, { firstName: "New Name" });
```

## Repository Query Methods

### `all()`

Get all models from table.

```typescript
/**
 * @returns User[]
 */
const users = await this.users.all(); // returns User[]
```

### `firstWhere()`

Get the first model with the matching criterias. If not found, it will throw an `ModelNotFoundException` exception. If you don't want to throw exception, pass `false` as second parameter.

**Parameters:**

| Parameter | Required? |              Description              |  Default  |
| :-------: | :-------: | :-----------------------------------: | :-------: |
|  inputs   |     Y     |  Where condition that is to be added  | undefined |
|   error   |     N     | Throw exception if model is not found |   true    |

```typescript
/**
 * Returns User if found, else throws ModelNotFoundException
 */
const users = await this.users.firstWhere(
  { contactNumber: "XXXXXXXXXX" },
  true
);

/**
 * Returns User if found, else throws ModelNotFoundException
 */
const users = await this.users.firstWhere(
  { contactNumber: "XXXXXXXXXX" },
  false
);
```

### `getWhere()`

Get all models with the matching criterias. If not found, it will throw an `ModelNotFoundException` exception. If you don't want to throw exception, pass `false` as second parameter.

**Parameters:**

| Parameter | Required? |              Description              | Default |
| :-------: | :-------: | :-----------------------------------: | :-----: |
|  inputs   |     Y     |  Where condition that is to be added  |   --    |
|   error   |     N     | Throw exception if model is not found |  true   |

```typescript
/**
 * Returns User if found, else throws ModelNotFoundException
 */
const users = await this.users.getWhere({ contactNumber: "XXXXXXXXXX" }, true);

/**
 * Returns User if found, else throws ModelNotFoundException
 */
const users = await this.users.getWhere({ contactNumber: "XXXXXXXXXX" }, false);
```

### `create()`

Create the model in DB and return it's model equivalent instance.

**Parameters:**

| Parameter | Required? |       Description       | Default |
| :-------: | :-------: | :---------------------: | :-----: |
|  inputs   |     Y     | Column values as object |   --    |

```typescript
/**
 * Create a new model with given inputs
 */
const user = await this.users.create({ firstName: "Tony", lastName: "Stark" });
```

### `createOrUpdate()`

Update or create a model with given condition and values.

**Parameters:**

| Parameter | Required? |                           Description                           | Default |
| :-------: | :-------: | :-------------------------------------------------------------: | :-----: |
| condition |     Y     |       Existence of any model is checked using the object        |   --    |
|  values   |     Y     | If the model is not found, `values` will be used to add columns |   --    |

```typescript
/**
 * Update or Create model with given condition and values
 */
const user = await this.users.createOrUpdate(
  { contactNumber: "XXXXXXXXXX" },
  { firstName: "Tony", lastName: "Stark" }
);
```

If any user with contact number as 'XXXXXXXXXX' exists in the system, it will return the same model. If not, then a new model will be created.

### `firstOrNew()`

First or Create model with given condition and values

**Parameters:**

| Parameter | Required? |                           Description                           | Default |
| :-------: | :-------: | :-------------------------------------------------------------: | :-----: |
| condition |     Y     |       Existence of any model is checked using the object        |   --    |
|  values   |     Y     | If the model is not found, `values` will be used to add columns |   --    |

```typescript
/**
 * Update or Create model with given condition and values
 */
const user = await this.users.firstOrNew(
  { contactNumber: "XXXXXXXXXX" },
  { firstName: "Tony", lastName: "Stark" }
);
```

If any user with contact number as 'XXXXXXXXXX' exists in the system, it will return the first model. If not, then a new model will be created.

### `update()`

Update the given model with values.

**Parameters:**

| Parameter | Required? |          Description           | Default |
| :-------: | :-------: | :----------------------------: | :-----: |
|   model   |     Y     |        To update model         |   --    |
|  values   |     Y     | Columns to update in the model |   --    |

```ts
const users = await this.users.firstWhere({ contactNumber: "XXXXXXXXXX" });
await this.users.update(user, { firstName: "New Name" });
```

New first name of the user will be, 'New Name'.

### `updateWhere()`

Update all models where criterias are matched.

**Parameters:**

| Parameter | Required? |          Description           | Default |
| :-------: | :-------: | :----------------------------: | :-----: |
|   where   |     Y     |        where conditions        |   --    |
|  values   |     Y     | Columns to update in the model |   --    |

```typescript
await this.users.update(
  { contactNumber: "XXXXXXXXXX" },
  { firstName: "New Name" }
);
```

The records where contactNumber is "XXXXXXXXXX" will have the updated firstName of "New Name".

### `exists()`

Check if model exists where criterias are matched.

**Parameters:**

| Parameter | Required? |             Description             | Default |
| :-------: | :-------: | :---------------------------------: | :-----: |
|  inputs   |     Y     | Where condition that is to be added |   --    |

```typescript
/**
 * Returns true or false
 */
const users = await this.users.exists({ contactNumber: "XXXXXXXXXX" });
```

### `count()`

Get count of models matching the criterias

**Parameters:**

| Parameter | Required? |             Description             | Default |
| :-------: | :-------: | :---------------------------------: | :-----: |
|  inputs   |     Y     | Where condition that is to be added |   --    |

```typescript
/**
 * Returns the count of models found
 */
const users = await this.users.count({ contactNumber: "XXXXXXXXXX" });
```

### `refresh()`

Refresh the given model.

**Parameters:**

| Parameter | Required? |      Description      | Default |
| :-------: | :-------: | :-------------------: | :-----: |
|   model   |     Y     | Model to be refreshed |   --    |

```typescript
/**
 * Return the new latest model from db
 */
let user = await this.users.firstWhere({ contactNumber: "XXXXXXXXXX" });
await this.users.update(user, { firstName: "New Name" });
user = await this.users.refresh(user);
```

### `delete()`

Delete the given model.

**Parameters:**

| Parameter | Required? |      Description      | Default |
| :-------: | :-------: | :-------------------: | :-----: |
|   model   |     Y     | Model to be refreshed |   --    |

```typescript
/**
 * Return the new latest model from db
 */
const user = await this.users.firstWhere({ contactNumber: "XXXXXXXXXX" });
await this.users.delete(user);
```

### `deleteWhere()`

Delete models where criterias are matched.

Update all models where criterias are matched.

**Parameters:**

<table><thead><tr><th width="181" align="center">Parameter</th><th align="center">Required?</th><th align="center">Description</th><th align="center">Default</th></tr></thead><tbody><tr><td align="center">where</td><td align="center">Y</td><td align="center">where conditions</td><td align="center">--</td></tr></tbody></table>

```typescript
await this.users.deleteWhere({ contactNumber: "XXXXXXXXXX" });
```

The records where contactNumber is "XXXXXXXXXX" will be deleted.

### `attach()`

Attach relation's ids to a model via `relation`.

**Parameters:**

| Parameter | Required? |      Description       | Default |
| :-------: | :-------: | :--------------------: | :-----: |
|   model   |     Y     |         model          |   --    |
| relation  |     Y     | relation to be updated |   --    |
|  payload  |     Y     | Payload to be attached |   --    |

```typescript
await this.roles.attach(role, "permissions", 1);
```

`Role` model will now have `Permission` model with id 1 in its relation.

To know more about the `payload` attribute, [click here](https://vincit.github.io/objection.js/guide/query-examples.html#relation-relate-queries).

### `sync()`

Works like `attcach` only, but trashes the old pre-established relations and creates new ones.

**Parameters:**

| Parameter | Required? |      Description       | Default |
| :-------: | :-------: | :--------------------: | :-----: |
|   model   |     Y     |         model          |   --    |
| relation  |     Y     | relation to be updated |   --    |
|  payload  |     Y     | Payload to be attached |   --    |

```typescript
await this.roles.sync(role, "permissions", 1);
```

`Role` model will now have only `Permission` model with id 1 in its relation.

To know more about the `payload` attribute, [click here](https://vincit.github.io/objection.js/guide/query-examples.html#relation-relate-queries).

### `chunk()`

Fetch models in chunks from a large table, and perform passed `cb` function. There can be cases where your db will contain large number of datasets, and you may want to perform action on them. Loading them all at once will be inefficient memory and time wise.

**Parameters:**

| Parameter | Required? |                           Description                            | Default |
| :-------: | :-------: | :--------------------------------------------------------------: | :-----: |
|   where   |     Y     |                         where conditions                         |   --    |
|   size    |     Y     |                 Chunk size to be loaded from db                  |   --    |
|    cb     |     Y     | Callback function to be called, after each successful chunk load |   --    |

```typescript
await this.users.sync({ isActive: true }, 500, (users) => console.log(users));
```

### `query()`

Return new `QueryBuilder` instance.

```typescript
/**
 * Return query builder instance
 */
const query = this.query();
```

## Transactions

If you wish to use the repository to perform some transactions, you can do so like following. This way, you get all your repository methods.

### `startTransaction()`

```typescript
const trx = await this.repo.startTransaction();
const users = await trx.forUpdate().firstWhere({ id: 1 });
await trx.commit();
// alternatively, you can also call trx.rollback();
```

## Connection Methods

If you wish to change connection of your repository on the fly, be it due to read-only connection or multi-tenancy database architecture.

### `bindCon()`

To change, you can change the connection of your repository using `bindCon` method.

**Parameters:**

| Parameter | Required? |                                       Description                                        | Default |
| :-------: | :-------: | :--------------------------------------------------------------------------------------: | :-----: |
|  conName  |     Y     | Connection name, similar to any one of the connection name provided during configuration |   --    |

**Example**

```typescript
const repo = new UserRepository();
const records = await repo.bindCon("postgres-read").all();
```
