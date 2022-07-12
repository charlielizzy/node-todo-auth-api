const jwt_decode= require("jwt-decode");

const Pool = require('pg').Pool

const pool = new Pool({  
  host: process.env.HEROKU_DB_HOST,
  database: process.env.HEROKU_DB_NAME,  
  port: process.env.HEROKU_DB_PORT,
  user: process.env.HEROKU_DB_USER,
  password: process.env.HEROKU_DB_PASSWORD,  
  ssl: {
    rejectUnauthorized: false,
  },
})

const getTodos = async(request, response) => {
  const { authorization }  = request.headers;
  const decoded = jwt_decode(authorization);
  const user = await pool.query('SELECT * FROM users where auth_0_id = $1', [decoded.sub]);  
  pool.query('SELECT * FROM todos WHERE user_id = $1', [user.rows[0].id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createTodos = async(request, response, next) => {
  try {
    const { authorization } = request.headers;
    const { task } = request.body    
    const decoded = jwt_decode(authorization);
    const user = await pool.query('SELECT * FROM users where auth_0_id = $1', [decoded.sub]);
    const todo = await pool.query('INSERT INTO todos (user_id, is_complete, task) VALUES  ($1, $2, $3)', [user.rows[0].id, false, task])
    response.status(200).json(todo.rows[0]);
  } catch(error) {
    next(error);
  }
}

const createUser = async(request, response) => {
  const { name, email, auth_0_id } = request.body
  pool.query('INSERT INTO users (name, email, auth_0_id) VALUES ($1, $2, $3)', [name, email, auth_0_id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${results.insertId}`)
  })
}

module.exports = {
  getTodos,
  createUser,
  createTodos
}