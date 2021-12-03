/**
 * Fields in a request to update a single product item.
 */
 export interface UpdateProductRequest {
  name: string
  category: string
  price: number
  description: string
  stock: number
}