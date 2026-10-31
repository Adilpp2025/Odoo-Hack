
const db = require("./database");
const bcrypt = require("bcryptjs");

const name = "Admin";
const email = "admin@example.com";
const password = "Admin123!";

const existingUser = db.prepare(
    "SELECT id FROM users WHERE email = ?"
).get(email);

if (!existingUser) {
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.prepare(`
        INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, ?)
    `).run(name, email, hashedPassword, "admin");

    console.log("Admin account created successfully!");
} else {
    console.log("Admin account already exists.");
}

db.close();
