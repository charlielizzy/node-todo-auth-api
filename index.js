const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const { expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');
const port = 3001
const db = require('./queries')
const cors = require('cors');

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://paddington.eu.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://paddington.eu.auth0.com/api/v2/',
  issuer: 'https://paddington.eu.auth0.com/',
  algorithms: ['RS256']
});

const fetchUser = (console.log())

app.use(jwtCheck);
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
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/todos', db.getTodos)

app.post('/todos', db.createTodos)

app.post('/users', db.createUser)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})