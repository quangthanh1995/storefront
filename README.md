# Storefront Backend Project

## Getting Started

This repo contains a basic Node and Express app to get you started in constructing an API. To get started, clone this repo and run `yarn` in your terminal at the project root.

## Used Technologies

The application uses of the following libraries:

- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

## How to run application

#### Install PostgreSQL and setup.

Connect to default database

`psql -U postgres`

Create a user

`CREATE USER thanhngo WITH PASSWORD 'Udacity@2023';`

Create database for both Development and Test environments

```
CREATE DATABASE storefront;
CREATE DATABASE storefront_test;
```

Grant all privileges

```
\c storefront;
GRANT ALL PRIVILEGES ON DATABASE storefront TO thanhngo;
GRANT ALL ON SCHEMA public TO thanhngo;

\c storefront_test;
GRANT ALL PRIVILEGES ON DATABASE storefront_test TO thanhngo;
GRANT ALL ON SCHEMA public TO thanhngo;
```

#### Environment variables setup.

You need to copy the following variable and create a file name `.env` and put it to source code.

```
  POSTGRES_HOST=127.0.0.1
  POSTGRES_DB=storefront
  POSTGRES_TEST_DB=storefront_test
  POSTGRES_USER=thanhngo
  POSTGRES_PASSWORD=Udacity@2023
  ENV=dev
  BCRYPT_PASSWORD=Udacity@2023
  SALT_ROUNDS=10
  TOKEN_SECRET=Udacity@2023

```

#### Run migration

`db-migrate up`

Make sure that you have installed db-migrate globally already with `yarn add global db-migrate`

#### Run application

`yarn run watch`

#### Run test

`yarn run test`
