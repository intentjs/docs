---
title: Database Geting Started
description:
image:
---

# Database

Intent comes integrated with support for database by default. It is made possible with the ORM `ObjectionJS`.

ObjectionJS provides very clean and fluent APIs to build and run complex queries at ease. We have worked in the past with many ORMs, but ObjectionJS stood out, it is relatively young but more mature in terms of its offerings.

### Features ObjectionJS provides

- Very clean and mature Query Builder

- Fluent Relational Queries

- Official Typescript Support

- Clean Migrations and Seeders using [`KnexJS`](http://knexjs.org/)

- Support for Hooks

- Powerful model entity relation operations

- Easy to use Transactions

### 🚀 What we have added on top of it?

- Setting up project is now much easier than ever

- Custom `BaseModel` having performant functions

- In-built `DatabaseRepository` to help you maintain data store functions smartly

- Beautiful console commands to manage migrations

- Custom `QueryBuilder` with some much needed methods

- Utilise multiple connections in repositories smartly.

- Clean Transaction API using Repositories

- Supports Soft Delete

## Configuration

The configuration for the databases is located at `config/database.ts`.