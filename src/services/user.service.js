import { query } from '#db/query.js';
import {generateHashedPassword} from "#utils/encrypt.js";
import { STATUS } from "#config/constants.js";

export class UserService {
    async userExists(username) {
        const result = await query(`select id
                      from users
                      where username = '${username}'`)

        return result.length > 0;
    }

    async createUser(newUser) {
        const userExists = await this.userExists(newUser.username);
        if (userExists) {
            return {
                status: STATUS.ERROR,
                error: 'Username already exists',
            }
        } else {
            const hashedPassword = await generateHashedPassword(newUser.password);

            const sql = `INSERT INTO users 
            (username, password_hash, first_name, last_name, email, device_address) 
            VALUES
            (
             '${newUser.username}', 
             '${hashedPassword}', 
             '${newUser.first_name || ""}', 
             '${newUser.last_name || ""}',
             '${newUser.email || ""}',  
             '${newUser.device_address || ""}'
            )`;

            const results = await query(sql);

            return {
                status: STATUS.SUCCESS,
                newUserId: results.insertId,
            }
        }
    }
}
