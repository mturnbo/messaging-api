import express from 'express';
import fs from 'fs';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import { notFound } from '#middlewares/notFound.js';
import { handleError } from '#middlewares/handleError.js';

const __dirname = path.resolve();
console.log(__dirname);

const routeFiles = fs
  .readdirSync(`${__dirname}/src/routes/`)
  .filter((file) => file.endsWith('routes.js'));

let server;
let routes = [];

const expressService = {
  init: async () => {
    try {
      // Load routes automatically
      for (const file of routeFiles) {
        const route = await import(`${__dirname}/src/routes/${file}`);
        const routeName = Object.keys(route)[0];
        routes.push(route[routeName]);
      }

      // config server
      server = express();
      server.use(logger('dev'));
      server.use(express.json());
      server.use(express.urlencoded({ extended: false }));
      server.use(cookieParser());
      server.use(express.static(path.join(__dirname, 'public')));

      // add routes
      server.use(routes);

      // error handling middleware
      server.use(notFound);
      server.use(handleError);

      // start server
      server.listen(process.env.SERVER_PORT || 3000);
      console.log("[EXPRESS] Express initialized");
    } catch (error) {
      console.log("[EXPRESS] Error during express service initialization");
      throw error;
    }
  },
};

export default expressService;
