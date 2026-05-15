import { departmentsName } from './departments';

export const validateField = (field: string, value: string): boolean => {
  if (
    field === 'names' || field === 'lastNames' ||
    field === 'organizerName' || field === 'organizerCountry' ||
    field === 'city' || field === 'country' ||
    field === 'state'
  ) { return /^([a-zA-ZáéíóúñÑ ']{2,50})$/.test(value) }
  if (field === 'email') { return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) }
  if (field === 'organizerDirection' || field === 'direction') { return /^([a-zA-ZáéíóúñÑ0-9\-\\ #]){5,100}$/.test(value) }
  if (field === 'phone') { return /^\+?\d{6,16}$/.test(value) }
  if (field === 'age') { return /^([0-9]{1,3})$/.test(value) }
  if (field === 'phoneIndicative') { return /^([ 0-9]{6,16})$/.test(value) }
  if (field === 'message') { return /^([a-zA-ZáéíóúñÑ0-9\-\\ '.,:;?¿!¡]{2,255})$/.test(value) }
  if (field === 'department') {
    return departmentsName.includes(value);
  }
  if (field === 'sex') { return value === 'M' || value === 'F' }
  if (field === 'civilState') { return value.length > 0 }
  return false;
};

export const validateInput = (field: string, value: string): boolean => {
  if (
    field === 'names' || field === 'lastNames' ||
    field === 'organizerName' || field === 'organizerCountry' ||
    field === 'city' || field === 'country' ||
    field === 'state'
  ) { return /^([a-zA-ZáéíóúñÑ ']){0,50}$/.test(value) }
  if (field === 'email') { return /^[a-zA-Z0-9._%+-@]{0,}$/.test(value) }
  if (field === 'organizerDirection' || field === 'direction') { return /^([a-zA-ZáéíóúñÑ0-9\-\\ #]){0,100}$/.test(value) }
  if (field === 'phone') { return /^\+?\d{0,16}$/.test(value) }
  if (field === 'age') { return /^([0-9]){0,3}$/.test(value) }
  if (field === 'phoneIndicative') { return /^([ 0-9]){0,16}$/.test(value) }
  if (field === 'message') { return /^([a-zA-Z0-9\-\\ '.,:;?¿!¡]){0,255}$/.test(value) }
  if (field === 'department') { return true }
  if (field === 'sex') { return true }
  if (field === 'civilState') { return true }
  return false;
};