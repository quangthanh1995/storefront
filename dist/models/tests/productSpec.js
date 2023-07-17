"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../product");
const server_1 = __importDefault(require("../../server"));
const supertest_1 = __importDefault(require("supertest"));
const request = (0, supertest_1.default)(server_1.default);
const testProduct = {
    name: 'apple',
    price: 12,
    category: 'fruit',
};
let store;
describe('Test Product Model', () => {
    beforeAll(() => {
        store = new product_1.ProductStore();
    });
    it('should create a new product', async () => {
        const createdProduct = await store.create(testProduct);
        expect(createdProduct).toBeDefined();
        expect(createdProduct.id).toBeDefined();
        expect(createdProduct.name).toBe(testProduct.name);
    });
    it('should retrieve a list of products', async () => {
        const products = await store.index();
        expect(products).toBeDefined();
        expect(Array.isArray(products)).toBe(true);
    });
    it('should retrive a specific product by id', async () => {
        const result = await store.create(testProduct);
        const retrievedProduct = await store.show(result.id.toString());
        expect(retrievedProduct).toBeDefined();
        expect(retrievedProduct.name).toBe(result.name);
    });
    it('should delete a specific product by id', async () => {
        store.delete('3');
        const result = await store.index();
        expect(result.length).toEqual(2);
    });
    it('should retrieve the specific product by category', async () => {
        const testCategory = 'fruit';
        const products = await store.productsByCategory(testCategory);
        expect(products).toBeDefined();
        expect(Array.isArray(products)).toBe(true);
        for (const product of products) {
            expect(product.category).toBe(testCategory);
        }
    });
});
describe('Test Product Endpoint', () => {
    let authToken;
    beforeAll(async () => {
        const userRequest = await request
            .post('/users/login')
            .send({ username: 'thanhngo123', password: 'Udacity@2023' })
            .set('Accept', 'application/json');
        authToken = userRequest.body;
    });
    it('should add a new product', async () => {
        const response = await request
            .post('/products')
            .send({
            name: 'sunflower',
            price: 25,
            category: 'flower',
        })
            .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200);
    });
    it('should return 401 Unauthorized without a valid token for add product', async () => {
        const response = await request
            .post('/products')
            .send({
            name: 'rose',
            price: 35,
            category: 'flower',
        })
            .set('Authorization', `Bearer invalid_token`);
        expect(response.status).toBe(401);
    });
    it('should retrieve all products', async () => {
        const response = await request.get('/products');
        expect(response.status).toBe(200);
    });
    it('should retrieve a specific product by id', async () => {
        const response = await request.get('/products/2');
        expect(response.status).toBe(200);
    });
    it('should delete a specific product by id', async () => {
        const response = await request
            .delete('/products/2')
            .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200);
    });
    it('should retrieve products by category', async () => {
        const response = await request.get('/products/category/fruit');
        expect(response.status).toBe(200);
    });
});
