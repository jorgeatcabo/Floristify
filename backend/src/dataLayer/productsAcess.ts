import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { ProductItem } from '../models/ProductItem'
import { ProductUpdate } from '../models/ProductUpdate';
const AWSXRay = require('aws-xray-sdk');



const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('ProductsAccess')

// TODO: Implement the dataLayer logic

export class ProductsAccess {
  constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly productsTable = process.env.TODOS_TABLE
  ) {}

  async getProductsForUser(userId: string): Promise<ProductItem[]> {
      logger.info(`Getting products for user ${userId}`);
      const result = await this.docClient.query({
          TableName: this.productsTable,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
          ':userId': userId
          },
          ScanIndexForward: false
      }).promise();

      return result.Items as ProductItem[];
  }

  async createProduct(product: ProductItem): Promise<ProductItem> {
      logger.info(`Creating product with id ${product.productId}`);
      await this.docClient.put({
          TableName: this.productsTable,
          Item: product
      }).promise();

      return product;
  }

  async updateProduct(product: ProductUpdate, productId: string, userId: string): Promise<void>{
      logger.info(`Updating product with id ${productId}`);
      await this.docClient.update({
          TableName: this.productsTable,
          Key: {
              productId,
              userId
          },
          ExpressionAttributeNames: {
              '#product_name': 'name',
          },
          ExpressionAttributeValues: {
              ':name': product.name,
              ':category': product.category,
              ':price': product.price,
              ':description': product.description,
              ':stock': product.stock,
          },
          UpdateExpression: 'SET #product_name = :name, category = :category, price = :price, description = :description, stock = :stock',
          ReturnValues: 'ALL_NEW',
      }).promise();
  } 

  async deleteTodo(todoId: string, userId: string): Promise<void>{
      logger.info(`Deleting todo with id ${todoId}`);
      await this.docClient.delete({
          TableName: this.productsTable,
          Key: {
              todoId,
              userId
          }
      }).promise();
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
      logger.info('Creating DynamoDB client locally');
      return new XAWS.DynamoDB.DocumentClient({
          region: 'localhost',
          endpoint: 'http://localhost:8000'
      })
  }

  return new XAWS.DynamoDB.DocumentClient()
}