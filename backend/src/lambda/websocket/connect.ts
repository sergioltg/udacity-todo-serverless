import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { getUserId } from '../utils'
import { createConnection } from '../../businessLogic/connections'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const connectionId = event.requestContext.connectionId

  console.log(event);

  const userId: string = getUserId(event)

  const item = {
    id: connectionId,
    userId: userId
  }

  console.log('Storing item: ', item)

  await createConnection({ id: connectionId, userId: userId })

  return {
    statusCode: 200,
    body: ''
  }
}
