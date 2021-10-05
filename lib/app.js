const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});


// 🍵🍵🍵 Endpoint to retrieve all teas.
app.get('/teas', async(req, res) => {
  try {
    const data = await client.query('SELECT ts.id, ts.tea_name, ts.description, ts.url, tt.tea_type, ts.north_america_native, ts.owner_id FROM teas AS ts INNER JOIN tea_types AS tt ON tt.id = ts.type');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});


// 🍵🆔 Endpoint to retrieve a tea by ID.
app.get('/teas/:id', async(req, res) => {
  try {
    const data = await client.query('SELECT ts.id, ts.tea_name, ts.description, ts.url, tt.tea_type, ts.north_america_native, ts.owner_id FROM teas AS ts INNER JOIN tea_types AS tt ON tt.id = ts.type WHERE ts.id = $1', [req.params.id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});


// ➖🍵tea Endpoint to delete a teas table row by ID.
app.delete('/teas/:id', async(req, res) => {
  try {
    const data = await client.query('DELETE FROM teas WHERE id = $1 RETURNING *', [req.params.id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});


// ☝📅🍵 Endpoint to update a teas table row by ID.
app.put('/teas/:id', async(req, res) => {
  try {
    const data = await client.query('UPDATE teas SET tea_name = $1, type = $2, description = $3, north_america_native = $4, url = $5, owner_id = $6 WHERE id = $7 RETURNING *', [req.body.tea_name, req.body.type, req.body.description, req.body.north_america_native, req.body.url, 1, req.params.id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});


// ➕🍵 Endpoint to create a new teas table row
app.post('/teas', async(req, res) => {
  try {
    const data = await client.query('INSERT INTO teas (tea_name, type, description, north_america_native, url, owner_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [req.body.tea_name, req.body.type, req.body.description, req.body.north_america_native, req.body.url, 1]);
    
    res.json(data.rows[0]);
  } catch(e) {
    // This may need to be updated to the correct code?
    res.status(500).json({ error: e.message });
  }
});

// ➕🍵🩸 Endpoint to create a new tea_types table row
app.post('/tea-types', async(req, res) => {
  try {
    const data = await client.query('INSERT INTO tea_types (tea_type) VALUES ($1) RETURNING *', [req.body.tea_type]);
    
    res.json(data.rows[0]);
  } catch(e) {
    // This may need to be updated to the correct code?
    res.status(500).json({ error: e.message });
  }
});

// 🍵🩸🍵🩸🍵🩸 Endpoint retrieve all tea_types data
app.get('/tea-types', async(req, res) => {
  try {
    const data = await client.query('SELECT * FROM tea_types');
    
    res.json(data.rows);
  } catch(e) {
    // This may need to be updated to the correct code?
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
