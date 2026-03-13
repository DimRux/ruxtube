export const parseBoolean = (value: string) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const loweValue = value.trim().toLowerCase();
    if (loweValue === 'true') {
      return true;
    }
    if (loweValue === 'false') {
      return false;
    }
  }

  throw new Error(`Не удалось преобразовать занчение ${value} в логическое значение`);
};
