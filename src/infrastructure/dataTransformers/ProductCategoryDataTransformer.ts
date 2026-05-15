import { ProductCategory } from '../../entities/ProductCategory';
import { ProductCategoryData, ProductCategoryDTO, ProductCategoriesDTO } from '../DTOs/ProductCategory/ProductCategoryDTO';
import { Meta } from '../../entities/types/SharedTypes';

/**
 * Transforms ProductCategory entity to ProductCategoryData for frontend-backend communication
 * @param productCategory - Pure ProductCategory entity
 * @returns ProductCategoryData with API structure
 */
export function mapProductCategoryToData(productCategory: ProductCategory): ProductCategoryData {
  return {
    id: productCategory.id,
    attributes: {
      name: productCategory.name,
      shippingCost: productCategory.shippingCost,
      createdAt: productCategory.createdAt,
      updatedAt: productCategory.updatedAt,
      publishedAt: productCategory.publishedAt,
    }
  };
}

/**
 * Transforms ProductCategory entity to ProductCategoryDTO for frontend-backend communication
 * @param productCategory - Pure ProductCategory entity
 * @param meta - Meta information
 * @returns ProductCategoryDTO with API structure
 */
export function mapProductCategoryToDTO(productCategory: ProductCategory, meta: Meta): ProductCategoryDTO {
  return {
    data: mapProductCategoryToData(productCategory),
    meta
  };
}

/**
 * Transforms array of ProductCategory entities to ProductCategoriesDTO for frontend-backend communication
 * @param productCategories - Array of pure ProductCategory entities
 * @param meta - Meta information
 * @returns ProductCategoriesDTO with API structure
 */
export function mapProductCategoriesToDTO(productCategories: ProductCategory[], meta: Meta): ProductCategoriesDTO {
  return {
    data: productCategories.map(mapProductCategoryToData),
    meta
  };
}