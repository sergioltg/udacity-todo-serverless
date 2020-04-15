import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { updateTodoAttachmentUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.IMAGES_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;

  const userId = getUserId(event);

  console.log('url Expiration', urlExpiration)

  const url = getUploadUrl(todoId)

  const imageUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`

  await updateTodoAttachmentUrl(userId, todoId, imageUrl)

  return {
    statusCode: 201,
    body: JSON.stringify({
      uploadUrl: url
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
  }
}

function getUploadUrl(imageId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: parseInt(urlExpiration)
  })
}

