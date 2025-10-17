import { query, emptyOrRows, execute } from '../db/query.js';
import { dbConfig } from '../config/db.js';
import { STATUS } from '../config/constants.js';
import { formatDateToMySQL } from "../utils/datetime.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const getMessage = async (messageId) => {
    const sql = 'SELECT sender_id, recipient_id, subject, body FROM messages where id = ?';
    const rows = await execute(sql, [messageId]);
    const data = emptyOrRows(rows);

    return {
        status: STATUS.SUCCESS,
        data,
    }
}
