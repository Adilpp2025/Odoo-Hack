
const Database = require("better-sqlite3");

const db = new Database("subscription.db");

db.pragma("foreign_keys = ON");

// USERS
db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'staff', 'customer'))
);
`);

// PRODUCTS
db.exec(`
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    sales_price REAL NOT NULL,
    cost_price REAL NOT NULL,
    notes TEXT
);
`);

// SUBSCRIPTION PLANS
db.exec(`
CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    billing_frequency TEXT NOT NULL
        CHECK(billing_frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
    minimum_quantity INTEGER DEFAULT 1,
    start_date TEXT,
    end_date TEXT,
    status TEXT DEFAULT 'active'
);
`);

// SUBSCRIPTIONS
db.exec(`
CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    plan_id INTEGER NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT,
    quantity INTEGER DEFAULT 1,
    payment_terms TEXT,
    status TEXT DEFAULT 'draft'
        CHECK(status IN ('draft', 'quotation', 'confirmed', 'active', 'closed')),
    FOREIGN KEY(customer_id) REFERENCES users(id),
    FOREIGN KEY(plan_id) REFERENCES plans(id)
);
`);

// INVOICES
db.exec(`
CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subscription_id INTEGER NOT NULL,
    customer_id INTEGER NOT NULL,
    invoice_date TEXT NOT NULL,
    due_date TEXT,
    subtotal REAL NOT NULL,
    tax REAL DEFAULT 0,
    total REAL NOT NULL,
    status TEXT DEFAULT 'draft'
        CHECK(status IN ('draft', 'confirmed', 'paid', 'cancelled')),
    FOREIGN KEY(subscription_id) REFERENCES subscriptions(id),
    FOREIGN KEY(customer_id) REFERENCES users(id)
);
`);

// PAYMENTS
db.exec(`
CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER NOT NULL,
    customer_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    payment_date TEXT NOT NULL,
    payment_method TEXT,
    note TEXT,
    FOREIGN KEY(invoice_id) REFERENCES invoices(id),
    FOREIGN KEY(customer_id) REFERENCES users(id)
);
`);

// DISCOUNTS
db.exec(`
CREATE TABLE IF NOT EXISTS discounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    discount_type TEXT NOT NULL
        CHECK(discount_type IN ('fixed', 'percentage')),
    discount_value REAL NOT NULL,
    start_date TEXT,
    end_date TEXT,
    usage_limit INTEGER,
    status TEXT DEFAULT 'active'
);
`);

console.log("Database connected successfully!");

module.exports = db;
