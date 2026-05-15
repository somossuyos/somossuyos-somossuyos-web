import { Meta, Pagination } from '../../../entities/types/SharedTypes';


export type ProductCategoryData = {
  id: number;
  attributes: {
    name: string;
    shippingCost: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
};

export interface ProductCategoryDTO {
  data: ProductCategoryData;
  meta: Meta;
}

export interface ProductCategoriesDTO {
  data: ProductCategoryData[];
  meta: Meta;
}

export type { Meta, Pagination };