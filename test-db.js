const pool = require("./db");

async function test() {
    try {
        const result = await pool.query("SELECT NOW()");
        console.log("Database time:", result.rows[0]);
    } catch (error) {
        console.error(error);
    } finally {
        await pool.end();
    }
}

test();