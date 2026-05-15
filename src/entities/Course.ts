import { Media, MediaData, ResponseData } from './types/SharedTypes';

export interface Course {
  slug: string;
  Titulo: string;
  createdAt: string;
  Precio: number;
  Miniatura: MediaData<Media>;
}

export type CourseResponse = ResponseData<Course>;
export type CoursesResponse = ResponseData<Course>;