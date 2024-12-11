---
title: Directory Structure
description:
image:
---

# Directory Structure

Intent comes with a directory structure which can be a good starting point for all scale of applications, small or large. It comes with a recommended setup of directory structure which enables you to start developing features from Day 1 itself. However, these are just recommendations and can be changed as per the requirements.

## The Root Directory

### The `app` directory

The `app` directory is the core of your application. This will contain all of your console commands, controllers, models, validators, event listeners, jobs, etc. Each of this directory is explained in detail in [the following section](directory-structure.md#src-directory).

### The `config` directory

Inside the `config` directory, your application configuration lives.

### The `db` directory

The `db` directory contains all of your migration files in `*.js` files, using which you can create schemas in your database. You will only use this directory when you are using a SQL based database like MySQL, PostgreSQL, etc.

### The `dist` directory

This is where all of your typescript files are transpiled and stored as `*.js` files.

### The `node_modules` directory

The `node_modules` directory contains all of your application dependencies.

### The `public` directory

The `public` directory holds all of the static files which should be served from your application over HTTP. It also contains all of the compiled `js`, `css` files along with all of the assets that you want to serve publicly to anyone.

### The `resources` directory

The `resources` directory holds all of the `localisation` or `translation` files. It also contains your `views`, uncompiled `tailwind css` and `js` files.

### The `storage` directory

The `storage` directory contains all of the framework `log` files. It also contains an empty `app` directory, which you can use to store user generated files. To do so, most likely you will make use of [Storage](https://tryintent.com/docs/file-storage) class which comes packed with features.

## The App directory

The App directory is where most of your business logic will reside. The directory contains controllers, providers, console commands, event listeners, jobs, mails, validators, etc.

### The `console` directory

The `console` directory contains all of the custom Intent commands for your application. These commands may be generated using `make:command` command. To read more about, see [Console](https://tryintent.com/docs/console).

```bash
node intent make:command updateUser
# Successfully created app/console/updateUserCommand.ts
```

### The `events` directory

The `events` directory contains all of your event classes. This directory doesn't exist by default and get s created when you create your first event. These events may be generated using `make:event` command. To read more about what Events offer, [read here](https://tryintent.com/docs/events).

```bash
node intent make:event order_placed
# Successfully created app/events/orderPlacedEvent.ts
```

### The `exceptions` directory

The `exceptions` directory is where all of your errors exist. It contains a few commonly used HTTP exceptions and an `ExceptionFilter` class which is responsible for handling all of the exceptions happening in your HTTP application. Read more about exceptions in [Error Handling](https://tryintent.com/docs/error-handling).

```bash
node intent make:exception user_not_found
# Successfully created app/exceptions/userNotFoundException.ts
```

### The `http` directory

The `http` directory contains all of your controllers, middlewares and guards in their respective directory. Almost all of the logic of handling requests will be placed inside this directory.

```bash
node intent make:controller books
# Successfully created app/http/controllers/booksController.ts
```

### The `jobs` directory

The `jobs` directory houses all of your Queue Job classes. Again, similar to events directory, this doesn't exist by default and will be created when you generate your first job class, you may do so using `make:job` command. Head to [Queues](https://tryintent.com/docs/queues) for more detail.

```bash
node intent make:job send_mail
# Successfully created job at app/jobs/sendMailJob.ts
```

### The `listeners` directory

The `events/listeners` directory holds all of your event listener classes. This directory doesn't exist by default and will be created when you generate your first listener class, you may do so using `make:listener` command. See the [documentation](https://tryintent.com/docs/events) for more details.

```bash
node intent make:listener payment_confirmed
# Successfully created app/events/listeners/paymentConfirmedListener.ts
```

### The `mails` directory

The `mails` directory contains all of your mail classes. The directory will be created when you generate your first mail class using `make:mail` command. You can read more about mails [here](https://tryintent.com/docs/mailers).

```bash
node intent make:mail send_otp
# Successfully created apps/mails/sendOtpMail.ts
```

### The `models` directory

The `models` directory contains all of your database models that we will create. When you create your IntentJS application for the first time, it contains one `user.ts` model by default. You can read about models in detail [here](https://tryintent.com/docs/db-models).

```bash
node intent make:model user
# Successfully created app/models/userModel.ts
```

### The `services` directory

The `services` directory holds all of your service classes. You can make use of `services` to write classes that hold your business logic and inject them inside the controllers.

```bash
node intent make:service auth
# Successfully created app/services/authService.ts
```
