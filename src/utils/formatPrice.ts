export const formatPrice = (value: number, locale = 'es-CO', currency = 'COP') => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(value);
};