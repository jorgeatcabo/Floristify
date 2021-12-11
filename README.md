# Floristify is a serverless based web application for manage florist products.

This project uses AWS Lambda and Serverless framework.

## Table of Contents

- [Functionality](#functionality 'Functionality')
- [Products](#products 'Products')
- [Prerequisites](#prerequisites 'Prerequisites')
- [Functions implemented](#functions-implemented 'Functions implemented')
- [Frontend](#frontend 'Frontend')
- [Authentication](#authentication 'Authentication')
- [Best practices](#best-practices 'Best practices')
- [Storage](#Storage 'Storage')
- [How to run the application](#how-to-run-the-application 'How to run the application')
- [Mockup Images](#mockup-images 'Mockup')
- [Animation](#animation 'Animation')
- [Contributor](#contributor 'Contributor')
- [Questions](#questions 'Questions')

---

## Functionality

This application allows creating/removing/updating/fetching florist products. Each product can have an attachment image. Each user only has access to products that he/she has created.

---

## Products

The application stores products, and each product contains the following fields:

- `productId` (string) - a unique id for a product
- `createdAt` (string) - date and time when an product was created
- `name` (string) - name of a product (e.g. "Rainbow Tulip")
- `category` (string) - name of the category which a product belongs
- `price` (number) - product price
- `description` (string) - product description
- `stock` (number) - product stock
- `attachmentUrl` (string) - a URL pointing to an image attached to a product

It is also store an id of a user who created a product.

---

## Prerequisites

- <a href="https://manage.auth0.com/" target="_blank">Auth0 account</a>
- <a href="https://github.com" target="_blank">GitHub account</a>
- <a href="https://nodejs.org/en/download/package-manager/" target="_blank">NodeJS</a> version up to 12.xx
- Serverless
  - Create a <a href="https://dashboard.serverless.com/" target="_blank">Serverless account</a> user
  - Install the Serverless Framework’s CLI (up to VERSION=2.21.1). Refer to the <a href="https://www.serverless.com/framework/docs/getting-started/" target="_blank">official documentation</a> for more help.
  ```bash
  npm install -g serverless@2.21.1
  serverless --version
  ```
  - Login and configure serverless to use the AWS credentials
  ```bash
  # Login to your dashboard from the CLI. It will ask to open your browser and finish the process.
  serverless login
  # Configure serverless to use the AWS credentials to deploy the application
  # You need to have a pair of Access key (YOUR_ACCESS_KEY_ID and YOUR_SECRET_KEY) of an IAM user with Admin access permissions
  sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_KEY --profile serverless
  ```

---

## Technologies

| Back-end        | Front-end   |
| --------------- | ----------- |
| AWS Lambda      | React       |
| AWS API Gateway | Typescript  |
| JWT             | Semantic UI |
| DynamoDB        |             |
|                 |             |

---

## Functions implemented

To implement this project, it is necessary to implement the following functions and configure them in the `serverless.yml` file:

- `Auth` - this function implements a custom authorizer for API Gateway that is added to all other functions.

- `GetProducts` - return all products for a current user. A user id is extracted from a JWT token that is sent by the frontend

It returns data that looks like this:

```json

    {
        "attachmentUrl": "https://serverless-floristify-images-182620489580-dev.s3.amazonaws.com/df22ae58-e33a-4230-9f9f-1765140877d3.jpg",
        "category": "Tulip",
        "createdAt": "2021-12-06T18:47:40.725Z",
        "stock": 12,
        "price": 44,
        "description": "This bouquet is made up of rainbow colored tulips",
        "name": "Rainbow Tulip",
        "productId": "df22ae58-e33a-4230-9f9f-1765140877d3"
    },
    {
        "attachmentUrl": "https://serverless-floristify-images-182620489580-dev.s3.amazonaws.com/4d033a0e-b90a-4948-831c-9cf10355ad25.jpg",
        "category": "Rose",
        "createdAt": "2021-12-06T19:02:21.500Z",
        "stock": 5,
        "price": 62,
        "description": "This flower bouquet blends red spray roses, proteas and alstroemeria.",
        "name": "Pining for You",
        "productId": "4d033a0e-b90a-4948-831c-9cf10355ad25"
    },
    {
        "attachmentUrl": "https://serverless-floristify-images-182620489580-dev.s3.amazonaws.com/2c76ac4e-de2c-4599-aed9-25d0ef8bac7c.jpg",
        "category": "Archid",
        "createdAt": "2021-12-06T18:51:58.159Z",
        "stock": 4,
        "price": 59,
        "description": "This purple orchid comes in a slate blue Ecopot and is a perfect gift plant.",
        "name": "Tropicali",
        "productId": "2c76ac4e-de2c-4599-aed9-25d0ef8bac7c"
    }

```

- `CreateProduct` - creates a new product for a current user. A shape of data send by a client application to this function can be found in the `CreateProductRequest.ts` file

It receives a new product to be created in JSON format that looks like this:

```json
{
  "name": "Tropicali",
  "category": "Archid",
  "price": 59,
  "description": "This purple orchid comes in a slate blue Ecopot and is a perfect gift plant.",
  "stock": 4
}
```

It returns a new product that looks like this:

```json
{
  "item": {
    "attachmentUrl": "https://serverless-floristify-images-182620489580-dev.s3.amazonaws.com/2c76ac4e-de2c-4599-aed9-25d0ef8bac7c.jpg",
    "category": "Archid",
    "createdAt": "2021-12-06T18:51:58.159Z",
    "stock": 4,
    "price": 59,
    "description": "This purple orchid comes in a slate blue Ecopot and is a perfect gift plant.",
    "name": "Tropicali",
    "productId": "2c76ac4e-de2c-4599-aed9-25d0ef8bac7c"
  }
}
```

- `UpdateProduct` - updates a product created by a current user. A shape of data send by a client application to this function can be found in the `UpdateProductRequest.ts` file

It receives an object that contains three fields that can be updated in a TODO item:

```json
{
  "name": "Tropicali",
  "category": "Archid",
  "price": 59,
  "description": "This purple orchid comes in a slate blue Ecopot and is a perfect gift plant.",
  "stock": 4
}
```

The id of a product is passed as a URL parameter.

It returns an empty body.

- `DeleteProduct` - deletes a product created by a current user. Expects an id of a product to remove.

It returns an empty body.

- `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a product.

It return a JSON object that looks like this:

```json
{
  "uploadUrl": "https://serverless-floristify-images-182620489580-dev.s3.amazonaws.com/2c76ac4e-de2c-4599-aed9-25d0ef8bac7c.jpg"
}
```

All functions are connected to appropriate events from API Gateway.

An id of a user is extracted from a JWT token passed by a client.

It is added necessary resources to the `resources` section of the `serverless.yml` file such as DynamoDB table and S3 bucket.

---

## Frontend

The `client` folder contains a web application that uses the API developed in the project.

This frontend works with the serverless application developed. The `config.ts` file in the `client` folder configures the client application containing an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

---

## Authentication

It is implemented authentication in this application, it is necessary to create an Auth0 application and copy "domain" and "client id" to the `config.ts` file in the `client` folder. It is recommended use asymmetrically encrypted JWT tokens.

---

## Best practices

## Validating HTTP requests

It is validated incoming HTTP requests using request validation in API Gateway by providing request schemas in function definitions.

## Application monitoring

The project application generates application-level metrics.

## Logging

The project code comes with a configured [Winston](https://github.com/winstonjs/winston) logger that creates [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements.

```ts
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')
logger.info('User was authorized', {
  key: 'value'
})
```

---

## Storage

To store products, it is used a DynamoDB table with local secondary index(es).It is created a DynamoDB resource like this:

```yml
ProductsTable:
  Type: AWS::DynamoDB::Table
  Properties:
    AttributeDefinitions:
      - AttributeName: userId
        AttributeType: S
      - AttributeName: productId
        AttributeType: S
      - AttributeName: createdAt
        AttributeType: S
    KeySchema:
      - AttributeName: userId
        KeyType: HASH
      - AttributeName: productId
        KeyType: RANGE
    BillingMode: PAY_PER_REQUEST
    TableName: ${self:provider.environment.PRODUCTS_TABLE}
    LocalSecondaryIndexes:
      - IndexName: ${self:provider.environment.PRODUCTS_CREATED_AT_INDEX}
        KeySchema:
          - AttributeName: userId
            KeyType: HASH
          - AttributeName: createdAt
            KeyType: RANGE
        Projection:
          ProjectionType: ALL
```

To query an index it is used the `query()` method like:

```ts
await this.dynamoDBClient
  .query({
    TableName: 'table-name',
    IndexName: 'index-name',
    KeyConditionExpression: 'paritionKey = :paritionKey',
    ExpressionAttributeValues: {
      ':paritionKey': partitionKeyValue
    }
  })
  .promise()
```

---

## How to run the application

For local testing use: "git clone git@github.com:jorgeatcabo/Floristify.git"

## Deploy the Backend

To deploy the backend application, run the following commands:

```
cd backend
npm update --save
npm audit fix

# For the first time, create an application in your org in Serverless portal
serverless

# Next time, deploy the app and note the endpoint url in the end
serverless deploy --verbose

# If you face a permissions error, you may need to specify the user profile
sls deploy -v --aws-profile serverless

# sls is shorthand for serverless
# -v is shorthand for --verbose
```

## Run the Frontend

Once you've set the parameters in the client/src/config.ts file, run the following commands:

```
cd client
npm update --save
npm audit fix --legacy-peer-deps
npm install --save-dev
npm run start
```

This should start a development server with the React application that will interact with the serverless application.

---

## Mockup images

![Main window](.\assets\image1.jpg)

![Login window](.\assets\login.jpg)

---

## Animations

1. This animation shows how to login to the app, and also how a new option is added to the header menu that allows to show the `products` in the frontend store page.

![Login and products frontend store page](./assets/login.gif)

2. This animation shows how to add a `product`, upload an image and delete a `product`.

![Add product, upload an image and delete a product](./assets/product.gif)

---

## Contributor

Jorge Soto (https://github.com/jorgeatcabo)

---

## Questions

[Contact Me](mailto:san_lucas2005@yahoo.com)

---
