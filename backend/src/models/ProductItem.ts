export interface ProductItem {
  userId: string
  productId: string
  createdAt: string
  name: string
  category: string
  price: number
  attachmentUrl?: string
  description: string
  stock: number
}
