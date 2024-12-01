---
title: Installation
description:
image:
---

# Installation

## What is Intent?

Intent is a web application framework with elegant syntax and focus on developer experience. 
It _intends_ to provide declarative APIs to develop and ship sophisticated solutions with ease. 
NodeJS ecosystem has been growing for more than almost a decade, but the challenge for us as a developer
is still the same, ie to setup a project we need to perform 20+ steps to get the project running, and leave alone the part
where you want to integrate something like AWS S3, Message Queues, Redis, etc.

Intent is trying to solve exactly that, you get a sweet, elegant and well-structured framework to quickly build and ship your project while we sweat out the details.

Intent comes packed with tons of features like Database integration, Storages, Message Queues, Loggers, Mailers, Caching, Localization, etc. We internally use NestJS dependency injection, on top of this we also try to simplify things for you.  While Intent tries it's best to respect NestJS design principles in the best way possible, but sometimes it can be difficult. So, by default Intent follows the way which ensures maximum value for the community

Intent aims to provide a good developer experience while still ensuring that it is performant and scalable.

## Why Intent?

Intent is a web application framework for devs and teams who intends to build and ship complex yet sophisticated solutions to the world. It provides APIs which are declarative and customisable, while still keeping abstraction of unnecessary loads at it's best.

Intent provides necessary feature-integrations out of the box.

- **RDBMS** - MySQL, PostgreSQL,
- **Storage** - Unix File System AWS S3.
- **Message** Queues - AWS SQS, Redis
- **Mailers** - SMTP, Mailgun, Resend
- **Caching** - Redis, In-Memory
- **Logging**
- **Validations**
- **Transformers**
- **Helpers**
- **Internationalisation**
- **Console Commands**

:::info
Some features are delivered out-of-the-box and some you can integrate as you need them.
:::

## Installation

Intent works best when you create your new application with Intent itself, to do so, simply run

```bash
$ npx new-intent-app@latest

? What's your *Intent* to name this project? new-sample-app
? Are you planning to use AWS in your application? Yes
? Would you like to use Redis in your application? Yes
✔ Cloning repository
✔ Installing dependencies
✔ Setting up .env
✔ Reset git history
```

Once the command has run, you can take a look at the [first project](./first-project.md) to getting it running.