# REST API using Express and Typescript

This is a project to practice using Express with Typescript. The application takes a controller-service-model structure. Project extended from [this](https://www.youtube.com/watch?v=BWUi6BS9T5Y) tutorial.

## Pre-requisites

- Node.js
- A running instance of MongoDB
- Postman to test the routes
- Yarn

## Usage

1. Install all dependencies by running `yarn install`
1. Start the server by running `yarn dev`
1. To import pre-made products and users data into your local database, run `yarn importData`. If you would like to make product and user documents to populate each collection, submit POST requests to `/api/products` and to `/api/users`. To delete all documents in all three collections, run `yarn deleteData`
1. You can generate your own public and private keys and replace the ones in `.env` or you can just use them as is
1. Import the Postman collection json file to Postman to test the routes
1. Create a session to generate tokens and access routes that go through requireUser

## API

The API has three resources:

1. Users
1. Sessions
1. Products

The request-response cycle goes through the route, controller, service, model, and mongodb. Each request first goes through a **deserializeUser** middleware to determine whether they have access and refresh tokens. When the request contains a body, it is validated against a schema using Zod in the **validateResource** middleware. If a route is protected or requires the user to be queried, the request goes through a **requireUser** middleware. Only then can the request go through the controller. Database calls are in the service layer.

Requests that go through the requireUser middleware need to create a session first to generate access and refresh tokens and be allowed to pass through the controller.

## Added Features

These are some of the features that I added to the original API:

- GET user
- UPDATE user info
- UPDATE user password
- GET all products
- Alias route (5 cheapest products)
- JSON responses
- Data to be imported along with scripts
- Error handling

## Error Handling

Operational errors are created using the AppError class with message, statusCode, and isOperational properties. When an error is needed, an instance of the AppError class is created and passed into next(). All errors passed into next() are forwared to the error handling middleware where they are differentiated based on whether they are operational or not. Validation and Cast Errors from MongoDB are also caught in this middleware.

Whenever necessary, an error from the service layer is thrown using the AppError class, but not passed into next(). This error will be caught in the try-catch block of the controllers. Uncaught Exceptions and Unhandled Rejections are caught in app.ts, and will trigger the shutting down of the application.
