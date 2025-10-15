import { generateHashedPassword, comparePassword, encryptMessage } from './encrypt.js';
import bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('encrypt.js tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('generateHashedPassword should return a hashed password', async () => {
        const txtPassword = 'password123';
        const salt = 'randomSalt';
        const hashedPassword = 'hashedPassword';
        bcrypt.genSalt.mockResolvedValue(salt);
        bcrypt.hash.mockResolvedValue(hashedPassword);

        const result = await generateHashedPassword(txtPassword);

        expect(bcrypt.genSalt).toHaveBeenCalled();
        expect(bcrypt.hash).toHaveBeenCalledWith(txtPassword, salt);
        expect(result).toBe(hashedPassword);
    });

    test('comparePassword should return true for matching passwords', async () => {
        const input = 'password123';
        const saved = 'hashedPassword';
        bcrypt.compare.mockResolvedValue(true);

        const result = await comparePassword(input, saved);

        expect(bcrypt.compare).toHaveBeenCalledWith(input, saved);
        expect(result).toBe(true);
    });

    test('comparePassword should return false for non-matching passwords', async () => {
        const input = 'password123';
        const saved = 'hashedPassword';
        bcrypt.compare.mockResolvedValue(false);

        const result = await comparePassword(input, saved);

        expect(bcrypt.compare).toHaveBeenCalledWith(input, saved);
        expect(result).toBe(false);
    });

    test('encryptMessage should return a hashed message', async () => {
        const input = 'secretMessage';
        const salt = 'randomSalt';
        const hashedMessage = 'hashedMessage';
        bcrypt.genSalt.mockResolvedValue(salt);
        bcrypt.hash.mockResolvedValue(hashedMessage);

        const result = await encryptMessage(input);

        expect(bcrypt.genSalt).toHaveBeenCalled();
        expect(bcrypt.hash).toHaveBeenCalledWith(input, salt);
        expect(result).toBe(hashedMessage);
    });
});