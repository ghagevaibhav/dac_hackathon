import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import userRouter from '../routes/userRouter.js';
import middleware from '../middleware/middleware.js';
import movieRouter from '../routes/movieRouter.js';
import reviewRouter from '../routes/reviewRouter.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(middleware);

app.use("/users", userRouter);
app.use("/movies", movieRouter);
app.use('/reviews', reviewRouter);

app.listen(port, () => {        
        console.log(`Server Started on Port ${port}`);
 });