import express from 'express';
import request from 'supertest';
import usersRouter from '../../../src/routes/users.routes.js';
import { authenticateUser, getAllUsers, getUser } from '../../../src/controllers/users.controller.js';
import { authenticateToken } from '../../../src/middlewares/token.js';
import { UserService } from '../../../src/services/user.service.js';

jest.mock('../../../src/controllers/users.controller.js');
jest.mock('../../../src/middlewares/token.js');
jest.mock('../../../src/services/user.service.js');

describe('users.routes.js tests', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/users', usersRouter);
        jest.clearAllMocks();

        // Mock authenticateToken middleware to call next()
        authenticateToken.mockImplementation((req, res, next) => next());
    });

    describe('GET /', () => {
        it('should return users when users are found', async () => {
            const mockUsers = [
                { id: 1, username: 'user1' },
                { id: 2, username: 'user2' }
            ];
            getAllUsers.mockResolvedValue(mockUsers);

            const response = await request(app).get('/users');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUsers);
            expect(getAllUsers).toHaveBeenCalledWith(undefined);
        });

        it('should return users with page parameter', async () => {
            const mockUsers = [{ id: 1, username: 'user1' }];
            getAllUsers.mockResolvedValue(mockUsers);

            const response = await request(app).get('/users?page=2');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUsers);
            expect(getAllUsers).toHaveBeenCalledWith('2');
        });

        it('should return 404 when no users are found', async () => {
            getAllUsers.mockResolvedValue([]);

            const response = await request(app).get('/users');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Users not found' });
        });

        it('should return 500 when an error occurs', async () => {
            const error = new Error('Database error');
            getAllUsers.mockRejectedValue(error);

            const response = await request(app).get('/users');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                error: 'Failed to fetch users',
                details: 'Database error'
            });
        });

        it('should call authenticateToken middleware', async () => {
            getAllUsers.mockResolvedValue([{ id: 1, username: 'user1' }]);

            await request(app).get('/users');

            expect(authenticateToken).toHaveBeenCalled();
        });
    });

    describe('GET /:id', () => {
        it('should return a user by id', async () => {
            const mockUser = { id: 1, username: 'user1' };
            getUser.mockResolvedValue(mockUser);

            const response = await request(app).get('/users/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUser);
            expect(getUser).toHaveBeenCalledWith('1');
        });

        it('should call authenticateToken middleware', async () => {
            getUser.mockResolvedValue({ id: 1, username: 'user1' });

            await request(app).get('/users/1');

            expect(authenticateToken).toHaveBeenCalled();
        });
    });

    describe('POST /auth', () => {
        it('should authenticate user with valid credentials', async () => {
            const mockAuthResponse = { token: 'jwt-token', userId: 1 };
            authenticateUser.mockResolvedValue(mockAuthResponse);

            const response = await request(app)
                .post('/users/auth')
                .send({ username: 'user1', password: 'password123' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockAuthResponse);
            expect(authenticateUser).toHaveBeenCalledWith('user1', 'password123');
        });

        it('should not require authentication token', async () => {
            authenticateUser.mockResolvedValue({ token: 'jwt-token' });

            await request(app)
                .post('/users/auth')
                .send({ username: 'user1', password: 'password123' });

            // authenticateToken should not be called for auth route
            expect(authenticateToken).not.toHaveBeenCalled();
        });
    });

    describe('POST /register', () => {
        it('should register a new user', async () => {
            const mockUser = { id: 1, username: 'newuser', email: 'new@example.com' };
            const mockCreateUser = jest.fn().mockResolvedValue(mockUser);
            UserService.mockImplementation(() => ({
                createUser: mockCreateUser
            }));

            const response = await request(app)
                .post('/users/register')
                .send({ username: 'newuser', email: 'new@example.com', password: 'password123' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUser);
            expect(mockCreateUser).toHaveBeenCalledWith({
                username: 'newuser',
                email: 'new@example.com',
                password: 'password123'
            });
        });

        it('should call authenticateToken middleware', async () => {
            const mockCreateUser = jest.fn().mockResolvedValue({ id: 1 });
            UserService.mockImplementation(() => ({
                createUser: mockCreateUser
            }));

            await request(app)
                .post('/users/register')
                .send({ username: 'newuser' });

            expect(authenticateToken).toHaveBeenCalled();
        });
    });
});
