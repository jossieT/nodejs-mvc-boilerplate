const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    title: 'NodeJs - Express boiler-plate',
    description: 'API endpoints NodeJs - Express - MongoDB temlate',
    contact: {
      name: 'Yosef Teshome',
      email: 'joseteshe2017@gmail.com',
    },
    version: '1.0.0',
    servers: [
      {
        url: 'http://localhost:3000/',
        description: 'Local server',
      },
      // {
      //   url: "https://walia-jobs-server.onrender.com",
      //   description: "Live server"
      // },
    ],
  },
  // looks for configuration in specified directories
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(options);
const swaggerDocs = (app, port) => {
  // Swagger Page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Documentation in JSON format
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
};

module.exports = { swaggerDocs };
