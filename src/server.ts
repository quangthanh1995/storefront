import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import productRoutes from './handlers/product';
import userRoutes from './handlers/user';
import orderRoutes from './handlers/order';

const app: express.Application = express();
const address: string = '0.0.0.0:3000';

export const corsOptions = {
  origin: 'http://someotherdomain.com',
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.get('/', function (_req: Request, res: Response) {
  res.send('Hello World!');
});

app.get('/test-cors', cors(corsOptions), function (_req, res, next) {
  res.json({ msg: 'This is CORS-enabled with a middleware.' });
  next();
});

productRoutes(app);
userRoutes(app);
orderRoutes(app);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});

export default app;
