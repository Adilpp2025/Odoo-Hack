const express = require("express");
const db = require("./database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

// Temporary secret for local development
const JWT_SECRET = "development_secret_change_later";

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Backend is running!"
    });
});

// Login API
app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = db.prepare(
        "SELECT * FROM users WHERE email = ?"
    ).get(email);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    // Compare entered password with hashed password
    const passwordMatch = bcrypt.compareSync(
        password,
        user.password
    );

    if (!passwordMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    // Generate authentication token
    const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({
        success: true,
        message: "Login successful",
        token: token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});