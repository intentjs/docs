---
title: Transformers
description: Learn how to use Transformers in IntentJS applications to transform and format data before sending it in API responses, including optional includes and nested relationships.
keywords: transformers, data transformation, API responses, JSON formatting, optional includes, nested relationships, Transformable class, response formatting
image:
---
# Transformers

Often when you develop REST APIs, you would come across instances when you would want to transform your response before you send it out. IntentJS ships a simple yet powerful `Transformer` class which let's you dynamically prepare your response. Let's understand this in detail.

Transformer provides a presentation and transformation layer for complex data output, for example JSON response in REST APIs. Let's see an example of how it works.

## Getting Started

To start using transformers, you need to create a transformer class, say `BookTransformer` which extends the abstract `Transformer` imported from `@intentjs/core`.

Lets create a `BookTransformer` for a model, say `Book`.

```ts
// src/transformers/book.ts
import { Transformer } from '@intentjs/core';
import { BookModel } from '#models/book';

export class BookTransformer extends Transformer {
  async transform(book: BookModel): Promise<Record<string, any>> {
    return {
      id: book.uuid,
      name: book.name,
      publisherName: book.publisher,
      publishedOn: book.publishedAt,
    };
  }
}
```

Now to use the transformer, follow the steps below:

```ts
//BookController.ts
import { Controller, Get } from '@intentjs/core/http';
import { BookTransformer } from '#transformers/book';

@Controller('books')
export class BookController {
  @Get(':id')
  async index(@Req() req: Request) {
    const book = [{
      uuid: '75442486-0878-440c-9db1-a7996c22a39f',
      name: 'IntentJS',
      publisher: 'HanaLabs'
      publishedAt: '2024-02-01 00:00:00',
    }];

    const transformer = new BookTransformer();
    return transformer.setContext(req).work(book);
  }
}

// GET /books/intentjs
/**
 * {
 *  id: "75442486-0878-440c-9db1-a7996c22a39f",
 *  name: "IntentJS",
 *  publisherName: "HanaLabs",
 *  publishedAt: '2024-02-01'
 * }
 */
```

:::warning NOTE
  Supports only JSON response for now
:::

_Wait_, transformer provide much more than just a wrapper class.

## Optional Includes
While creating REST APIs, you may want to fetch some related data with each transformable object.

For example, you may want to fetch author details along with the details of the book's detail that you requested. Let's create an include in our transformer.

Transformer provides two options define your includes.

- `availableIncludes` - will be included on demand
- `defaultIncludes` - included by default for every invocation.

Below example gives you a peek on how you can create in include in the transformer.

```ts
import { Transformer } from '@intentjs/core';

export class BookTransformer extends Transformer {
  availableIncludes = ['author']; // will be included on request
  defaultIncludes = []; // included by default

  async transform(book: Book$Model): Promise<Record<string, any>> {
    return {
      id: book.uuid,
      name: book.name,
      publisherName: book.publisher,
      publishedOn: moment(book.publishedAt).format('YYYY-MM-DD'),
    };
  }

  async includeAuthor(book: Book$Model): Promise<Record<string, any>> {
    await book.$load({ author: true });
    return this.item(book.author, new AuthorTransformer());
  }
}
```

Notice the 'author' inside the `availableIncludes` and `includeAuthor` method, transformer will prefix `include` to the requested include name. For example, transformer will look for `includeAuthor` method when you request `include=author`

Now to use the include the `author` option, we need to pass the `include` query params in the URL, like: `/books/75442486-0878-440c-9db1-a7006c25a39f?include=author`

:::info
  Bonus For multiple includes, send comma separated include options like
  include=author,publisher,launchDetails
:::

Now to request dynamic includes, simply do the following.

```javascript
//BookController.ts
import { Controller, Get } from '@intentjs/core/http';
import { BookTransformer } from '#transformers/book';

@Controller('books')
export class BookController {
  @Get(':id')
  async index(@Req() req: Request) {
    const book = [{
      uuid: '75442486-0878-440c-9db1-a7996c22a39f',
      name: 'IntentJS',
      publisher: 'HanaLabs'
      publishedAt: '2024-02-01 00:00:00',
      author: {
        name: 'vinayak sarawagi'
      }
    }];

    const transformer = new BookTransformer();
    return transformer.setContext(req).work(book);
  }
}

// GET /books/intentjs?include=author
/**
 * {
 *  id: "75442486-0878-440c-9db1-a7996c22a39f",
 *  name: "IntentJS",
 *  publisherName: "HanaLabs",
 *  publishedAt: "2024-02-01",
 *  author: { name: "vinayak sarawagi" }
 * }
 */
```

You now know how to include data in your response on-demand, we understand there can be cases where you may want to include some nested relation as well.

You can do it by `?include=author[ratings]`, now make the following changes in `BookTransformer`

```typescript
import { Transformer, Transformer$IncludeMethodOptions } from '@intentjs/core';

export class BookTransformer extends Transformer {
  /**
   * will be included on-demand.
   */
  availableIncludes = ['author'];

  /**
   * included by default.
   */
  defaultIncludes = [];

  async includeAuthor(
    book: Book$Model,
    options: Transformer$IncludeMethodOptions
  ): Promise<Record<string, any>> {
    await book.$load({ author: true });
    return this.item(book.author, new AuthorTransformer(), options);
  }
}
```

Notice the options method you are receiving, this is auto-generated payload which you need to share it further to the `item`, `collection` method.

Now, inside the `AuthorTransformer`, you can simply add a new include, `rating`.

## Transformable

We have also added a simple `Transformable` utility class which you can use to avoid the manual invocations of your transformers. Simply extend `Transformable` wherever you want to use transformers. Moreover, it provides methods for transforming single object, arrays and custom payload with meta informations.

Here's how you can do it

```typescript
//BookController.ts
import { Transformable } from '@intentjs/core';
import { Controller, Get, Req, Request } from '@intentjs/core/http';
import { BookTransformer } from '#transformers/book';

@Controller('books')
export class BookController extends Transformable {
  @Get(':id')
  async index(@Req() req: Request) {
    const book = [{
      uuid: '75442486-0878-440c-9db1-a7996c22a39f',
      name: 'IntentJS',
      publisher: 'HanaLabs'
      publishedAt: '2024-02-01 00:00:00',
      author: {
        name: 'vinayak sarawagi'
      }
    }];
    return this.item(book, new BookTransformer, req);
   }
}
```

`this.item` method would automatically transform the object using the `BookTransformer`.

In case you want to transform an array, you can use `this.collect` method. The arguments remains the same.

```typescript
await this.collection(books, new BookTransformer(), req);
```

To transform a payload with some meta information, you can do.

```typescript
const customPayload = { data: books, pagination: { currentPage: 1, nextPage: 2} }
await this.transformWithMeta(customPayload, new BookTransformer req);
```
