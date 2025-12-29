import { Pool } from 'pg';

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

async function testConnection(): Promise<void> {
    try {
        const client = await pool.connect();
        console.log('PostgreSQL connected successfully');
        client.release();
    } catch (error) {
        console.error('PostgreSQL connection failed:', error);
        throw error;
    }
}

export default pool;
export { testConnection };


