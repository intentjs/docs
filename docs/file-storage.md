---
title: Storage
description: >-
  Intent provides a useful file storage abstraction for various file systems
  like Local (Linux, Mac, Windows), AWS S3. It provides
  simple drivers to work with your files.
image:
---
# File Storage

Intent provides a useful file storage abstraction for various file systems like `Local (Linux, Mac, Windows)`, `AWS S3`. It provides simple drivers to work with your files. You can easily change your drivers without breaking a sweat, as the APIs remain the same.

## Configuration

The configuration is stored at `config/filesystem.ts`. By default, a `local` disk is already configured for your immediate use, you can take a look at the config file to understand the disk.

Below we have explained the different `disk` configurations available which you can use.

```ts filename="config/filesystem.ts"
import { fromIni } from '@aws-sdk/credential-providers';
import { StorageOption, registerAs } from '@intentjs/core';

export default registerAs(
  'filesystem',
  () =>
    ({
      default: 's3',
      disks: {
        s3: {
          driver: 's3',
          region: process.env.AWS_REGION,
          bucket: process.env.AWS_S3_BUCKET,
          credentials: fromIni({ profile: process.env.AWS_PROFILE }),
        },
        local: {
          driver: 'local',
          basePath: 'resources',
        },
      },
    }) as StorageOptions,
);
```

That's it. You don't need to do anything else, IntentJS would automatically read `filesystem` config namespace and configure the disks.

Intent provides an excellent way to use different storage providers inside your application, without changing any line of code. It's a pure configuration play on the application level. Every driver follow a simple and consistent API.

We currently support the following storage providers.

1. AWS S3
2. Local File System

### Amazon S3 Disk [#aws-s3]

