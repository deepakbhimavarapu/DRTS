const { Pool } = require('pg');
const express = require('express');
const session = require('express-session');
const { createTablesIfNotExist } = require('./database');




const app = express();
const port = 3001;
app.use(express.json());

app.use(session({
  secret: 'helloworld!',
  resave: false,
  saveUninitialized: true
}));


// PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'drts',
  password: 'Jb@84848',
  port: 5432,
});


// Register route
app.post('/api/register', async (req, res) => {
  const { name, email, phone, account, password } = req.body;
  
    const insertQuery = `
      INSERT INTO users (name, email, mobile, password)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [name, email, phone, password];

    const result = await pool.query(insertQuery, values);


    const insertQuery1 = `
      INSERT INTO accounts (userid, account, balance)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const values1 = [result['rows'][0]['id'], account, 1000.0];

    const result1 = await pool.query(insertQuery1, values1);

    res.status(200).json({ message: 'User registered successfully!'});
  
});


app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Check if the email and password combination exists in the users table
  const query = {
    text: 'SELECT * FROM users WHERE email = $1 AND password = $2',
    values: [email, password],
  };

 
  pool
    .query(query)
    .then((result) => {
      const isLoggedIn = result.rows.length > 0;
      const id = result['rows'][0]['id'];
      const query1 = {
        text: 'SELECT * FROM accounts WHERE userid = $1',
        values: [id],
      }

      const query2 = {
        text: 'SELECT * FROM transactions WHERE senderid = $1',
        values: [id],
      }

      Promise.all([
        pool.query(query1),
        pool.query(query2)
      ])
        .then((results) => {
          // Extract the results of the first query
          const result1 = results[0];
          req.session.email = req.body.email;
          

          // Extract the results of the second query
          const result2 = results[1];
          console.log(result2['rows'])
          res.json({ message: isLoggedIn, email: result1['rows'][0]['email'], balance: result1['rows'][0]['balance'], transactions: result2});
        })
        .catch((error) => {
          // Handle any errors that may occur during the queries
          console.error(error);
        });

      

      
      
    })
    .catch((error) => {
      console.error('Error querying users table:', error);
      // Send an error response back to the frontend
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.post('/api/logout', (req, res) => {
  // Destroy the session and log out the user
  req.session.destroy();
  console.log("Logging Out")
  res.json({ message: true });
});


app.post('/api/transfer', (req, res) => {
  const { email, account, amount } = req.body;
  console.log(email,account,amount)

  // Step 1: Check the id from users table using the given email
  pool.query(
    'SELECT id FROM users WHERE email = $1',
    [email],
    (err, result) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      // Check if the email exists in the users table
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Email not found' });
      }

      const senderID = result.rows[0].id;

      // Step 2: Check the balance from accounts table using the senderID
      pool.query(
        'SELECT balance FROM accounts WHERE userid = $1',
        [senderID],
        (err, result) => {
          if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ message: 'Internal server error' });
          }

          // Check if the account exists and has sufficient balance
          if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Account not found' });
          }

          const balance = result.rows[0].balance;

          // Step 3: Transfer the amount if the balance is sufficient
          if (balance >= amount) {
            // Step 3a: Retrieve the receiverID from accounts table using the provided account number
            pool.query(
              'SELECT userid FROM accounts WHERE account = $1',
              [account],
              (err, result) => {
                if (err) {
                  console.error('Error executing SQL query:', err);
                  return res.status(500).json({ message: 'Internal server error' });
                }

                // Check if the account exists
                if (result.rows.length === 0) {
                  return res.status(404).json({ message: 'Receiver account not found' });
                }

                const receiverID = result.rows[0].userid;

                // Step 3b: Update the balance of the senderID
                pool.query(
                  'UPDATE accounts SET balance = balance - $1 WHERE userid = $2',
                  [amount, senderID],
                  (err) => {
                    if (err) {
                      console.error('Error executing SQL query:', err);
                      return res.status(500).json({ message: 'Internal server error' });
                    }

                    // Step 3c: Update the balance of the receiverID
                    pool.query(
                      'UPDATE accounts SET balance = balance + $1 WHERE userid = $2',
                      [amount, receiverID],
                      (err) => {
                        if (err) {
                          console.error('Error executing SQL query:', err);
                          return res.status(500).json({ message: 'Internal server error' });
                        }

                        // Step 3d: Insert a new record into the transactions table
                        pool.query(
                          'INSERT INTO transactions (senderid, receiverid, amount) VALUES ($1, $2, $3)',
                          [senderID, receiverID, amount],
                          (err) => {
                            if (err) {
                              console.error('Error executing SQL query:', err);
                              return res.status(500).json({ message: 'Internal server error' });
                            }

                        const query1 = {
                          text: 'SELECT balance FROM accounts WHERE userid = $1',
                          values: [senderID],
                        }

                        const query2 = {
                          text: 'SELECT * FROM transactions WHERE senderid = $1',
                          values: [senderID],
                        }

                        Promise.all([
                          pool.query(query1),
                          pool.query(query2)
                        ])
                          .then((results) => {
                            // Extract the results of the first query
                            const result1 = results[0];
                            

                            // Extract the results of the second query
                            const result2 = results[1];
                            console.log(result2['rows'])
                            res.json({ message: 'Transaction successful', balance: result1['rows'][0]['balance'], transactions: result2});
                          })
                          .catch((error) => {
                            // Handle any errors that may occur during the queries
                            console.error(error);
                          });

                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          } else {
            // Step 4: Return the insufficient balance message to the frontend
            return res.status(400).json({ message: 'Insufficient balance' });
          }
        }
      );
    }
  );
});


// Start the server
createTablesIfNotExist()
  .then(() => {
    app.listen(3001, () => {
      console.log('Server is running on port 3001');
    });
  })
  .catch((error) => {
    console.error('Error starting the server:', error);
  });


