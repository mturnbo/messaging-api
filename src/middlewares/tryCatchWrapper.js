import { createCustomError } from './customErrors.js';

export function tryCatchWrapper(func) {
    return async (req, res, next) => {
        try {
            await func(req, res, next);
        } catch (error) {
            return next(createCustomError(error, 400));
        }
    };
}
