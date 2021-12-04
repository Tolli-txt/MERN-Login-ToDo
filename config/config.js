// MongoDB config, app does not work if 'db_dev' is not set.
module.exports = {
  db: 'mongodb://username:password@url:port/db',
  db_dev: 'mongodb://localhost:27017/MERN-app',
};