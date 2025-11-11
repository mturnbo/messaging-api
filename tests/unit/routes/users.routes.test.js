/**
 * Jest tests for src/routes/user.routes.js
 *
 * These tests mock the controller functions, token middleware, and UserService so we can
 * exercise the route handlers in isolation without hitting a real DB or verifying auth.
 *
 * Uses supertest to make requests against an Express app that mounts the router under /users.
 */

import request from 'supertest';
import express from 'express';

// Create mocks we can control in tests
const getAllUsersMock = jest.fn();
const getUserMock = jest.fn();
const authenticateUserMock = jest.fn();
const createUserMock = jest.fn();

// Mock controllers before importing the router so the router gets the mocked functions
jest.mock('#controllers/user.controller.js', () => ({
    // export functions that forward to our jest.fn() mocks
    getAllUsers: (...args) => getAllUsersMock(...args),
    getUser: (...args) => getUserMock(...args),
    authenticateUser: (...args) => authenticateUserMock(...args),
}));

// Mock token middleware to simply call next() by default (successful authentication)
jest.mock('#middlewares/auth.middleware.js', () => ({
    authenticateToken: jest.fn((req, res, next) => next()),
}));

// Mock UserService class used by the route file. The router instantiates a UserService
// at module load time, so the mock must provide a constructor that returns an object
// with createUser (our createUserMock).
jest.mock('#services/user.service.js', () => ({
    UserService: jest.fn().mockImplementation(() => ({ createUser: createUserMock })),
}));

// Now import the router under test (after mocks are set up)
import router from '#routes/user.routes.js';

describe('users.routes', () => {
    let app;

    beforeEach(() => {
        // reset mock call history and implementations between tests
        jest.clearAllMocks();

        // Minimal express app mounting the router under /users
        app = express();
        app.use(express.json());
        app.use('/users', router);

        // Add a global error handler that only responds when headers haven't been sent yet.
        // This mirrors typical Express error handling and lets routes that call next(err)
        // (without sending a response) return a 500 here so tests can assert on it.
        app.use((err, req, res, next) => {
            if (res.headersSent) return next(err);
            res.status(500).json({ error: err.message });
        });
    });

    test('GET /users -> 404 when no users found', async () => {
        getAllUsersMock.mockResolvedValueOnce([]);
        const res = await request(app).get('/users');
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: 'Users not found' });
        expect(getAllUsersMock).toHaveBeenCalledWith(undefined);
    });

    test('GET /users -> 200 returns users array', async () => {
        const users = [{ id: '1', username: 'alice' }, { id: '2', username: 'bob' }];
        getAllUsersMock.mockResolvedValueOnce(users);
        const res = await request(app).get('/users?page=2');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(users);
        // route forwards req.query.page to getAllUsers
        expect(getAllUsersMock).toHaveBeenCalledWith('2');
    });

    test('GET /users -> 500 when getAllUsers throws', async () => {
        getAllUsersMock.mockRejectedValueOnce(new Error('database failure'));
        const res = await request(app).get('/users');
        // The route catches the error and responds with a 500 and a specific JSON body
        expect(res.status).toBe(500);
        expect(res.body).toEqual({
            error: 'Failed to fetch users',
            details: 'database failure',
        });
        expect(getAllUsersMock).toHaveBeenCalled();
    });

    test('GET /users/:id -> 200 returns single user', async () => {
        const user = { id: '123', username: 'carol' };
        getUserMock.mockResolvedValueOnce(user);
        const res = await request(app).get('/users/123');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(user);
        expect(getUserMock).toHaveBeenCalledWith('123');
    });

    test('GET /users/:id -> 500 when controller throws (propagates to error handler)', async () => {
        getUserMock.mockRejectedValueOnce(new Error('not found'));
        const res = await request(app).get('/users/does-not-exist');
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: 'not found' });
        expect(getUserMock).toHaveBeenCalledWith('does-not-exist');
    });

    test('POST /users/auth -> 200 returns authentication payload', async () => {
        const authPayload = { token: 'jwt-token', userId: 'u1' };
        authenticateUserMock.mockResolvedValueOnce(authPayload);

        const res = await request(app)
            .post('/users/auth')
            .send({ username: 'alice', password: 'secret' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(authPayload);
        expect(authenticateUserMock).toHaveBeenCalledWith('alice', 'secret');
    });

    test('POST /users/auth -> 500 when authenticateUser throws (propagates to error handler)', async () => {
        authenticateUserMock.mockRejectedValueOnce(new Error('bad credentials'));
        const res = await request(app)
            .post('/users/auth')
            .send({ username: 'x', password: 'y' });

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: 'bad credentials' });
        expect(authenticateUserMock).toHaveBeenCalledWith('x', 'y');
    });

    test('POST /users/register -> 200 creates and returns new user', async () => {
        const created = { id: 'u99', username: 'newuser' };
        createUserMock.mockResolvedValueOnce(created);

        const res = await request(app).post('/users/register').send({ username: 'newuser', password: 'pw' });
        expect(res.status).toBe(200);
        expect(res.body).toEqual(created);
        expect(createUserMock).toHaveBeenCalledWith({ username: 'newuser', password: 'pw' });
    });

    test('POST /users/register -> 500 when createUser throws (propagates to error handler)', async () => {
        createUserMock.mockRejectedValueOnce(new Error('cannot create'));
        const res = await request(app).post('/users/register').send({ username: 'x', password: 'y' });
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: 'cannot create' });
        expect(createUserMock).toHaveBeenCalledWith({ username: 'x', password: 'y' });
    });
});