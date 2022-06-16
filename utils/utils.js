// Коды ошибок
const secretKey = '49cda95b4d08b5f16231dafbc114953d1495ba5479a14c617055db74ab4a5c6d';
const urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z.]{2,30}\.?)(\/[-_~:/?#[\]@!$&'()*+,;=\w.]*)?\/?$/i;
const celebrateErrors = {
  'string.base': '{#label} не соответствуют требуемому типу данных',
  'string.empty': '{#label} не может быть пустым',
  'string.min': '{#label} должен иметь минимальную длину - {#limit}',
  'string.max': '{#label} должен иметь максимальную длину - {#limit}',
  'string.email': 'Указан некорректный формат email',
  'string.pattern.base': '{#label} имеет некорректный формат данных. Проверьте данные и повторите запрос!',
  'any.required': '{#label} обязательно!',
};

module.exports = { secretKey, urlPattern, celebrateErrors };
