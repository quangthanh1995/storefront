import { OrderStore, OrderType } from '../order';
import { Product, ProductStore } from '../product';
import { User, UserStore } from '../user';
import app from '../../server';
import supertest from 'supertest';

const request = supertest(app);

const testUser: User = {
  first_name: 'thanh',
  last_name: 'ngo',
  username: 'thanhngo123',
  password: 'Udacity@2023',
};

const testProduct: Product = {
  name: 'banana',
  price: 22,
  category: 'fruit',
};

const testOrder: OrderType = {
  user_id: '1',
  status: 'complete',
  product_id: 1,
  quantity: 2,
};

const store = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

describe('Test Order Model', () => {
  it('should create an order', async () => {
    const user = await userStore.create(testUser);

    expect(Object.values(user)).toBeDefined();

    const product = await productStore.create(testProduct);

    expect(Object.values(product)).toBeDefined();

    const result = await store.create(testOrder);

    expect(result.id).toEqual(1);
  });

  it('should retrieve current order by user', async () => {
    const user_id = '1';

    const order = await store.currentOrderByUser(user_id);

    expect(order).toBeDefined();
    expect(order.length).toEqual(1);
    expect(Array.isArray(order)).toBe(true);
  });

  it('should retrieve completed orders by user', async () => {
    const user_id = '1';

    const orders = await store.completedOrdersByUser(user_id);

    expect(orders).toBeDefined();
    expect(Array.isArray(orders)).toBe(true);
  });
});

describe('Test Order Endpoint', () => {
  let authToken: string;

  beforeAll(async () => {
    const userRequest = await request
      .post('/users/login')
      .send({ username: 'thanhngo123', password: 'Udacity@2023' })
      .set('Accept', 'application/json');

    authToken = userRequest.body;
  });

  it('should add a new order', async () => {
    const response = await request
      .post('/orders')
      .send(testOrder)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
  });

  it('should retrieve current order by user', async () => {
    const response = await request
      .get('/orders/1')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
  });

  it('should return 401 Unauthorized without a valid token for retrieve current order by user', async () => {
    const response = await request
      .get('/orders/1')
      .set('Authorization', `Bearer invalid_token`);

    expect(response.status).toBe(401);
  });

  it('should retrieve completed orders by user', async () => {
    const response = await request
      .get('/orders/completedOrdersByUser/1')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
  });
});
