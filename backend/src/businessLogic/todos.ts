import * as uuid from 'uuid'

import { TodosAccess } from '../dataLayer/todosAccess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todosAccess = new TodosAccess()

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
  return todosAccess.getAllTodos(userId)
}

export async function getTodosByDueDate(date: string): Promise<TodoItem[]> {
  return todosAccess.getTodosByDueDate(date)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {

  const itemId = uuid.v4()

  return await todosAccess.createTodo({
    todoId: itemId,
    userId: userId,
    name: createTodoRequest.name,
    createdAt: new Date().toISOString(),
    done: false,
    dueDate: createTodoRequest.dueDate,
    dueDateDay: createTodoRequest.dueDate.substring(0, 10)
  })
}

export async function deleteTodo(userId: string, todoId: string): Promise<void> {
  await todosAccess.deleteTodo(userId, todoId);
}

export async function updateTodo(userId: string, todoId: string, updateTodoRequest: UpdateTodoRequest): Promise<void> {
  await todosAccess.updateTodo(userId, todoId, updateTodoRequest);
}

export async function updateTodoAttachmentUrl(userId: string, todoId: string, attachmentUrl: string): Promise<void> {
  await todosAccess.updateTodoAttachmentUrl(userId, todoId, attachmentUrl);
}
