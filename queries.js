const Pool = require("pg").Pool;
const jwt_decode = require("jwt-decode");

const pool = new Pool({
  host: process.env.HEROKU_DB_HOST,
  database: process.env.HEROKU_DB_NAME,
  port: process.env.HEROKU_DB_PORT,
  user: process.env.HEROKU_DB_USER,
  password: process.env.HEROKU_DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

const getTodos = async (request, response) => {
  const { authorization } = request.headers;
  const decoded = jwt_decode(authorization);
  const { sub } = decoded;
  const userResults = await pool.query(
    "SELECT id FROM users WHERE auth_0_id = $1",
    [sub]
  );
  const { id: userid } = userResults.rows[0];

  const todoResults = await pool.query(
    "SELECT * FROM todos WHERE user_id = $1",
    [userid]
  );
  response.status(200).json(todoResults.rows);
};

const createTodos = async (request, response, next) => {
  try {
    const { task, user_id } = request.body;
    const todo = await pool.query(
      "INSERT INTO todos (user_id, is_complete, task) VALUES  ($1, $2, $3)",
      [user_id, false, task]
    );
    response.status(200).json(todo.rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTodos,
  createTodos,
};
