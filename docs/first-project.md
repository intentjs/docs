---
title: First Project
description: Protecting REST APIs by using guards inside your Intent application
image:
---
# First Project

In this documentation, we will see how to setup your first project with Intent, understand some basic concepts and get it running.

## Setup

### Language
Intent uses `Typescript` as it's primary language.

### Prerequisites
Make sure that `Node.js` (version >= 18) is installed on your operating system.

### Create a new project
Setting up a new Intent project is quite easy with `npm` installed. You can run the following command in your terminal to get started.

It will ask you a few questions, you can choose `Yes` or `No` as per your requirement.
```bash live=true
npm i -g @intentjs/cli
intent new my-project
```

Once this command has ran, move to the directory `new-sample-app` and open it inside your fav code editor.

You can read more about the directory structure [here](https://tryintent.com/docs/directory-structure).

## Configuring the Project

:::info
Intent comes with default configuration with aim to help developers quickly setup the project and start building.
You are free to make the changes as per your requirement.
:::

Now when you open the `.env` inside the project, you will see set of following variables.

```ts
DEFAULT_DB=pg
DEFAULT_CACHE=memory
DEFAULT_QUEUE=sync
DEFAULT_STORAGE=local
DEFAULT_MAILER=logger
```

Let's understand these variables one by one.

```ts
DEFAULT_DB=sqlite
```
Whenever you launch a new project with Intent, it comes with `SQLite` configured as it's database. This helps you quickly get started.

If you wish to change the database configuration, click [here](https://tryintent.com/docs/databases/getting-started).

```ts
DEFAULT_CACHE=memory
```

`memory` cache is the local cache, so you can start using Cache in your database without breaking a sweat.

If you wish to configure a different cache for your project, read [more](https://tryintent.com/docs/cache).

```ts
DEFAULT_QUEUE=sync
```
`sync` drivers are just a blank drivers which enable you to use queues in your application quickly. Read more about queues.

```ts
DEFAULT_STORAGE=local
```
Intent comes enabled with `local` storage by default with the files stored inside `storage/uploads` directory. Read more about storages.

```ts
DEFAULT_MAILER=logger
```
`logger` is the default driver of our Mailer, you can change this as per your requirement, to do so [visit](https://tryintent.com/docs/mailers).

## Running it locally
To run the project locally in watch mode, you can simply run the following command in your terminal.

```ts
node intent dev
```

Visit [http://localhost:5001](http://localhost:5001), and you should be greeted with a message.

Since, Intent comes with support for console commands as well, it will only be fair to have a look at that as well.

Headover to your terminal, and run the following command.

```bash
node intent greet
```
```bash
Horace Slughorn once said -
"It is impossible to manufacture or imitate love"
```
Voila 🎉 we are done with the project setup.

## Formatting & Linting

Intent comes configured with `eslint` and `prettier` which you can use to lint and format your code respectively.

To do, you can make use of the following command.

```
$ npm run lint
$ npm run format
```

## Running in Production
Just like any typescript project, you will need to first build the Intent app, and then start the server.
To do so, you can make use of the following commands

```ts
$ node intent build
$ node dist/app/main.js
```