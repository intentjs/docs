---
title: Task Scheduling
description: Learn how to define, schedule, and manage recurring background tasks (cron jobs) within your IntentJS application using the built-in scheduler.
keywords: task scheduling, cron, jobs, scheduler, IntentJS, background tasks, recurring tasks, frequency, hooks, output
image:
---

# Introduction
In the past, you may have written individual cron entries on your server for every task you needed to schedule — whether it was sending emails, syncing data, or cleaning up old files. Over time, this becomes hard to manage: your task schedule lives outside your codebase, you lose visibility into what's running and when, and you end up SSHing into your server just to check or update a job.

IntentJS offers a modern, code-first approach to scheduling tasks in your JavaScript or TypeScript apps.

Instead of scattering cron logic across servers or scripts, you define all your recurring tasks in one place — inside your project — using a simple, fluent API. With IntentJS, your entire schedule is part of your source control, versioned alongside your code, and easy to reason about.

When using IntentJS, you only need to register a single cron job on your server or deployment platform. That one entry boots up the IntentJS runtime, which then figures out which tasks should run based on your config.

## Defining Schedules

Intent offers you the flexibility of defining the schedules anywhere in your `app` directory. To get started, let's take a look at an example. In this example, we will schedule a callback to be called every day at 1PM. Within this callback, we will execute a database query to get count of all users.

```ts
import { Schedule } from '@intentjs/core/schedule';

Schedule.call(() => {
    const count = db.users.count();
    console.log('total number of users ===', count);
}).dailyAt('13:00').run();
```

In addition to scheduling using callback, you may also schedule an `Injectable` class. These `Injectable` classes need to have a `handle` method which will automatically be invoked.

```ts
Schedule.call(ClearAbandonedCarts).daily().run();
```

If you would like to see the list of all registered schedules, you can use the `schedule:list` command.

```bash
node intent schedule:list
```

### Intent Commands

In addition to scheduling callbacks, you can also schedule [Intent Commands](./console.md) and system commands. For example, you may use the `command` method to schedule an Intent command.

When scheduling an Intent command, you can also pass array of additional command-line arguments that should be provided when it is invoked.

```ts
Schedule.command('users:delete-inactive --force')
  .purpose('Delete the users inactive for last 30 days')
  .daily()
  .run();
```

### Queued Jobs

If you wish to schedule a [Queued Jobs](./queues.md), you can use the `job` method to do so. It provides a convenient way to schedule queued jobs, without having to use the `call` method.

```ts
Schedule.job({
  job: 'process_abandoned_cart',
  data: { from: '2024-04-16', to: '2024-04-17' },
})
  .purpose('cron dispatching job every day at 5AM')
  .at('5 AM')
  .run();
```

