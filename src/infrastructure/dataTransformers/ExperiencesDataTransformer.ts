import { ExperienceResponse } from '@/src/entities/Experience';
import { experienceDataTransform } from './ExperienceDataTransformer';
import { ExperienceDTO } from '../DTOs/Experiences';

export function experiencesDataTransform(rawData: ExperienceResponse): ExperienceDTO[] | null {
  if (rawData) {
    const experienceData = rawData.data
      .map((exp) => {
        const transformed = experienceDataTransform({ ...exp.attributes, id: exp.id });
        return transformed;
      })
      .filter((exp): exp is ExperienceDTO => exp !== null);
    return experienceData.length > 0 ? experienceData : null;
  }
  return null;
}
