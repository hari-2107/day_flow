const { Sequelize } = require('sequelize');
const path = require('path');

let sequelize;

if (process.env.DATABASE_URL || process.env.DB_URI) {
  sequelize = new Sequelize(process.env.DATABASE_URL || process.env.DB_URI, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false
    }
  });
} else {
  // Fallback to SQLite database file
  const dbPath = path.join(__dirname, '..', 'dayflow.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false
  });
}

module.exports = sequelize;
