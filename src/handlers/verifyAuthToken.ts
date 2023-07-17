import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const verifyAuthToken = (req: Request, res: Response, next: () => void) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1];
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    next();
  } catch (err) {
    res.status(401);
    res.json('Access denied, invalid token.');
    return;
  }
};

export default verifyAuthToken;
