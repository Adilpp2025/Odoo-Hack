const Database = require("better-sqlite3");

// Create or open our database
const db = new Database("subscription.db");

// Create users table
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('admin', 'staff', 'customer'))
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        sales_price REAL NOT NULL,
        cost_price REAL NOT NULL,
        notes TEXT
    )
`);

console.log("Database connected successfully!");

module.exports = db;