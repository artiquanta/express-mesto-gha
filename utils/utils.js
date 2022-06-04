// Коды ошибок
const DEFAULT_ERROR_CODE = 500;
const WRONG_DATA_CODE = 400;
const NOT_FOUND_CODE = 404;

// Класс ошибки 404
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

module.exports = {
  DEFAULT_ERROR_CODE, WRONG_DATA_CODE, NOT_FOUND_CODE, NotFoundError,
};
