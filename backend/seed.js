const db = require("./database");
const bcrypt = require("bcryptjs");

const name = "Admin";
const email = "admin@example.com";
const password = "Admin123!";

const hashedPassword = bcrypt.hashSync(password, 10);

try {
    const insertUser = db.prepare(`
        INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, ?)
    `);

    insertUser.run(name, email, hashedPassword, "admin");

    console.log("Admin account created successfully!");
} catch (error) {
    console.log("Admin account may already exist:", error.message);
}

db.close();