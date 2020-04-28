# Udacity ToDos Serverless capstone project

## Project Components
- Restful API (Lambda Functions, API Gateway and DynamoDb)
- WebSocket Connection to notify connected user that a toDo task is due. This is done through a scheduled lambda that process all toDos that are due in the day and send a websocket message to each user containing its toDos items
- Client (React)

## How to run the application
### Deploy Backend
To deploy an application run the following commands:

```bash
cd backend
npm install
sls deploy -v
````
### Frontend
```bash
cd client
npm install
npm run start
```

## Current Deplyment details
API Endpoint
```
https://2z9sdic1hj.execute-api.us-east-1.amazonaws.com/dev/todos
```
Postman Collection
```
Udacity Cloud developer capstone.postman_collection.json
```