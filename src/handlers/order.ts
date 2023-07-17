import express, { Request, Response } from 'express';
import { OrderStore, OrderType } from '../models/order';
import verifyAuthToken from './verifyAuthToken';

const store = new OrderStore();

const create = async (req: Request, res: Response) => {
  try {
    const order: OrderType = {
      user_id: req.body.user_id,
      product_id: req.body.product_id,
      quantity: req.body.quantity,
      status: req.body.status,
    };
    const newOrder = await store.create(order);
    res.json(newOrder);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const currentOrderByUser = async (req: Request, res: Response) => {
  try {
    const orders = await store.currentOrderByUser(req.params.user_id);
    res.json(orders);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const completedOrdersByUser = async (req: Request, res: Response) => {
  try {
    const orders = await store.completedOrdersByUser(req.params.user_id);
    res.json(orders);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const orderRoutes = (app: express.Application) => {
  app.post('/orders', verifyAuthToken, create);
  app.get('/orders/:user_id', verifyAuthToken, currentOrderByUser);
  app.get(
    '/orders/completedOrdersByUser/:user_id',
    verifyAuthToken,
    completedOrdersByUser,
  );
};

export default orderRoutes;
