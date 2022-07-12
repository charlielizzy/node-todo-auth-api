const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const { expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');
const port = 3001
const dotenv = require('dotenv');
dotenv.config();
const db = require('./queries')
const cors = require('cors');

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${process.env.AUTH_0_JWK_URI}`
  }),
  audience: `${process.env.AUTH_0_AUDIENCE}`,
  issuer: `${process.env.AUTH_0_ISSUER}`,
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

app.get('/', (request, response) => {
  response.json({ info: 'Hello World' })
})

app.get('/todos', db.getTodos)

app.post('/todos', db.createTodos)

app.post('/users', db.createUser)

app.listen(port, () => {
  console.log(`Todo List API started ${port}.`)
})