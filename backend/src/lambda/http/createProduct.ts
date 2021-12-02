import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateProductRequest } from '../../requests/CreateProductRequest'
import { getUserId } from '../utils';
import { createProduct } from '../../businessLogic/products'


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const productRequest: CreateProductRequest = JSON.parse(event.body);
    const userId = getUserId(event);
    const newProduct = await createProduct(productRequest, userId);

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newProduct
      })
    }
  });

handler.use(
  cors({
    credentials: true
  })
)
