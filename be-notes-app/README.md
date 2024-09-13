# RESTful API for Notes App

Used during AI prompting recap for Gen AI integration

## Setup

- Fork repo
- Clone into your computer
- `cd` into working directory
- `npm i` to install dependencies
- This project persists database in a Mongo DB, by default in uses an in-memory database, meaning that the data is gone after restarting the app. If you wish to persist data for real:
  - Create an account in [Mongo Atlas](https://account.mongodb.com/account/login)
  - [Follow these instructions](https://www.mongodb.com/docs/atlas/#build-with-mongodb-on-aws--azure--and-google-cloud) to get a free database.
  - Get your connection string including user and password.
  - Create a `.env` file with a variable `MONGO_URI` with a value set to a valid Mongo connection string.
  - If you get stuck, ask your instructor!
- The server defaults to port `8080`, although an environment variable `PORT` can be used to override this behaviour

## Commands

- `npm run dev`: Starts development server, pulling environment variables from `.env` file
- `npm start`: Production server, environment variables need to be passed to system.

## Usage

- The application has its entry point at `index.js`
- There are 2 routes defined:
  - `/entries`
  - `/notes`
- Each of the routes supports:
  - `GET /<resource>`: Get all
  - `POST /<resource>`: Create
  - `GET /<resource>/:id`: Get single
  - `PUT /<resource>`: Update single
  - `DELETE /<resource>`: Delete single
