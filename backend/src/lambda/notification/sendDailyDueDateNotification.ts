import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { getTodosByDueDate } from '../../businessLogic/todos'
import { getConnectionsForUserId } from '../../businessLogic/connections'

const stage = process.env.STAGE
const apiId = process.env.API_ID

const connectionParams = {
  apiVersion: '2018-11-29',
  endpoint: `${apiId}.execute-api.ap-southeast-2.amazonaws.com/${stage}`
}

// @ts-ignore
const apiGateway = new AWS.ApiGatewayManagementApi(connectionParams)

export const handler = async (event: any) => {

  console.log('send daily ran', event)

  const items = await getTodosByDueDate(new Date().toISOString())

  console.log(items)

  for (const item of items) {
    const connections = await getConnectionsForUserId(item.userId)
    console.log(connections)
    for (const connection of connections) {
      await apiGateway.postToConnection({
        ConnectionId: connection.id,
        Data: JSON.stringify(item)
      }).promise()
    }
  }
}
