export interface TodoItem {
  userId: string
  todoId: string
  createdAt: string
  name: string
  dueDate: string
  dueDateDay: string
  done: boolean
  attachmentUrl?: string
}
