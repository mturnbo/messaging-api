import { pool } from './connect.js';

export const query = async (sql, params) => {
    const [results, ] = await pool.query(sql, params);

    return results;
}

export const getOffset = (currentPage = 1, listPerPage) => {
    return (currentPage - 1) * [listPerPage];
}

export const emptyOrRows = (rows) => {
    if (!rows) {
        return [];
    }
    return rows;
}
