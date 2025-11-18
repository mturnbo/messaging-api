import dotenv from "dotenv";
import expressService from "./services/express.service.js";

dotenv.config();

/*
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from '#routes/index.routes.js';
import authRouter from '#routes/auth.routes.js';
import usersRouter from '#routes/user.routes.js';
import messagesRouter from '#routes/message.routes.js';

import { notFound } from '#middlewares/notFound.js';
import { handleError } from '#middlewares/handleError.js';

const __dirname = path.resolve();
const app = express();
const port = process.env.PORT || 3000;


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);

app.use(notFound);
app.use(handleError);

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
*/



(async () => {
  try {
    await expressService.init();
    console.log("Server initialized.");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
