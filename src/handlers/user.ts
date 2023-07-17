import express, { Request, Response } from 'express';
import { UserStore, UserAuth, User } from '../models/user';
import jwt from 'jsonwebtoken';
import verifyAuthToken from './verifyAuthToken';

const store = new UserStore();

const authenticate = async (req: Request, res: Response) => {
  try {
    const user: UserAuth = {
      username: req.body.username,
      password: req.body.password,
    };
    const userCredential = await store.authenticate(
      user.username,
      user.password,
    );
    // @ts-ignore
    // eslint-disable-next-line no-var
    var token = jwt.sign({ user: userCredential }, process.env.TOKEN_SECRET);
    res.json(token);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const index = async (_req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const user = await store.show(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  const user: User = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    password: req.body.password,
  };
  try {
    const newUser = await store.create(user);
    // @ts-ignore
    // eslint-disable-next-line no-var
    var token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET);
    res.json(token);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const userRoutes = (app: express.Application) => {
  app.post('/users/login', authenticate);
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:id', verifyAuthToken, show);
  app.post('/users', create);
};

export default userRoutes;