S3 is an highly scalable object storage solution provided by AWS. You can learn more about it [here](https://aws.amazon.com/s3/)

**Configuration:**

```typescript
{
  driver: 's3',
  bucket: process.env.AWS_S3_DOCS_BUCKET,
  accessKey: process.env.AWS_KEY,
  secretKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
  credentials: fromIni({ profile: process.env.AWS_PROFILE })
}
```
If you don't want to use the traditional `accessKey` and `secretKey` for authentication, we provide a generic attribute `credentials` which you can use to add your suited credential logic from `@aws-sdk/credential-providers` package. You can read more about it [here](https://www.npmjs.com/package/@aws-sdk/credential-providers).

### Local Disk

You can use the `local` disk to manage the file objects stored locally on your system.

**Configuration:**

```ts
{
  driver: 'local',
  basePath: 'storage/uploads', // relative path wrt to your project's root.
  baseUrl: 'https://example.com',
}
```

To serve the file objects from your project, have a look at [serve-static](https://docs.nestjs.com/recipes/serve-static) module by NestJS.

## Disks

We understand that while working on a big project, you may sometime encounter case where you will have to handle multiple type of files and filesystems at once.

While drivers help you to differentiate between the different storage provides for each disks. Disks help you create logical distinctions between different types of storages.

For example: While building an e-commerce application, you may want to handle the uploaded `invoices` and `products` differently. With the helps of different disks configuration, we can easily implement it.

```typescript
import { registerAs } from "@intentjs/core";

export default registerAs("filesystem", () => ({
  default: "docs",
  disks: {
    invoices: { // `invoices` disk, will contain the invoices of all the orders passed so far
      driver: "s3",
      bucket: process.env.AWS_S3_DOCS_BUCKET,
      credentials: fromIni({ profile: process.env.AWS_PROFILE }),
      region: process.env.AWS_REGION,
    },
    products: { // `products` disk, will contain photos of all the products
      driver: "s3",
      bucket: process.env.AWS_S3_PROFILE_PIC_BUCKET,
      credentials: fromIni({ profile: process.env.AWS_PROFILE }),
      region: process.env.AWS_REGION,
    },
  },
}));
```

Above, we have created two different logical partitioning of `invoices`, and `products` disks without writing any extra code 😎.

To switch between the different disks, you can make use of the `disk` method from the `Storage` facade. To access any disk other than the default, you can simply pass the name of the disk to the method.

```typescript
import { Storage } from "@intentjs/core";

Storage.disk("invoices"); // return the instance of the `invoices` disk
```

Now let's say, you want to access `products` disk,

```typescript
import { Storage } from "@intentjs/core";

Storage.disk("products"); // returns the instance of `products` disk
```

### Dynamic Disks

If you would like to build disks dynamically, you can do so with the help of `Storage.build` method.

```ts
import { Storage } from "@intentjs/core";

const driver = Storage.build({
  driver: 'local',
  basePath: 'storage/uploads2',
});
// [StorageDriver] instance
```

## Usage

Intent comes with very simple APIs to interact with your filesystem. We will see the usage of different methods provided by `Storage` facade.

### Reading a file

For example, to read a file irrespective of the driver, you can use `get` method. The method returns a `Buffer` content of the file.

```typescript
await Storage.disk("invoices").get("order_1234.pdf");
// returns buffer content of the pdf file.
```

If you want to read a file as a `JSON`, you can make use of the `getAsJson` method.

```ts
await Storage.disk().getAsJson('config.json');
```

If you want to get a signed url for a particular object with an expiry, you can use the `signedUrl` method to do so

```ts
await Storage.disk().signedUrl('profile_pic.png', 60, 'get');
```

:::warning
`signedUrl` method is only supported by `s3` disk.
:::

### Uploading a file
To upload the files, we provide several methods which you can use as per your convinience.

Let's say you want to put a file on a particular path, you can simply do

```typescript
await Storage.disk("invoices").put("order_23456.pdf", bufferContent, {
  mimeType: "application/pdf",
});
```

You can also use `signedUrl` method to signed url with an expiry to upload a file directly to a client.

```ts
await Storage.disk().signedUrl('sample.txt', 60, 'put');
```

:::warning
`signedUrl` method is currently only supported by `s3` disk.
:::

### File Deletion and Migration

`Storage` has multiple in-built methods for deletion, copying and migration of files.

The `delete` method is used for deleting a particular file.

```ts
await Storage.disk("invoices").delete("order_23456.pdf");
// returns true if delete is successfull, else false
```

To copy file from one `source path` to another `destination path` within the same disk, you can use `copy` method.

```ts
await Storage.disk().copy('file.png', 'new_file.png');
// returns true if copy is successfull, else false;
```

If you want to move a file within the same disk, you can use `move` method. The method will copy the file to the new destination and delete from the current path.

```ts
await Storage.disk().move('file.png', 'new_file.png');
// returns true if movement is successfull, else false.
```

There might be some cases where you would want to perform the `copy` and `move` operations between two different disk, ie from a `source disk` to a `destination disk`. You can make use of the `copyToDisk` and `moveToDisk` method respectively.

```ts
await Storage.disk().copyToDisk('file.png', 'disk_name', 'new_file.png');
// returns true if copy is successfull, else false;

await Storage.disk().moveToDisk('file.png', 'disk_name', 'new_file.png');
// returns true if movement is successfull, else false.
```

### File Meta Operations

Intent also comes packed with some other file operations like checking if a file exists, or is missing, etc. You can use these methods to perform your tasks without downloading the complete file.

To check if a file exists, you can use the `exists` method.

```ts
await Storage.disk("invoices").exists("order_23456.pdf"); // returns true or false
```

Alternatively, if you want to check if a file is missing or doesn't exists, you can use the `missing` method.

```typescript
await Storage.disk("invoices").missing("order_23456.pdf"); // returns true or false
```

If you want the `meta` information related to a file, you can use the `meta` method.

```typescript
await Storage.disk("invoices").meta("order_23456.pdf");
/**
  {
    path: 'sample.txt',
    contentType: 'txt',
    contentLength: 14,
    lastModified: 2024-07-14T13:43:37.000Z
  }
*/
```

If you only want to get the size of a file, you can use the `size` method, it returns the size of a file in bytes.

```ts
await Storage.disk().size('file.png');
// 1234
```

The `mimeType` method will help you get the mime type of a file.

```ts
await Storage.disk().mimeType('file.png');
// image/png
```

To check the last modified timestamp of a file, use the `lastModifiedAt` method. It returns the native `Date` object.

```ts
await Storage.disk().lastModifiedAt(path);
// 2024-07-14T13:43:37.000Z
```