import client from '../database';

export type Order = {
  id?: number;
  user_id: number;
  status: string;
  orderProducts: Array<OrderProduct>;
};

export type OrderProduct = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
};

export type OrderType = {
  user_id: string;
  status: string;
  product_id: number;
  quantity: number;
};

export class OrderStore {
  async create(o: OrderType): Promise<Order> {
    try {
      const sqlOrder =
        'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *';
      const sqlOrderProduct =
        'INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *';
      const conn = await client.connect();
      const resultOrder = await conn.query(sqlOrder, [o.user_id, o.status]);
      const order = resultOrder.rows[0];
      const resultOrderProduct = await conn.query(sqlOrderProduct, [
        order.id,
        o.product_id,
        o.quantity,
      ]);
      const orderProduct = resultOrderProduct.rows[0];
      order.orderProducts = orderProduct;
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Cannot create new order. ${err}`);
    }
  }

  async currentOrderByUser(user_id: string): Promise<Order[]> {
    try {
      const sqlOrder = 'SELECT * FROM orders WHERE user_id = ($1)';
      const sqlOrderProduct =
        'SELECT * FROM order_products op LEFT JOIN products p ON op.product_id = p.id WHERE op.order_id = ($1)';
      const conn = await client.connect();
      const result = await conn.query(sqlOrder, [user_id]);
      conn.release();
      const orders = result.rows;
      const orderResult = await Promise.all(
        orders.map(async (order: Order) => {
          const resultOrderProduct = await conn.query(sqlOrderProduct, [
            order.id,
          ]);
          const products = resultOrderProduct.rows;
          order.orderProducts = products;
          return order;
        }),
      );
      return orderResult;
    } catch (err) {
      throw new Error(
        `Cannot find any order of the user with id ${user_id}. ${err}`,
      );
    }
  }

  async completedOrdersByUser(user_id: string): Promise<Order[]> {
    try {
      const sqlOrder =
        "SELECT * FROM orders WHERE user_id = ($1) AND status = 'complete'";
      const sqlOrderProduct =
        'SELECT * FROM order_products op LEFT JOIN products p ON op.product_id = p.id WHERE op.order_id = ($1)';
      const conn = await client.connect();
      const result = await conn.query(sqlOrder, [user_id]);
      conn.release();
      const orders = result.rows;
      const ordersResult = await Promise.all(
        orders.map(async (order: Order) => {
          const resultOrderProduct = await conn.query(sqlOrderProduct, [
            order.id,
          ]);
          const products = resultOrderProduct.rows;
          order.orderProducts = products;
          return order;
        }),
      );
      return ordersResult;
    } catch (err) {
      throw new Error(
        `Cannot find any completed order by user with id ${user_id}. ${err}`,
      );
    }
  }
}
