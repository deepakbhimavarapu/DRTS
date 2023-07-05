const pgp = require('pg-promise')();

const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'drts',
  password: 'Jb@84848',
  port: 5432,
};
const db = pgp(dbConfig);

const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    mobile VARCHAR(255) UNIQUE,
    password VARCHAR(255)
  )
`;

const createAccountTableQuery = `
  CREATE TABLE IF NOT EXISTS accounts (
    userid SERIAL REFERENCES users(id),
    account VARCHAR(255) UNIQUE,
    balance REAL
  )
`;

const createTransactionTableQuery = `
  CREATE TABLE IF NOT EXISTS transactions (
    senderid SERIAL REFERENCES users(id),
    receiverid SERIAL REFERENCES users(id),
    amount REAL,
    date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;


const createTablesIfNotExist = async () => {
  try {
    await db.none(createUsersTableQuery);
    await db.none(createAccountTableQuery);
    await db.none(createTransactionTableQuery);
    
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

module.exports = {
  createTablesIfNotExist,
};
