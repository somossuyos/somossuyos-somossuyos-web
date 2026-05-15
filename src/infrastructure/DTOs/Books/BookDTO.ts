import { Media, MediaData } from '@/src/entities/types/SharedTypes';

export interface BookDTO {
  id?: number | null;
  url?: string | null;
  name?: string | null;
  author?: string | null;
  description?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  publishedAt?: Date | null;
  price?: number | null;
  link?: string | null;
  onSale?: boolean | null;
  thumbnail?: MediaData<Media> | null;
  paypalLink?: string | null;
}
