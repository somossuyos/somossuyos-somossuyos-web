import { Media, MediaData, Tematica } from '@/src/entities/types/SharedTypes';
import { BookDTO } from '../Books';
import { HeaderDTO } from '../Shared/HeaderDTO';

export interface ExperienceDTO {
  id:number
  date: Date | string;
  maxRegistrationDate: Date | string;
  sold: boolean;
  time: string;
  registrationEnabled: boolean;
  price: number;
  maxRegistrants: number;
  disableBySex: string
  title: string;
  description: string;
  theme: Tematica;
  type: string;
  status: string;
  donationsEnabled: boolean;
  additional: string;
  terms : string;
  category: string;
  link: string;
  slug: string;
  speakers: SpeakerDto[];
  thumbnail: MediaData<Media>;
  header: HeaderDTO;
  activity: ActivityDto | null;
  mosaic: MediaData<Media>;
  bookResource?: MediaData<BookDTO>;
}

export interface SpeakerDto {
  id: number;
  names: string;
  affiliation: string;
  description: string;
  photo?: MediaData<Media>;
  affiliationPhoto?: MediaData<Media>;
}

export interface ActivityDto {
  id: number;
  title: string;
  quantity: number;
  duration: string;
  subactivities: SubactivityDto[];
}

export interface SubactivityDto {
  id: number;
  name: string | null;
}



