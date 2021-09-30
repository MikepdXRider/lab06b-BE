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

// 👨‍👩‍👦‍👦 Endpoint to retrieve all teas.
app.get('/teas', async(req, res) => {
  try {
    const data = await client.query('SELECT * FROM teas');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

// 🆔 Endpoint to retrieve a tea by ID.
app.get('/teas/:id', async(req, res) => {
  try {
    const data = await client.query('SELECT * FROM teas WHERE id = $1', [req.params.id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});
// 🆔 Endpoint to retrieve a tea by ID.
app.get('/teas/:id', async(req, res) => {
  try {
    const data = await client.query('SELECT * FROM teas WHERE id = $1', [req.params.id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

// ➕ Endpoint to create a new tea
app.post('/teas', async(req, res) => {
  try {
    const data = await client.query('INSERT INTO teas (tea_name, type, description, north_america_native, url, owner_id) VALUES ($1, $2, $3, $4, $5, $6)', [req.body.tea_name, req.body.type, req.body.description, req.body.north_america_native, req.body.url, 1]);
    
    res.json(data.rows[0]);
  } catch(e) {
    // This may need to be updated to the correct code?
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
