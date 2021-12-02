import { ProductsAccess } from '../dataLayer/productsAcess'
import { getAttachmentUrl } from '../fileStorage/attachmentUtils'
import { ProductItem } from '../models/ProductItem'
import { CreateProductRequest } from '../requests/CreateProductRequest'
import { UpdateProductRequest } from '../requests/UpdateProductRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const productsAccess = new ProductsAccess();
const logger = createLogger('Products')

export async function getProductsForUser(userId: string): Promise<ProductItem[]> {
    logger.info(`getProductsForUser ${userId} start...`);
    return productsAccess.getProductsForUser(userId);
}

export async function createProduct(createProductRequest: CreateProductRequest, userId: string): Promise<TodoItem> {
    logger.info('createProduct start...');
    const productId = uuid.v4();
    const url = getAttachmentUrl(productId);

    return productsAccess.createProduct({
        productId,
        userId,
        name: createProductRequest.name,
        createdAt: new Date().toISOString(),
        attachmentUrl: `${url}.jpg`,
        category: createProductRequest.category,
        price: createProductRequest.price,
        description: createProductRequest.description,
        stock: createProductRequest.stock,
    });
}

export async function updateProduct(updateProductRequest: UpdateProductRequest, productId: string, userId: string): Promise<void> {
    logger.info('updateProduct start...');
    return productsAccess.updateProduct(
        {
            name: updateProductRequest.name,
            category: updateProductRequest.category,
            price: updateProductRequest.price,
            description: updateProductRequest.description,
            stock: updateProductRequest.stock
        },
        productId,
        userId
    );
}

export async function deleteProduct(productId: string, userId: string): Promise<void> {
    logger.info('deleteProduct start...');
    return productsAccess.deleteTodo(productId, userId);
}