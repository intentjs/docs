---
title: Queues
description: Intent provides powerful and consistent set of APIs for interacting with frequently used message queues like `AWS SQS`, `Redis`.
image:
---

# Queues

When you want to build scalable applications, you need a tool which helps you scale as your product scales. This is where Intent Queues come in the picture. Message Queues are a form of asynchronous service-to-service communication used in backend architecture. 

You can use queues to decouple or defer compute heavy or time taking tasks such as Sending Mails, Bulk Imports/Exports, Image Compressions, etc. Messages are kept in a queue until processed.

Separating these heavy time consuming tasks drastically improves your application's performance and also helps you keep your code clean.

Intent provides powerful and consistent set of APIs for interacting with frequently used message queues like `AWS SQS`, `Redis`.

## Configuration

All of the queue configurations are stored in the `config/queue.ts` file. By default, `sync` queue is configured. The configuration will be similar to below:

```ts filename="config/queue.ts"
import { SyncQueueDriver, QueueOptions, configNamespace } from "@intentjs/core";

export default configNamespace("queue", () => {
  return {
    default: "notifications",
    connections: {
      notifications: {
        driver: 'sync',
        listenerType: 'poll'
      },
    },
  } as QueueOptions;
});
```

Let's say you want to use `AWS SQS` as your message queue, you can use the below mentioned configuration

```ts filename="config/queue.ts"
import { SyncQueueDriver, QueueOptions, configNamespace } from "@intentjs/core";

export default configNamespace("queue", () => {
  return {
    default: "notifications",
    connections: {
      notifications: {
        driver: 'sqs',
        listenerType: 'poll',
        apiVersion: '2012-11-05',
        credentials: fromIni({ profile: process.env.AWS_PROFILE }),
        prefix: process.env.SQS_PREFIX,
        queue: process.env.SQS_QUEUE,
        suffix: '',
        region: process.env.AWS_REGION,
      },
    },
  } as QueueOptions;
});
```

## Creating Job
Now that the queue is configured. We can start creating jobs. You can think of jobs as pieces of code which will run on the other end of the queue. Technically, we dispatch jobs that will be pushed into the queue and processed by the queue worker.

By default all of the jobs are stored inside the `app/jobs` directory.

You will need to create a `notification-jobs.ts` file inside the `app/jobs` directory. Inside the `handle` method you can write your business logic.

```ts filename="app/jobs/notificationJob.ts"
import { Injectable, Job } from '@intentjs/core';

@Injectable()
export class NotificationJob {
  constructor() {}

  @Job('notification')
  async create(data: Record<string, any>) {
    // write your logic here
  }
}
```
You can also create jobs manually by adding a `@Job(job_name)` decorator on any method.

### Options

#### connection

We understand that you may have multiple queue connections to handle in your application. While configuring the module, we set `default` connection inside the `config/queue.ts`. Incase, you want to dispatch the job on a different connection, you can do so:

```typescript
@Job('notification', { connection: "transactional-emails" })
```

#### queue

If you want to dispatch job to a different queue but on `default` connection, you can mention the queue attribute explicitly.

```typescript
@Job('notification', { queue: 'high-priority-queue' })
```

#### tries

This package provides out-of-the-box retrial logic, so that incase if any of the job throws any error, they will be retried a specific number of times. Default being `5`. But you can pass `tries` argument inside the `@Job` decorator to change the tries for a particular job.

```typescript
@Job('notification', { tries: 3 })
```

If the `notification` job throws any error, worker will again re-queue the job and re-run it again. Once the maximum number of retries are exhausted, the job will be discarded as it is.

#### delay

There can be some situations where you may want to delay the job by sometime. The default delay is `10` seconds, the job will become visible to the queue worker once the delay period has been elapsed. If you want to change the `delay` for a particular job, you can do it using the following method.

```typescript
@Job('notification', { delay: 60 })
```


## Dispatching Job

After creating jobs, we will now need to dispatch it. Dispatching a job basically means pushing it to the configured message queue so that it can be processed by the queue worker.

