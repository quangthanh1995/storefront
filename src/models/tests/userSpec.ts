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

let store: UserStore;

describe('Test User Model', () => {
  beforeAll(() => {
    store = new UserStore();
  });

  it('should create a new user', async () => {
    const createdUser = await store.create(testUser);

    expect(createdUser).toBeDefined();
    expect(createdUser.id).toBeDefined();
    expect(createdUser.username).toBe(testUser.username);
  });

  it('should authenticate a user', async () => {
    const authenticatedUser = await store.authenticate(
      testUser.username,
      testUser.password,
    );

    expect(authenticatedUser).toBeDefined();
  });

  it('should retrieve a list of users', async () => {
    const users = await store.index();

    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBe(true);
  });

  it('should retrieve a specific user by id', async () => {
    const result = await store.create(testUser);
    const retrievedUser = await store.show(result.id!.toString());

    expect(retrievedUser).toBeDefined();
    expect(retrievedUser.username).toBe(result.username);
  });
});

describe('Test User Endpoint', () => {
  let authToken: string;

  beforeAll(async () => {
    store = new UserStore();
    const userRequest = await request
      .post('/users/login')
      .send({ username: 'thanhngo123', password: 'Udacity@2023' })
      .set('Accept', 'application/json');

    authToken = userRequest.body;
  });

  it('should create a new user and return a jwt token', async () => {
    const newUser: User = {
      first_name: 'quang',
      last_name: 'ngo',
      username: 'quangngo123',
      password: 'Udacity@2023',
    };

    const response = await request.post('/users').send(newUser);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it('should authenticate a user and return a jwt token', async () => {
    const response = await request
      .post('/users/login')
      .send({ username: 'thanhngo456', password: 'Udacity@2023' });

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it('should return a list of users with a valid token', async () => {
    const response = await request
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return a specific user by id with a valid token', async () => {
    const createdUser = await store.create(testUser);

    const response = await request
      .get(`/users/${createdUser.id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(createdUser.id);
    expect(response.body.username).toBe(createdUser.username);
  });

  it('should return 401 Unauthorized without a token for retrieve user', async () => {
    const response = await request.get('/users');

    expect(response.status).toBe(401);
  });

  it('should return 401 Unauthorized with an invalid token', async () => {
    const response = await request
      .get('/users')
      .set('Authorization', `Bearer invalid_token`);

    expect(response.status).toBe(401);
  });
});
