/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateTodoRequest {
  name: string
  category: string
  price: number
  description: string
  stock: number
}