The `job` method accepts the same set of arguments that you use when [dispatching a job](./queues.md#dispatching-job), which means you can also pass the queue name, connection, delay, etc. arguments.

```ts
Schedule.job({
  job: 'process_abandoned_cart',
  data: { from: '2024-04-16', to: '2024-04-17' },
  queue: 'cart-queue',
  delay: 10 // in seconds
})
  .purpose('cron dispatching job every day at 5AM')
  .at('5 AM')
  .run();
```

### Shell Commands

You can use the `exec` method to issue a command to the operating system.

```ts
Schedule.exec('ls -al').daily().run();
```

### Frequency Options

Till now, we have already seen a few examples of how you can define a schedule to run at specificed intervals. However, Intent comes with many more schedule frequencies that you can use while defining a task.

|Method|Description|
|---|---|
| `.cron('* * * * *');` | Set a custom cron expression for the task (e.g., run every minute). |
| `.at('13:00');` | Schedule the task to run daily at a specific time (e.g., '13:00'). Alias for `dailyAt`. |
| `.everySecond();` | Schedule the task to run every second. |
| `.everyTwoSeconds();` | Schedule the task to run every two seconds. |
| `.everyFiveSeconds();` | Schedule the task to run every five seconds. |
| `.everyTenSeconds();` | Schedule the task to run every ten seconds. |
| `.everyFifteenSeconds();` | Schedule the task to run every fifteen seconds. |
| `.everyTwentySeconds();` | Schedule the task to run every twenty seconds. |
| `.everyThirtySeconds();` | Schedule the task to run every thirty seconds. |
| `.everyMinute();` | Schedule the task to run every minute. |
| `.everyTwoMinutes();` | Schedule the task to run every two minutes. |
| `.everyThreeMinutes();` | Schedule the task to run every three minutes. |
| `.everyFourMinutes();` | Schedule the task to run every four minutes. |
| `.everyFiveMinutes();` | Schedule the task to run every five minutes. |
| `.everyTenMinutes();` | Schedule the task to run every ten minutes. |
| `.everyFifteenMinutes();` | Schedule the task to run every fifteen minutes. |
| `.everyThirtyMinutes();` | Schedule the task to run every thirty minutes. |
| `.hourly();` | Schedule the task to run hourly (at minute 0). |
| `.hourlyAt(15);` | Schedule the task to run hourly at a specific minute (e.g., at minute 15). |
| `.everyOddHour(30);` | Schedule the task to run every odd hour, at a specific minute (e.g., at minute 30). |
| `.everyTwoHours();` | Schedule the task to run every two hours (at minute 0). |
| `.everyThreeHours(45);` | Schedule the task to run every three hours, at a specific minute (e.g., at minute 45). |
| `.everyFourHours();` | Schedule the task to run every four hours (at minute 0). |
| `.everySixHours(10);` | Schedule the task to run every six hours, at a specific minute (e.g., at minute 10). |
| `.daily();` | Schedule the task to run daily at midnight. |
| `.dailyAt('13:00');` | Schedule the task to run daily at a specific time (e.g., '13:00'). |
| `.twiceDaily(1, 13);` | Schedule the task to run twice daily at specified hours (e.g., 1 AM and 1 PM) at minute 0. |
| `.twiceDailyAt(8, 20, 30);` | Schedule the task to run twice daily at specified hours and minute (e.g., 8:30 AM and 8:30 PM). |
| `.weekly();` | Schedule the task to run weekly on Sunday at midnight. |
| `.weeklyOn(1, '08:00');` | Schedule the task to run weekly on a specific day (e.g., 1 for Monday) and time (e.g., '08:00'). |
| `.monthly();` | Schedule the task to run monthly on the 1st at midnight. |
| `.monthlyOn(4, '15:00');` | Schedule the task to run monthly on a specific day (e.g., the 4th) and time (e.g., '15:00'). |
| `.twiceMonthly(1, 16, '08:00');` | Schedule the task to run twice monthly on specific days (e.g., the 1st and 16th) and time (e.g., '08:00'). |
| `.lastDayOfMonth('23:59');` | Schedule the task to run on the last day of the month at a specific time (e.g., '23:59'). |
| `.quarterly();` | Schedule the task to run quarterly on the 1st of the first month of the quarter at midnight. |
| `.quarterlyOn(15, '00:00');` | Schedule the task to run quarterly on a specific day of the first month of the quarter (e.g., the 15th) and time (e.g., '00:00'). |
| `.yearly();` | Schedule the task to run yearly on January 1st at midnight. |
| `.yearlyOn(6, 1, '17:00');` | Schedule the task to run yearly on a specific month (e.g., 6 for June), day (e.g., 1st), and time (e.g., '17:00'). |

You can also combine these methods to create even more finely tuned schedules that only run on certain days of the week. For example, you may schedule a command to run only on Tuesdays.

```ts
// Run once per week on Monday at 1 PM...
Schedule.command('foo')
  .weekly()
  .mondays()
  .at('13:00')
  .run();

// Run hourly from 8 AM to 5 PM on weekdays...
Schedule.command('send:email')
  .weekdays()
  .hourly()
  .timezone('America/Chicago')
  .between('8:00', '17:00')
  .run();
```

A list of additional schedule frequencies can be found below.

| Methods | Description |
|---|---|
|`.weekdays();`|Limit the task to weekdays.|
|`.weekends();`|Limit the task to weekends.|
|`.sundays();` |Limit the task to Sunday.|
|`.mondays();` |Limit the task to Monday.|
|`.tuesdays();` |Limit the task to Tuesday.|
|`.wednesdays();` |Limit the task to Wednesday.|
|`.thursdays();` |Limit the task to Thursday.|
|`.fridays();` |Limit the task to Friday.|
|`.saturdays();` |Limit the task to Saturday.|
|`.days(array);` |Limit the task to specific days.|
|`.between(startTime, endTime);`|Limit the task to run between start and end times.|
|`.when(callback);`|Limit the task based on a truth test.|
|`.skip(callback);`|Limit the task based on a false test.|

#### Day Constraints
The `days` method can be used to limit the execution of a task to specific days of a the week. For example, you may schedule a command to run hourly on Monday and Thursday.

```ts
Schedule.command('foo')
  .hourly()
  .days([1, 4])
  .run();
```

Alternatively, you may also use the constants available in the `Schedule` class.

```ts
Schedule.command('foo')
  .hourly()
  .days([Schedule.MONDAY, Schedule.THURSDAY])
  .run();
```

#### Between Time Constraints

You can make use of the `between` method to limit the execution of a task based on the time of a day.

```ts
Schedule.command('foo')
  .hourly()
  .between('7:00', '22:00')
  .run()
```

#### Truth Test Constraints

There can be scenarios when you want to limit the task based on a result of a given truth test, for this you can utilise the `when` method, if the callback returns `true`, the task will execute as long as no other constraining conditions prevent the task from running.

```ts
Schedule.command('foo')
  .daily()
  .when(() => {
    return true;
  })
  .run();
```

If you want to do the inverse of `when` method, you can use the `skip` method. If the `skip` method returns true, the scheduled task will not be executed.

```ts
Schedule.command('foo')
  .daily()
  .skip(() => {
    return true;
  })
  .run();
```

### Timezones

Using the `timezone` method, you can specify that a schedule task's time should be interpreted withing a given timezone.

```ts
Schedule.command('foo')
  .timezone('America/Chicago')
  .at('2:00')
  .run();
```

### Meta Methods

When you are defining a schedule using the `Schedule` class, you would want to assign some meta information to it like `purpose`, `name` to improve the readability of the `Schedule` class.

#### Purpose
To assign a purpose of the scheduled task, you can use the `purpose` method.

```ts
Schedule.command('email:send')
  .purpose('Send emails to the newsletter subscribers.')
  .daily()
  .run();
```

#### Name
If you wish to dynamically start or stop your scheduled task, it's always recommended to assign a name to your task. The name you provide shall be used against the task in the `SchedulerRegistry` class.

To assign a name to the task, you can use the `name` method.

```ts
Schedule.command('email:send')
  .name('send_email')
  .daily()
  .run();
```

## Running the Scheduler

There are two ways you can run your scheduled tasks, in your main application's thread, or else in a separate thread. By default, the tasks run in the main thread, if you would like to change this behaviour you can change the `runInAnotherThread` flag in `config/app.ts` file.

```ts
/**
 * -----------------------------------------------------
 * Scheduler Configuration
 * -----------------------------------------------------
 *
 * This property defines the configuration for the scheduler.
 */
schedules: {
  /**
   * -----------------------------------------------------
   * Run in another thread
   * -----------------------------------------------------
   *
   * This property defines whether the scheduler 
   * should run in another thread.
   */
  runInAnotherThread: true,

  /**
   * -----------------------------------------------------
   * Timezone
   * -----------------------------------------------------
   *
   * This property defines the timezone for the scheduler.
   */
  timezone: "Asia/Kolkata",
}
```

Now, to start your schedules in a separate thread, you can run the `schedule:work` command. This approach is beneficial if you are running your application on multiple servers, then you would want to limit your scheduled jobs to only be executed on a single server.


```bash
node intent schedule:work
```

## Task Output

Intent Task Schedulers provides several convenient methods for working with the output generated by the scheduled tasks. First, using the `sendOutputTo` method, you can send the output to a file for later inspection.

```ts
Schedule.command('emails:send')
  .daily()
  .sendOutputTo(filePath)
  .run();
```

If you would like to append the output to a given file, you can use the `appendOutputTo` method.

```ts
Schedule.command('emails:send')
  .daily()
  .appendOutputTo(filePath)
  .run();
```

Using the `emailOutputTo` method, you can email the output to the specified email address. Before emailing, make sure you have configured Intent's [email services](./mailers.md).

```ts
Schedule.command('report:generate')
    .daily()
    .sendOutputTo(filePath)
    .emailOutputTo('hi@tryintent.com')
    .run();
```

If you want to email the output only on failure, use the `emailOutputOnFailure` method.

```ts
Schedule.command('report:generate')
    .daily()
    .emailOutputOnFailure('hi@tryintent.com')
    .run();
```

## Task Hooks

Using the `before` and `after` methods, you may specify callbacks to be executed before and after the scheduled task is executed.

```ts
Schedule.command('emails:send')
  .daily()
  .before(() => {})
  .after(() => {})
  .run();
```

The `onSuccess` and `onFailure` method allows you to specify code to be executeed if the scheduled task succeeds or dails.

```ts
Schedule.command('emails:send')
  .daily()
  .onSuccess(() => {})
  .onFailure((error: Error) => {})
  .run();
```

If output is available from your scheduled task, you may access it in your `after`, `onSuccess` or `onFailure` hooks.

```ts
Schedule.command('emails:send')
  .daily()
  .onSuccess((result: any) => {})
  .onFailure((result:any) => {})
```

#### Pinging URLs

Using the `pingBefore` and `thenPing` methods, the scheduler can automatically ping a given URL before or after the task is executed. This method can be useful for notifying on an external service, such as Slack, etc, that your scheduled task is beginning or has finished execution.

```ts
Schedule.command('emails:send')
  .daily()
  .pingBefore(url)
  .thenPing(url)
  .run();
```

The `pingOnSuccess` and `pingOnFailure` methods may be used to ping the given URL only if the task succeeds or fails.

```ts
Schedule.command('emails:send')
  .daily()
  .pingOnSuccess(url)
  .pingOnFailure(url)
  .run();
```

The `pingBeforeIf`, `thenPingIf`, `pingOnSuccessIf`, and `pingOnFailureIf` methods may be used to ping a given URL only if the given callback returns true.

```ts
Schedule.command('emails:send')
  .daily()
  .pingBeforeIf(() => true, beforePingUrl)
  .thenPingIf(() => true, thenPingUrl)
  .run();

Schedule.command('emails:send')
  .daily()
  .pingOnSuccessIf(() => true, pingOnSuccessUrl)
  .pingOnFailureIf(() => true, pingOnFailureUrl)
  .run();
```