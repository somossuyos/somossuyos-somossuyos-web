import { countries } from './countries';

/** Lista ordenada de paises (reutiliza el dataset del checkout). */
export const countryNames = Object.keys(countries).sort((a, b) => a.localeCompare(b, 'es'));