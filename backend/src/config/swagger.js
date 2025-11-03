import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Amazon Product Dashboard API',
      version: '1.0.0',
      description: 'API documentation for Amazon product scraper and dashboard',
    },
    servers: [
      {
        url: 'http://localhost:5000', // 🧑‍💻 Local development
        description: 'Local server',
      },
      {
        url: 'https://amazon-dashboard-hs0b.onrender.com', 
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            price: { type: 'number' },
            currency: { type: 'string' },
            rating: { type: 'number' },
            reviewsCount: { type: 'integer' },
            imageUrl: { type: 'string' },
            productUrl: { type: 'string' },
            category: { type: 'string' },
            scrapedAt: { type: 'string', format: 'date-time' },
            priceHistory: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  price: { type: 'number' },
                  date: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, '../routes/*.js')]  
};

const specs = swaggerJsDoc(options);

export const swaggerDocs = (app) => {
  app.use('/api', swaggerUi.serve, swaggerUi.setup(specs)); 
};
