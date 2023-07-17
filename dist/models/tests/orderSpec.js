"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../order");
const product_1 = require("../product");
const user_1 = require("../user");
const server_1 = __importDefault(require("../../server"));
const supertest_1 = __importDefault(require("supertest"));
const request = (0, supertest_1.default)(server_1.default);
const testUser = {
    first_name: 'thanh',
    last_name: 'ngo',
    username: 'thanhngo123',
    password: 'Udacity@2023',
};
const testProduct = {
    name: 'banana',
    price: 22,
    category: 'fruit',
};
const testOrder = {
    user_id: '1',
    status: 'complete',
    product_id: 1,
    quantity: 2,
};
const store = new order_1.OrderStore();
const userStore = new user_1.UserStore();
const productStore = new product_1.ProductStore();
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
    let authToken;
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
