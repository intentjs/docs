---
title: Migrations
description:
image:
---
# Migrations

### Introduction

Migrations are used to create or alter the table schema in a database. We use the powerful set of migration APIs provided by [`KnexJS`](http://knexjs.org/).

We have written few commands to ease the migration process for you though, so that you focus on doing wonderful things only.

## Usage

Following are the list of operations that you can perform using the commands that we provide.

### Create a new migration

To create a new migration file, run the command mentioned below:

```bash
node intent make:migration create_users_table
```

This will create a new migration file in `database/migrations/20200829220336_create_users_table.js`, the random number before the _create_users_table_ is the micro timestamp.

:::info
All migrations are stored in `database/migrations` folder.
:::

```typescript
exports.up = async function (knex) {
  const migration = await knex.schema.createTable("users", function (table) {
    table.bigIncrements("id");
    table.string("email").index();
  });
  return migration;
};

exports.down = async function (knex) {
  return knex.schema.dropTableIfExists("users");
};
```

To learn more about the APIs provided by KnexJS, click [here](http://knexjs.org/#Schema).

### Check Migration Status

This command will return list of completed and pending migrations.

```bash
node intent migrate:status
```

### Run migration(s)

Use this command to run all migrations that have not yet been run.

```bash
node intent migrate
```

### Rollback migration(s)

Rolls back the last migration batch. Only the last batch will be rolled back.

```bash
node intent migrate:rollback
```

### Reset Database

Rollbacks all migrations, resulting in reseting the entire database.

:::danger
Please use this command with caution!
:::

```bash
node intent migrate:reset
```
