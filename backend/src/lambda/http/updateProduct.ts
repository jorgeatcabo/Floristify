import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateProduct } from '../../businessLogic/products'
import { UpdateProductRequest } from '../../requests/UpdateProductRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const productId = event.pathParameters.productId
    const userId = getUserId(event);
    const updatedProduct: UpdateProductRequest = JSON.parse(event.body)
    await updateProduct(updatedProduct, productId, userId);

    return {
      statusCode: 200,
      body: ''
    };
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )