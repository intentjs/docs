---
title: Console Commands
description:
image:
---

# Console

There must have been situations where you would have made some temporary scripts to perform some tasks or even a permanent one.
Intent comes with a `@Command` utility which you can use to create console commands in your applications.

It is not just a simple command line tool utility, but also comes integrated with argument, options parsing, styled console prints, interactive inputs, and also supports the NestJS DI lifecycle.

## Creating Command

IntentModule automatically discovers all your console commands having `@Command` decorator attached to them.

There are two ways you can define commands in your application.

- Using the `@Command` decorator on an Injectable class
- Using the `@Command` decorator on an Injectable class' method.

:::info
  Remember to use the `@Injectable` decorator on the class always, else the
  command will not be discovered and registered. Once the command is created,
  you can simply register it in the `providers` attribute of the app module.
:::

If you want to automatically create the `@Command` class, you can simply run the following command.

```bash
node intent make:command NewCommand
```

This command will automatically create a `newCommand.ts` file in `commands` directory, and add it to the `providers` attribute of the app module class.

### Using Class

You can create an injectable class and use `@Command()` decorator on it. The package will automatically look for `handle` method inside the class.

```typescript
import { Injectable } from '@intentjs/core';
import { Command, ConsoleIO } from '@intentjs/core/console';

@Injectable()
@Command("hello {name=world}", { desc: "Test Command" })
export class HelloWorldCommand {
  async handle(_cli: ConsoleIO): Promise<void> {
    const name = _cli.argument<string>("name");
    _cli.info(`Hello ${name}!`);
    return;
  }
}
```

### Using Method

You can also use `@Command` decorator on the method.

```ts
import { Injectable } from '@intentjs/core';
import { Command, ConsoleIO } from "@intentjs/core/console";

@Injectable()
export class HelloWorldCommand {
  @Command("hello", { desc: "Test Command" })
  sayHello(_cli: ConsoleIO) {
    const name = _cli.ask<string>("name");
    _cli.info(`Hello ${name}!`);
    return;
  }
}
```

After creating the command, we need to now register it inside the app module.

```ts
import { HelloWorldCommand } from "./commands";
@Module({
  providers: [HelloWorldCommand];
})
export class AppModule {}
```

Now we can run the command by running the `node intent your_command_name` inside your terminal.

```bash
node intent hello
```

## Defining Input

Intent comes with some simple yet powerful argument and input parsers which help you pass input to your commands on the run time. There are three type of inputs which you can use as you like.

- **Arguments** - These are mandatory input fields which is required at the runtime of the command.
- **Options** - Similar to Arguments, but these are optional fields.
- **Prompt** - These are programmatical prompts which you can use to prompt the user for custom interactive inputs.

### Arguments

Arguments in console applications are required variables. These inputs are mandatory by nature, and not passing them would result in error.

```typescript
@Command(
  'hello {name}',
  { desc: 'Hello World Command' }
)
```

We can now pass your argument to the command as mentioned below

```bash
node intent generate:report ordersummay
```

You can use the `argument` method from the `ConsoleIO` helper to retrieve the input from the CLI.

```typescript
async handle(_cli: ConsoleIO): Promise<void> {
  const name = _cli.argument<string>("name");
}
```

You can also define default values for your arguments as,

```typescript
@Command(
  'hello {name=world}',
  { desc: 'Test Command' }
)
```

Now, if you don't pass any argument while invoking the `hello` command, you will get `world` as default value for the `name` argument.

In case you want to define an argument as of type array, you can simply add `* (asterik)` at the end of the argument.

```
"hello {name*}"
```

Now, all the values that you pass to the command, it will be collected under the `name` argument array.

If you want to make your arguments more declarative, or if you want to show the reference (manual) of the command on the console. You can also define description of each argument like mentioned below. Whatever sentence you write after `:` delimitter, it would be treated as description.

```ts
"hello {name : Name of the person to greet}";
```

Now try running the command with `--help` flag, you should see the description against the argument.

While arguments are great for times when you know the fixed set of inputs you are going to get. But we understand there are scenarios where some inputs can passed optionally, that is why we have added options alongside argument to help you do the same. Let's take a look.

### Options

