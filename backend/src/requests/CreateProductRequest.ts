/**
 * Fields in a request to create a single product item.
 */
export interface CreateProductRequest {
  name: string
  category: string
  price: number
  description: string
  stock: number
}
