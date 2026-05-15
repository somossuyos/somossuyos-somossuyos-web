import { PreinscripcionRenacer } from '../../entities/PreinscripcionRenacer';
import { PreinscripcionRenacerData, PreinscripcionRenacerDTO, PreinscripcionRenacersDTO } from '../DTOs/PreinscripcionRenacer/PreinscripcionRenacerDTO';
import { Meta } from '../../entities/types/SharedTypes';

/**
 * Transforms PreinscripcionRenacer entity to PreinscripcionRenacerData for frontend-backend communication
 * @param preinscripcionRenacer - Pure PreinscripcionRenacer entity
 * @returns PreinscripcionRenacerData with API structure
 */
export function mapPreinscripcionRenacerToData(preinscripcionRenacer: PreinscripcionRenacer): PreinscripcionRenacerData {
  return {
    id: preinscripcionRenacer.id,
    attributes: {
      names: preinscripcionRenacer.names,
      phone: preinscripcionRenacer.phone,
      email: preinscripcionRenacer.email,
      age: preinscripcionRenacer.age,
      maritalStatus: preinscripcionRenacer.maritalStatus,
      date: preinscripcionRenacer.date,
      status: preinscripcionRenacer.status,
      createdAt: preinscripcionRenacer.createdAt,
      updatedAt: preinscripcionRenacer.updatedAt,
      publishedAt: preinscripcionRenacer.publishedAt,
    }
  };
}

/**
 * Transforms PreinscripcionRenacer entity to PreinscripcionRenacerDTO for frontend-backend communication
 * @param preinscripcionRenacer - Pure PreinscripcionRenacer entity
 * @param meta - Meta information
 * @returns PreinscripcionRenacerDTO with API structure
 */
export function mapPreinscripcionRenacerToDTO(preinscripcionRenacer: PreinscripcionRenacer, meta: Meta): PreinscripcionRenacerDTO {
  return {
    data: mapPreinscripcionRenacerToData(preinscripcionRenacer),
    meta
  };
}

/**
 * Transforms array of PreinscripcionRenacer entities to PreinscripcionRenacersDTO for frontend-backend communication
 * @param preinscripcionRenacers - Array of pure PreinscripcionRenacer entities
 * @param meta - Meta information
 * @returns PreinscripcionRenacersDTO with API structure
 */
export function mapPreinscripcionRenacersToDTO(preinscripcionRenacers: PreinscripcionRenacer[], meta: Meta): PreinscripcionRenacersDTO {
  return {
    data: preinscripcionRenacers.map(mapPreinscripcionRenacerToData),
    meta
  };
}