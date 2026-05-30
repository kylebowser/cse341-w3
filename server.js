const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const mongodb = require('./dataBase/connect');
//const professionalRoutes = require('./routes/professional');
const base = require('./routes/index');
const swaggerFile = require('./swagger_output.json');
const swaggerUi = require('swagger-ui-express');


const port = process.env.PORT || 3000;
const app = express();

app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
 // .use('/', base);

process.on('uncaughtException', (err, origin) => {
    console.log(process.stderr.fd, `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
  });

mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.use('/', base);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});

//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));