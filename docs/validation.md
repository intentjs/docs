---
title: Validation
description:
image:
---

# Validation

While building REST APIs, validating input data becomes and important practice to validate the incoming data.

IntentJS internally uses `class-validator` package to perform data validation. On top of what \`class-validator\` offers, IntentJS comes with some powerful and useful decorators which make data validation in your application, actually a breeze.

## Validation in Intent

### Creating Schema

In order to validate your input, you first need to create a schema which we will be using to compare. You can think of schemas as simple classes which has some meta information attached.

You can create a schema like below

```typescript
import { IsNotEmpty, IsString } from "class-validator";

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  author: string;
}
```

For available validation decorators, you can refer to the[ \`class-validator\` ](https://github.com/typestack/class-validator?tab=readme-ov-file#validation-decorators)documentation.

### Using Validator class

Now that you have the schema ready, we will need to validate it. To do so, you can make use of the `Validator` class.

```typescript
import { Validator } from "@intentjs/core";

const validator = Validator.compareWith(CreateBookDto);
```

Inside the `compareWith` method we are passing the schema that we created previously. We can now use the new `validator` that we created to validate our inputs. Let's see an example below

```ts
await validator.validate({
    name: 'Get Epic Shit Done',
    author: 'Ankur Warikoo'
});
```

The `validate` method internally creates the instance of the schema we passed, and then validates it. In above example, the validation will pass.&#x20;

The `validate` method also returns the instance of the schema if the validation has been successful. See below

```typescript
const dto = await validator.validate({
  name: "Get Epic Shit Done",
  author: "Ankur Warikoo",
});

console.log(dto.name);

// Get Epic Shit Done
```

You can now use this schema the way you like, because it's just a simple class.

#### Validation Failure

Validator class throws `ValidationFailed` exception if the validation fails. Let's see one example below

```typescript
await validator.validate({
  name: "Get Epic Shit Done",
});
```

This would throw an exception because it doesn't have the `author` attribute as it is expected inside the schema. To get the list of all the validation rules that failed, you can make use of the `getErrors` method in the exception.

```typescript
try {
  validator.validate({ name: "Get Epic Shit Done" });
} catch (e) {
  if (e instanceof ValidationFailed) {
    console.log(e.getErrors());
  }
}
```

The `getErrors` method returns the error object like below

```json
{
  "author": ["Author should not be empty"]
}
```

#### Adding Meta

## Using with Request and Controllers

We have also added a few helper methods built on top of the `Validator` class to help you write clean and better code.

### Using IntentRequest

If you want to validate the payload that you are getting inside the request, you can make use of the `validate` method present inside the `IntentRequest` class.

```typescript
@Controller()
export class BookController {
  @Post("")
  async create(@IRequest() req: IntentRequest) {
    const dto = await req.validate(CreateBookDto);
    return { msg: "Book Created Successfully!" };
  }
}
```

`validate` method will automatically validate the data along with adding meta inside the schema instance.&#x20;

### Using @Validate Decorator

You can also make use of the `Validate` decorator to automatically validate the incoming request. And if you want the instance of the validated schema, you can make use of the `Dto` decorator. Let's look at an example below:

```typescript
import { Validate, Dto } from "@intentjs/core";

@Controller()
export class BookController {
  @Post("")
  @Validate(CreateBookDto)
  async create(@Dto() dto: CreateBookDto) {
    return { msg: "Book Created Successfully!" };
  }
}
```

## Available Decorators

We have added a few validation decorators which we believe will be super useful for some of your scenarios.

List of decorators available

- [Exists (Database)](validation.md#exists)
- [IsUnique (Database)](validation.md#isunique)
- [IsFromConfig](validation.md#isvaluefromconfig)
- [IsEqualToProp](validation.md#isequaltoprop)
- [List of `class-validator` decorators](https://github.com/typestack/class-validator?tab=readme-ov-file#validation-decorators)

#### Exists (Database)

Rule to validate that the property should exist inside the specified database table.

```typescript
@Exists({ table: 'users', col: 'email' })
```

#### IsUnique

Rule to validate that the property doesn't exist inside the specified database table.

```typescript
@IsUnique({ table: 'users', col: 'email' })
```

#### IsFromConfig

Rule to check if a prop's value matches the value of the key from the config.

```typescript
@IsFromConfig({ key: 'app.locale' })
```

#### IsEqualToProp

Rule to check if one prop is equal to another.

```typescript
password: string;

@IsEqualToProp('password')
confirmPassword: string;
```
