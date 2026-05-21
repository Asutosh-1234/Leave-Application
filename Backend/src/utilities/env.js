class ENV {
  static MYSQL_DB_URL = ENV.#require('DATABASE_URL');
  static PORT = process.env.PORT || 8000;
  static ACCESS_TOKEN_SECRET = ENV.#require('ACCESS_TOKEN_SECRET');
  static ACCESS_TOKEN_EXPIRY = ENV.#require('ACCESS_TOKEN_EXPIRY');
  static REFRESH_TOKEN_SECRET = ENV.#require('REFRESH_TOKEN_SECRET');
  static REFRESH_TOKEN_EXPIRY = ENV.#require('REFRESH_TOKEN_EXPIRY');

  static #require(key) {
    const value = process.env[key];
    if (!value) throw new Error(`Missing required environment variable: ${key}`);
    return value;
  }
}

export default ENV;
