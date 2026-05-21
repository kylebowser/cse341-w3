const swaggerAutogen = require('swagger-autogen')();
const doc = {
  info: {
    title: 'Contacts API',
    description: 'A simple API to manage contacts',
  },
  host: 'cse341-ww.onrender.com',
  schemes: ['https'],
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);