To dispatch a job, you can make use of the `Dispatch` helper function or `Queue` class.

### Using helper function

```typescript
import { Injectable, Dispatch } from "@intentjs/core";

@Injectable()
export class PaymentService {
  async verify(inputs: Record<string, any>): Promise<Record<string, any>> {
    Dispatch({
      job: "notification",
      data: {
        email: "hi@tryintent.com",
        subject: "Yay! Your payment is succesful!",
      },
    });
  }
}
```

Notice the `Dispatch` function call, we are passing two attributes:

- **job**: Name of the job that we want to run when this payload is received by the queue worker. In our case, `notification` job.
- **data**: Payload that we want to pass to the job. Any data that you pass here will be received by the job as its argument.

:::info
Since, the payload is serialized while pushing it to the queue, whatever type of object that you are passing will be serialized and pushed. Job handlers will only receive POJO/string/number as their argument.

For example, if you are passing a class instance, that will be converted into a POJO and pushed to the queue. In the job also, POJO will be received.
:::

### Using Queue class

You can use `Queue` class, to dispatch jobs in a more declarative way

```typescript
import { Injectable, Queue } from "@intentjs/core";

@Injectable()
export class PaymentService {
  async verify(inputs: Record<string, any>): Promise<Record<string, any>> {
    // ...your custom code here
    Queue.dispatch({
      job: "notification",
      data: {
        email: "hi@tryintent.com",
        subject: "Yay! Your payment is succesful!",
      },
    });
  }
}
```

Attributes are same as above.

### Options

:::warning
All the options passed while dispatching the job will override all the default options and the options defined in `@Job`. The priority of the configuration is defined as below:

```bash
Dispatch Config >> Job Config >> Default Config
```
:::

#### connection

We understand that you may have multiple queue connections to handle in your application. While configuring the module, we use the `default` connection. Incase, you want to dispatch the job on a different connection, you can do:

```typescript
Dispatch({
  job: "notification",
  connection: "transactional-emails",
  data: {
    email: "hi@tryintent.com",
    subject: "Yay! Your payment is succesful!",
  },
});
```

#### queue

If you want to dispatch a job to a different queue but on `default` connection, you can pass the queue attribute.

```typescript
Dispatch({
  job: "notification",
  queue: "payment-emails",
  data: {
    email: "hi@tryintent.com",
    subject: "Yay! Your payment is succesful!",
  },
});
```

#### tries

This package provides out-of-the-box retrial logic, so that incase if any of the job throws any error, they will be retried a specific number of times. Default being 0.

```typescript
Dispatch({
  job: "notification",
  tries: 3,
  data: {
    email: "hi@tryintent.com",
    subject: "Yay! Your payment is succesful!",
  },
});
```

If the `notification` job throws any error, worker will again push the job to the queue and re-run it again. Once the maximum number of retries are exhausted, the job will be discarded as it is.

#### delay

There can be some situations where you may want to delay the job for a while. For example, you may want to delay the job by 60 seconds, i.e., the job will become available to the queue worker once the delay period has been elapsed.

```typescript
Dispatch({
  job: "notification",
  delay: 60, // in seconds
  data: {
    email: "hi@tryintent.com",
    subject: "Yay! Your payment is succesful!",
  },
});
```

:::warning
  If you are using AWS SQS as the driver, the maximum allowed delay is `15 mins` only. If you want a queue with a good delay, you can use `redis` queue driver.
:::

## Running a Queue Worker

Now that we have seen how to create a job and dispatching it. We need to run a queue worker which will listen to the incoming messages from the queue and handle them.

:::info
  You don't need to run QueueWorker if you are using Sync driver.
:::

IntentJS comes with a command which you can use to run the `QueueWorker`. To run it, you can do so

```bash
node intent queue:work
```

Once you run the above command, it will start listening for the messages from the queue.

You can also pass the `--connection` option to listen to a specific connection.

```bash
node intent queue:work --connection=highpriority
```

To define the queue in the default connection

```bash
node intent queue:work --queue=high-priority-queue
```

