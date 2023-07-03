const { Pool } = require('pg');
const express = require('express');


const app = express();
const port = 3001;
app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'drts',
  password: 'Jb@84848',
  port: 5432,
});

// Function to check if the table exists
const checkTableExists = async () => {
  const query = `
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_name = 'users'
    );
  `;

  try {
    const result = await pool.query(query);
    return result.rows[0].exists;
  } catch (error) {
    console.error('Error checking table existence:', error);
    throw error;
  }
};

// Function to create the table
const createTable = async () => {
  const createTableQuery = `
    CREATE TABLE users (
      name VARCHAR(255),
      email VARCHAR(255) PRIMARY KEY,
      phone VARCHAR(255),
      password VARCHAR(255)
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('Table created successfully!');
  } catch (error) {
    console.error('Error creating table:', error);
    throw error;
  }
};

// Register route
app.post('/api/register', async (req, res) => {
  const { name, email, phone, password } = req.body;
  console.log('User registration data:', { name, email, phone, password });

  try {
    const tableExists = await checkTableExists();

    if (!tableExists) {
      await createTable();
    }

    const insertQuery = `
      INSERT INTO users (name, email, phone, password)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [name, email, phone, password];

    const result = await pool.query(insertQuery, values);

    console.log('User registered successfully!');
    res.status(200).json({ message: 'User registered successfully!'});
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error occurred while registering user' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
