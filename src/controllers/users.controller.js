import { query, emptyOrRows, getOffset } from '../db/query.js';
import { dbConfig } from '../config/db.js';
import { STATUS } from '../config/constants.js';
import { comparePassword } from '../utils/encrypt.js';

export const authenticateUser = async (userId, password) => {
    const sql = `select id, username, password_hash from users where username = '${userId}'`;
    const userData = await query(sql);

    return comparePassword(password, userData[0].password_hash);
}

export const getAllUsers = async (page = 1) => {
    const offset = getOffset(page, dbConfig.listPerPage);
    const sql = `SELECT id, username, first_name, last_name FROM users LIMIT ${offset},${dbConfig.listPerPage}`;
    const rows = await query(sql);
    const data = emptyOrRows(rows);
    const meta = { page };

    return {
        status: STATUS.SUCCESS,
        meta,
        data,
    }
}

export const getUser = async (userId) => {
    const sql = `SELECT id, username, first_name, last_name, email, device_address, created_at, last_seen FROM users where id = '${userId}' or username = '${userId}'`;
    const rows = await query(sql);
    const data = emptyOrRows(rows);

    return data.length ?
        {
            status: STATUS.SUCCESS,
            data: data[0],
        } :
        {
            status: STATUS.ERROR,
            data: {},
        }
}
