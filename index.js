const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;
const dotenv = require("dotenv");
dotenv.config();
const db = require("./queries");
const cors = require("cors");
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://paddington.eu.auth0.com/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer
  audience: "https://paddington.eu.auth0.com/api/v2/", //replace with your API's audience, available at Dashboard > APIs
  issuer: "https://paddington.eu.auth0.com/",
  algorithms: ["RS256"],
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Hello World" });
});

app.get("/todos", checkJwt, db.getTodos);

app.post("/todos", db.createTodos);

app.listen(port, () => {
  console.log(`Todo List API started ${port}.`);
});
