/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateTodoRequest {
  name: string
  category: string
  price: number
  description: string
  stock: number
}