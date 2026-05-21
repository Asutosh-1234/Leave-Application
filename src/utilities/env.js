class ENV {
  static MYSQL_DB_URL = process.env.MYSQL_DB_URL;
  static PORT = process.env.PORT || 8000;
}

export default ENV;