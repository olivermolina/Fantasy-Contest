module.exports = () => {
  require('dotenv').config();
  process.env.TZ = 'UTC';
  process.env.NODE_ENV = 'development';
};