To define the sleep time in seconds. It is used to define the wait time before it starts checking again after the queue is empty.

```bash
node intent queue:work --sleep=20
```

### Available Commands

Following commands are available which you can use with `node intent`

| Command      | Description                                                 |
| ------------ | ----------------------------------------------------------- |
| queue:work   | Command to run the queue worker, starts processing the jobs |

While the `queue:work` command will be good enough for majority of the cases, however if you want to write your custom `QueueWorker` script, you can make use of `QueueWorker` class, like below.

```typescript
import { QueueWorker } from '@intentjs/core';

const worker = QueueWorker.init({
  connection: "default",
  queue: "default-queue",
  sleep: 10,
});

await worker.listen(); // this will run a forever running thread to listen to the incoming messages
```

Note that if any of the value is not passed, then default setting for the missing properties will be used as fallback.

:::info
  If you are using multiple queues/connections in your application, then you
  will have to run different queue worker instances for each queue/connection.
:::

### Queue Worker Functions

#### Run Worker

To start listening to the messages, you can simply do

```typescript
await worker.listen();
```

{/* #### Purge Queue

You may want to clear(purge) the queue, you can do so by calling `purge` method.

```typescript
await worker.purge();
``` */}

## Drivers

In this section, we will see how you can various drivers very easily in the application.

This package supports the following drivers as of now