Options are the optional inputs for each command. They are denoted by double hyphens (`--`) or single hyphens (`-`).

Example:

```typescript
@Command(
  'hello {--name}',
  { desc: 'Command to greet the user' }
)
```

You can pass values to the options as mentioned below.

```bash
node intent hello --name=vinayak
```

To read the value from the console in your command, you can make use of the `option` method present inside the `ConsoleIO`.

```ts
const name = _cli.option<string>("name");
```

To pass array of values in any options or arguments, you can simply add an `* (asterik)`.

```typescript
hello {--names*}
```

```bash
node intent hello --name=vinayak --name=piyush
```

You can also define default values for the arguments or options by adding a `=` equal sign followed by the value.

```typescript
hello {name=world} {--email=email@example.com}
```

You can also define short forms of the options like below

```ts
hello {--n|name}
```

Instead of using the full qualified name of the option, we can also use the short form as well.

```bash
node intent hello -n vinayak
```

:::info
  To retrieve the input passed using the short forms of the options, you need to
  use only the full qualified name of the option.
:::

Similar to arguments, you can also define description of the option.

```typescript
"hello {--n|name : Name of the person to greet}";
```

Now try running the command with `--help` flag, you should see the description against the argument.

## Retrieving Inputs

We provide easy to use APIs to work with I/O directly from the console.

While executing command, you will need to fetch the values that you may have passed during invoking the command. Your method will be passed an `_cli: ConsoleIO` object. You can use the \`ConsoleIO\` object to fetch your arguments or options.

For fetching an argument, you can do

```typescript
const type = _cli.argument<string>("type");
```

For fetching an option, you can do

```typescript
const email = _cli.option<string>("email");
```

If no value is passed, the `argument` and `option` function will return the default value or `null` value.

### Prompts

You may want to ask for input while executing a command. We provide several ways with which you can ask for inputs directly on console.

To ask for simple input from the user, you can call `ask()` method.

```typescript
const name = _cli.ask("name");
```

You may want to ask user about some secret or any password, which ideally should not get printed on the console.

```typescript
const password = await _cli.password("Enter your pasword to continue");
```

While running a command, you can also give choices to select from a defined list. For example:

```typescript
/**
 * Single choice example.
 * Returns one of the passed choices.
 */
const choice = await _cli.select(
  "Please select one superhero", // question
  ["Batman", "Ironman"], // choices
  false // multiple?
);

/**
 * Multiple choices example.
 * Returns an array of the selected options.
 */
const choice = await _cli.multiSelect("Please select one superhero", [
  "Batman",
  "Ironman",
]);
```

Lastly, sometimes you may want to ask for confirmation from the user before doing any execution. You can do so by using `confirm` method.

```typescript
const confirm = await _cli.confirm("Do you really wish to continue?");
if (confirm) {
  // do your magic here
}
```

## Writing Outputs

Till now, we have seen how we can operate with differnt type of inputs on the cli. There will be scenarios when you will want to print something on the console. We provide a very easy-to-use set of APIs for your basic console outputing needs.

To print any message on the console, use `info` method

```typescript
_cli.info("Some amazing message"); // Outputs 'Some amazing message' on the console
```

Incase of an error message, use `error` method.

```typescript
_cli.error("Oops! Something went wrong.");
```

Similarly, to print any success message, use `success` method

```typescript
_cli.success("Wohoo! The command worked just fine!");
```

To print a divider on the console, simple do

```typescript
_cli.line();
```

To print a table on the console, you can use `table` method:

```typescript
// this will automatically print unicode table on the console
_cli.table(
  ["Name", "Designation"],
  [
    { name: "User 1", designation: "Software Engineer L1" },
    { name: "User 2", designation: "Software Engineer L1" },
  ]
);
```

## Available Commands

We provide few commands, which will help in your day to day development process.

To list all commands available in your application, you can do

```bash
node intent list
```

`list` is a reserved command name, please don't use it in any of the commands

## In-built Options

We provide few out-of-the-box predefined options, which you can use with each of your command.

To list all the arguments and options that your command supports/expects, simply run

```bash
node intent users:greet --help
```

`--help` is a reserved option. Please don't use it anywhere in your command.
