const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3001
const dotenv = require('dotenv');
dotenv.config();
const db = require('./queries')
const cors = require('cors');

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors({
  origin: '*'
}));

app.get('/', (request, response) => {
  response.json({ info: 'Hello World' })
})

app.get('/users/:id/todos', db.getTodos)

app.post('/todos', db.createTodos)

app.listen(port, () => {
  console.log(`Todo List API started ${port}.`)
})