import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { ConnectionItem } from '../models/ConnectionItem'

const XAWS = AWSXRay.captureAWS(AWS)

export class ConnectionsAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly connectionTable = process.env.CONNECTIONS_TABLE,
    private readonly index_userId: string = process.env.CONNECTIONS_USER_ID_INDEX) {
  }

  async getConnectionsForUserId(userId: string): Promise<ConnectionItem[]> {
    console.log('Getting all connections for userId', userId)

    const result = await this.docClient.query({
      TableName: this.connectionTable,
      IndexName: this.index_userId,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    const items = result.Items;
    return items as ConnectionItem[];
  }

  async createConnection(connectionItem: ConnectionItem): Promise<ConnectionItem> {
    await this.docClient.put({
      TableName: this.connectionTable,
      Item: connectionItem
    }).promise()

    return connectionItem
  }

  async deleteConnection(id: string): Promise<void> {
    await this.docClient.delete({
      TableName: this.connectionTable,
      Key: {
        id: id
      }
    }).promise()
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    // @ts-ignore
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  // @ts-ignore
  return new XAWS.DynamoDB.DocumentClient();
}
