import { emptyOrRows, execute } from '../db/query.js';
import { STATUS } from '../config/constants.js';

export const getMessage = async (messageId) => {
    const sql = 'SELECT sender_id, recipient_id, subject, body FROM messages where id = ?';
    const rows = await execute(sql, [messageId]);
    const data = emptyOrRows(rows);

    const status = data.length > 0 ? STATUS.SUCCESS : STATUS.NOTFOUND;

    return {
        status,
        data,
    }
}
