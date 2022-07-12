const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const { expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');
const port = 3001
const db = require('./queries')
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${process.env.AUTH_0_ISSUER}/.well-known/jwks.json`
  }),
  audience: `${process.env.AUTH_0_ISSUER}/api/v2/`,
  issuer: `${process.env.AUTH_0_ISSUER}/`,
  algorithms: ['RS256']
});

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


console.log('AUTH_0_ISSUER', process.env.AUTH_0_ISSUER);
app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/todos', db.getTodos)

app.post('/todos', db.createTodos)

app.post('/users', db.createUser)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})