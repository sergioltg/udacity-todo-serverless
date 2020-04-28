import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const XAWS = AWSXRay.captureAWS(AWS)

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly index_userId: string = process.env.TODO_USER_ID_INDEX,
    private readonly index_dueDate: string = process.env.TODO_DUE_DATE_INDEX) {
  }

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    console.log('Getting all groups')

    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.index_userId,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise();

    const items = result.Items;
    return items as TodoItem[];
  }

  async getTodosByDueDate(date: string): Promise<TodoItem[]> {
    console.log('Getting all groups')

    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.index_dueDate,
      KeyConditionExpression: 'dueDateDay = :date',
      ExpressionAttributeValues: {
        ':date': date.substring(0, 10)
      }
    }).promise()

    const items = result.Items;
    return items as TodoItem[];
  }

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()

    return todoItem
  }

  async deleteTodo(userId: string, todoId: string): Promise<void> {
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        todoId: todoId
      },
      ConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise();
  }

  async updateTodo(userId: String, todoId: string, updateTodoRequest: UpdateTodoRequest): Promise<void> {
    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        todoId: todoId
      },
      UpdateExpression: "set #name = :name, done = :done, dueDate = :dueDate",
      ConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ':name': updateTodoRequest.name,
        ':done': updateTodoRequest.done,
        ':dueDate': updateTodoRequest.dueDate,
        ':userId': userId
      },
      ExpressionAttributeNames: {
        "#name": "name"
      }
    }).promise();
  }

  async updateTodoAttachmentUrl(userId: String, todoId: string, attachmentUrl: string): Promise<void> {
    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        todoId: todoId
      },
      UpdateExpression: "set attachmentUrl = :attachmentUrl",
      ConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl,
        ':userId': userId
      }
    }).promise();
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