1. [Sync Driver](#sync-driver)
2. [AWS SQS Driver](#sqs-driver)
3. [Redis Driver](#redis-driver)
4. [DB Driver](#db-driver)
5. [Custom Driver](#custom-driver)

### Sync Driver [#sync-driver]

This is the easiest driver of all. There can be some cases where you may want to run your code synchronously for testing or debugging purposes. So, to keep it simple, this package provides out-of-the box support for running your `Jobs` synchronously.

:::info
If you are using a SyncDriver, you will have to ensure that you you are
  dispatching and consuming jobs in the same app.
:::

### SQS Driver [#sqs-driver]

[AWS SQS](https://aws.amazon.com/sqs/) is one of the most popular choice of using managed queue service. To use the driver, you need to install it first.

```bash
npm i @aws-sdk/client-sqs @aws-sdk/credential-providers
```

Before using it, you need to configure it first like below:

```typescript
import { QueueOptions, SqsDriver, configNamespace } from "@intentjs/core";

export default configNamespace("queue", () => {
  return {
    default: "notifications",
    connections: {
      notifications: {
        driver: 'sqs',
        listenerType: 'poll',
        apiVersion: '2012-11-05',
        credentials: fromIni({ profile: process.env.AWS_PROFILE }),
        prefix: process.env.SQS_PREFIX,
        queue: process.env.SQS_QUEUE,
        suffix: '',
        region: process.env.AWS_REGION,
      },
    },
  } as QueueOptions;
});
```

`sqs` queue driver expects following attributes

| Attribute      | Description                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------- |
| apiVersion | API version to be used by SQS client                                                          |
| profile   | Profile of the credential that will be read by the aws-sqs sdk from `~/.aws/credentials` file |
| region     | Region where the queue exists                                                                 |
| prefix     | URL prefix of the queue                                                                       |
| suffix     | URL suffix of the queue                                                                       |
| queue      | Queue's name                                                                                  |
| accessKey | Access Key of the AWS Account |
| secretKey | Secret Key of the AWS Acccout |
| credentials | One of the `credentials` method mentioned in [@aws-sdk/credential-providers](https://www.npmjs.com/package/@aws-sdk/credential-providers) |

### Redis Driver [#redis-driver]

You can also use Redis as your queue driver. You can install it like below

```
npm i ioredis --save
```

Before using it, you need to configure it first like below:

```typescript
import { QueueOptions, RedisDriver, configNamespace } from "@intentjs/core";

export default configNamespace("queue", () => {
  return {
    default: "notifications",
    connections: {
      notifications: {
        driver: 'redis',
        listenerType: 'poll',
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        queue: process.env.REDIS_QUEUE_NAME,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        prefix: '',
        database: 0,
      },
    },
  } as QueueOptions;
});
```

`redis` queue driver expects following attributes

| Attribute    | Description                   |
| ------------ | ----------------------------- |
| host     | Host of the redis server      |
| port     | Port of the redis server      |
| database | Database to be used for queue |
| queue    | Name of the queue             |
| username | Username of the redis server |
| password | Username of the redis password |
| prefix | Prefix of the queue (useful if you are using single redis server for multiple apps)|
| url | a fully qualified url string of the redis connection |

### Database Driver [#db-driver]
If you are just starting out with your application, and don't want to pay for third party services. You can use Database as a message queue.
Intent internally uses the same database connection that is used, so we don't need to re-configure our db connection for queue.

To use database as a message queue, you can simply do

```ts
import { QueueOptions, RedisDriver, configNamespace } from "@intentjs/core";

export default configNamespace("queue", () => {
  return {
    default: "notifications",
    connections: {
      db: {
        driver: 'db',
        listenerType: 'poll',
        table: 'intent_jobs',
        queue: 'default',
        sleep: 30,
      },
    },
  } as QueueOptions;
});
```

:::info
  There is already a migration for `intent_jobs` table that comes with your intent application. This table gets created,
  whenever you run `node intent migrate`.
:::

### Custom Driver [#custom-driver]

If you want to use your own custom queue driver, you can do so by extending `PollQueueDriver` class from `@intentjs/core` package.

You can easily do so using the command below:

Now, you need to create two classes `MyCustomQueueDriver` and `MyCustomQueueJob`. Here for understanding purpose we will use AWS AQS in our `MyCustom` driver.

```typescript
import { PollQueueDriver, InternalMessage } from "@intentjs/core";
import AWS = require("aws-sdk");
import { SqsJob } from "./job";

export class MyCustomQueueDriver implements PollQueueDriver {
  private client: AWS.SQS;
  private queueUrl: string;

  constructor(private options: Record<string, any>) {
    AWS.config.update({ region: options.region });
    const credential = new AWS.SharedIniFileCredentials({
      profile: options.profile,
    });
    AWS.config.credentials = credential;
    this.client = new AWS.SQS({ apiVersion: options.apiVersion });
    this.queueUrl = options.prefix + "/" + options.queue;
  }

  async push(message: string, rawPayload: InternalMessage): Promise<void> {
    const params = {
      DelaySeconds: rawPayload.delay,
      MessageBody: message,
      QueueUrl: this.options.prefix + "/" + rawPayload.queue,
    };

    await this.client.sendMessage(params).promise().then();
    return;
  }

  async pull(options: Record<string, any>): Promise<SqsJob | null> {
    const params = {
      MaxNumberOfMessages: 1,
      MessageAttributeNames: ["All"],
      QueueUrl: this.options.prefix + "/" + options.queue,
      VisibilityTimeout: 30,
      WaitTimeSeconds: 0,
    };
    const response = await this.client.receiveMessage(params).promise();
    const message = response.Messages ? response.Messages[0] : null;
    return message ? new SqsJob(message) : null;
  }

  async remove(job: SqsJob, options: Record<string, any>): Promise<void> {
    const params = {
      QueueUrl: this.options.prefix + "/" + options.queue,
      ReceiptHandle: job.data.ReceiptHandle,
    };
    await this.client.deleteMessage(params).promise();
    return;
  }

  async purge(options: Record<string, any>): Promise<void> {
    const params = {
      QueueUrl: this.options.prefix + "/" + options.queue,
    };
    await this.client.purgeQueue(params).promise();
    return;
  }

  async count(options: Record<string, any>): Promise<number> {
    const params = {
      QueueUrl: this.options.prefix + "/" + options.queue,
      AttributeNames: ["ApproximateNumberOfMessages"],
    };
    const response: Record<string, any> = await this.client
      .getQueueAttributes(params)
      .promise();
    return +response.Attributes.ApproximateNumberOfMessages;
  }
}
```