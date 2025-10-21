import { execute } from '../db/query.js';
import { STATUS } from "../config/constants.js";

export class MessageService {
    async createMessage(newMessage) {
        const sql = `INSERT INTO messages 
        (sender_id, recipient_id, subject, body, sender_address) 
        VALUES (?, ?, ?, ?, ?)`;
        const params = [
            newMessage.senderId,
            newMessage.recipientId,
            newMessage.subject,
            newMessage.body,
            newMessage.senderAddress,
        ];

        const results = await execute(sql, params);

        return {
            status: STATUS.SUCCESS,
            newMessageId: results.insertId,
        }
    }
}
