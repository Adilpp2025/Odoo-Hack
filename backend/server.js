
const express = require("express");
const cors = require("cors");
const db = require("./database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "development_secret_change_later";
const PORT = 3000;

// --------------------
// AUTHENTICATION
// --------------------

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authentication token required"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}

function allowRoles(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission"
            });
        }
        next();
    };
}

// HEALTH CHECK
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Backend is running!"
    });
});

// LOGIN
app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    const user = db.prepare(
        "SELECT * FROM users WHERE email = ?"
    ).get(email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

// --------------------
// PRODUCTS
// --------------------

// GET ALL PRODUCTS
app.get("/api/products", authenticateToken, (req, res) => {
    const products = db.prepare(
        "SELECT * FROM products ORDER BY id DESC"
    ).all();

    res.json({ success: true, products });
});

// GET ONE PRODUCT
app.get("/api/products/:id", authenticateToken, (req, res) => {
    const product = db.prepare(
        "SELECT * FROM products WHERE id = ?"
    ).get(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    res.json({ success: true, product });
});

// ADD PRODUCT
app.post("/api/products", authenticateToken, allowRoles("admin", "staff"), (req, res) => {
    const { name, type, sales_price, cost_price, notes } = req.body;

    if (!name || !type || !Number.isFinite(sales_price) ||
        !Number.isFinite(cost_price) || sales_price < 0 || cost_price < 0) {
        return res.status(400).json({
            success: false,
            message: "Valid name, type, sales_price and cost_price are required"
        });
    }

    const result = db.prepare(`
        INSERT INTO products (name, type, sales_price, cost_price, notes)
        VALUES (?, ?, ?, ?, ?)
    `).run(name, type, sales_price, cost_price, notes || null);

    res.status(201).json({
        success: true,
        message: "Product added",
        productId: result.lastInsertRowid
    });
});

// UPDATE PRODUCT
app.put("/api/products/:id", authenticateToken, allowRoles("admin", "staff"), (req, res) => {
    const { name, type, sales_price, cost_price, notes } = req.body;

    const existing = db.prepare(
        "SELECT * FROM products WHERE id = ?"
    ).get(req.params.id);

    if (!existing) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    const updated = {
        name: name ?? existing.name,
        type: type ?? existing.type,
        sales_price: sales_price ?? existing.sales_price,
        cost_price: cost_price ?? existing.cost_price,
        notes: notes ?? existing.notes
    };

    if (!updated.name || !updated.type ||
        !Number.isFinite(updated.sales_price) ||
        !Number.isFinite(updated.cost_price) ||
        updated.sales_price < 0 || updated.cost_price < 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid product details"
        });
    }

    db.prepare(`
        UPDATE products
        SET name = ?, type = ?, sales_price = ?, cost_price = ?, notes = ?
        WHERE id = ?
    `).run(
        updated.name, updated.type, updated.sales_price,
        updated.cost_price, updated.notes, req.params.id
    );

    res.json({ success: true, message: "Product updated" });
});

// DELETE PRODUCT
app.delete("/api/products/:id", authenticateToken, allowRoles("admin"), (req, res) => {
    const result = db.prepare(
        "DELETE FROM products WHERE id = ?"
    ).run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    res.json({ success: true, message: "Product deleted" });
});

// --------------------
// SUBSCRIPTION PLANS
// --------------------

app.get("/api/plans", authenticateToken, (req, res) => {
    const plans = db.prepare("SELECT * FROM plans ORDER BY id DESC").all();
    res.json({ success: true, plans });
});

app.get("/api/plans/:id", authenticateToken, (req, res) => {
    const plan = db.prepare("SELECT * FROM plans WHERE id = ?").get(req.params.id);

    if (!plan) {
        return res.status(404).json({ success: false, message: "Plan not found" });
    }

    res.json({ success: true, plan });
});

app.post("/api/plans", authenticateToken, allowRoles("admin"), (req, res) => {
    const {
        name, description, price, billing_frequency,
        minimum_quantity, start_date, end_date, status
    } = req.body;

    const frequencies = ["daily", "weekly", "monthly", "yearly"];

    if (!name || !Number.isFinite(price) || price < 0 ||
        !frequencies.includes(billing_frequency)) {
        return res.status(400).json({ success: false, message: "Invalid plan details" });
    }

    const result = db.prepare(`
        INSERT INTO plans
        (name, description, price, billing_frequency, minimum_quantity, start_date, end_date, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        name, description || null, price, billing_frequency,
        minimum_quantity || 1, start_date || null, end_date || null,
        status || "active"
    );

    res.status(201).json({
        success: true,
        message: "Plan created",
        planId: result.lastInsertRowid
    });
});

app.put("/api/plans/:id", authenticateToken, allowRoles("admin"), (req, res) => {
    const plan = db.prepare("SELECT * FROM plans WHERE id = ?").get(req.params.id);

    if (!plan) {
        return res.status(404).json({ success: false, message: "Plan not found" });
    }

    const fields = {
        name: req.body.name ?? plan.name,
        description: req.body.description ?? plan.description,
        price: req.body.price ?? plan.price,
        billing_frequency: req.body.billing_frequency ?? plan.billing_frequency,
        minimum_quantity: req.body.minimum_quantity ?? plan.minimum_quantity,
        start_date: req.body.start_date ?? plan.start_date,
        end_date: req.body.end_date ?? plan.end_date,
        status: req.body.status ?? plan.status
    };

    if (!fields.name || !Number.isFinite(fields.price) || fields.price < 0 ||
        !["daily", "weekly", "monthly", "yearly"].includes(fields.billing_frequency)) {
        return res.status(400).json({ success: false, message: "Invalid plan details" });
    }

    db.prepare(`
        UPDATE plans SET name=?, description=?, price=?, billing_frequency=?,
        minimum_quantity=?, start_date=?, end_date=?, status=? WHERE id=?
    `).run(
        fields.name, fields.description, fields.price, fields.billing_frequency,
        fields.minimum_quantity, fields.start_date, fields.end_date, fields.status,
        req.params.id
    );

    res.json({ success: true, message: "Plan updated" });
});

app.delete("/api/plans/:id", authenticateToken, allowRoles("admin"), (req, res) => {
    const result = db.prepare("DELETE FROM plans WHERE id = ?").run(req.params.id);

    if (!result.changes) {
        return res.status(404).json({ success: false, message: "Plan not found" });
    }

    res.json({ success: true, message: "Plan deleted" });
});

// --------------------
// SUBSCRIPTIONS
// --------------------

app.get("/api/subscriptions", authenticateToken, (req, res) => {
    let subscriptions;

    if (req.user.role === "customer") {
        subscriptions = db.prepare(`
            SELECT * FROM subscriptions WHERE customer_id = ? ORDER BY id DESC
        `).all(req.user.id);
    } else {
        subscriptions = db.prepare(
            "SELECT * FROM subscriptions ORDER BY id DESC"
        ).all();
    }

    res.json({ success: true, subscriptions });
});

app.get("/api/subscriptions/:id", authenticateToken, (req, res) => {
    let subscription = db.prepare(
        "SELECT * FROM subscriptions WHERE id = ?"
    ).get(req.params.id);

    if (!subscription ||
        (req.user.role === "customer" && subscription.customer_id !== req.user.id)) {
        return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    res.json({ success: true, subscription });
});

app.post("/api/subscriptions", authenticateToken, allowRoles("admin", "staff"), (req, res) => {
    const {
        customer_id, plan_id, start_date, end_date,
        quantity, payment_terms, status
    } = req.body;

    const customer = db.prepare(
        "SELECT id FROM users WHERE id = ? AND role = 'customer'"
    ).get(customer_id);

    const plan = db.prepare(
        "SELECT id FROM plans WHERE id = ?"
    ).get(plan_id);

    if (!customer || !plan || !start_date || !Number.isInteger(quantity || 1) || (quantity || 1) < 1) {
        return res.status(400).json({
            success: false,
            message: "Valid customer, plan, start_date and quantity are required"
        });
    }

    const result = db.prepare(`
        INSERT INTO subscriptions
        (customer_id, plan_id, start_date, end_date, quantity, payment_terms, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
        customer_id, plan_id, start_date, end_date || null,
        quantity || 1, payment_terms || null, status || "draft"
    );

    res.status(201).json({
        success: true,
        message: "Subscription created",
        subscriptionId: result.lastInsertRowid
    });
});

app.put("/api/subscriptions/:id", authenticateToken, allowRoles("admin", "staff"), (req, res) => {
    const subscription = db.prepare(
        "SELECT * FROM subscriptions WHERE id = ?"
    ).get(req.params.id);

    if (!subscription) {
        return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    const fields = {
        start_date: req.body.start_date ?? subscription.start_date,
        end_date: req.body.end_date ?? subscription.end_date,
        quantity: req.body.quantity ?? subscription.quantity,
        payment_terms: req.body.payment_terms ?? subscription.payment_terms,
        status: req.body.status ?? subscription.status
    };

    const statuses = ["draft", "quotation", "confirmed", "active", "closed"];

    if (!Number.isInteger(fields.quantity) || fields.quantity < 1 ||
        !statuses.includes(fields.status)) {
        return res.status(400).json({ success: false, message: "Invalid subscription details" });
    }

    db.prepare(`
        UPDATE subscriptions
        SET start_date=?, end_date=?, quantity=?, payment_terms=?, status=?
        WHERE id=?
    `).run(
        fields.start_date, fields.end_date, fields.quantity,
        fields.payment_terms, fields.status, req.params.id
    );

    res.json({ success: true, message: "Subscription updated" });
});

// --------------------
// INVOICES
// --------------------

app.get("/api/invoices", authenticateToken, (req, res) => {
    const invoices = req.user.role === "customer"
        ? db.prepare("SELECT * FROM invoices WHERE customer_id = ? ORDER BY id DESC").all(req.user.id)
        : db.prepare("SELECT * FROM invoices ORDER BY id DESC").all();

    res.json({ success: true, invoices });
});

app.get("/api/invoices/:id", authenticateToken, (req, res) => {
    const invoice = db.prepare(
        "SELECT * FROM invoices WHERE id = ?"
    ).get(req.params.id);

    if (!invoice ||
        (req.user.role === "customer" && invoice.customer_id !== req.user.id)) {
        return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    res.json({ success: true, invoice });
});

app.post("/api/invoices", authenticateToken, allowRoles("admin", "staff"), (req, res) => {
    const {
        subscription_id, customer_id, invoice_date,
        due_date, subtotal, tax
    } = req.body;

    const subscription = db.prepare(
        "SELECT * FROM subscriptions WHERE id = ?"
    ).get(subscription_id);

    if (!subscription || subscription.customer_id !== Number(customer_id) ||
        !invoice_date || !Number.isFinite(subtotal) ||
        !Number.isFinite(tax || 0) || subtotal < 0 || (tax || 0) < 0) {
        return res.status(400).json({ success: false, message: "Invalid invoice details" });
    }

    const total = subtotal + (tax || 0);

    const result = db.prepare(`
        INSERT INTO invoices
        (subscription_id, customer_id, invoice_date, due_date, subtotal, tax, total, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'draft')
    `).run(
        subscription_id, customer_id, invoice_date, due_date || null,
        subtotal, tax || 0, total
    );

    res.status(201).json({
        success: true,
        message: "Invoice created",
        invoiceId: result.lastInsertRowid
    });
});

app.put("/api/invoices/:id", authenticateToken, allowRoles("admin", "staff"), (req, res) => {
    const invoice = db.prepare(
        "SELECT * FROM invoices WHERE id = ?"
    ).get(req.params.id);

    if (!invoice) {
        return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    const allowedStatuses = ["draft", "confirmed", "paid", "cancelled"];
    const status = req.body.status ?? invoice.status;
    const dueDate = req.body.due_date ?? invoice.due_date;

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid invoice status" });
    }

    db.prepare(
        "UPDATE invoices SET due_date = ?, status = ? WHERE id = ?"
    ).run(dueDate, status, req.params.id);

    res.json({ success: true, message: "Invoice updated" });
});

// --------------------
// PAYMENTS
// --------------------

app.get("/api/payments", authenticateToken, (req, res) => {
    const payments = req.user.role === "customer"
        ? db.prepare("SELECT * FROM payments WHERE customer_id = ? ORDER BY id DESC").all(req.user.id)
        : db.prepare("SELECT * FROM payments ORDER BY id DESC").all();

    res.json({ success: true, payments });
});

app.post("/api/payments", authenticateToken, allowRoles("admin", "staff"), (req, res) => {
    const {
        invoice_id, customer_id, amount,
        payment_date, payment_method, note
    } = req.body;

    const invoice = db.prepare(
        "SELECT * FROM invoices WHERE id = ?"
    ).get(invoice_id);

    if (!invoice || invoice.customer_id !== Number(customer_id) ||
        !Number.isFinite(amount) || amount <= 0 || !payment_date) {
        return res.status(400).json({ success: false, message: "Invalid payment details" });
    }

    const paid = db.prepare(
        "SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE invoice_id = ?"
    ).get(invoice_id).total;

    if (paid + amount > invoice.total) {
        return res.status(400).json({
            success: false,
            message: "Payment exceeds the outstanding invoice amount"
        });
    }

    const addPayment = db.transaction(() => {
        const result = db.prepare(`
            INSERT INTO payments
            (invoice_id, customer_id, amount, payment_date, payment_method, note)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(
            invoice_id, customer_id, amount, payment_date,
            payment_method || null, note || null
        );

        const newPaid = paid + amount;

        if (newPaid >= invoice.total) {
            db.prepare("UPDATE invoices SET status = 'paid' WHERE id = ?").run(invoice_id);
        } else if (invoice.status === "draft") {
            db.prepare("UPDATE invoices SET status = 'confirmed' WHERE id = ?").run(invoice_id);
        }

        return result;
    });

    const result = addPayment();

    res.status(201).json({
        success: true,
        message: "Payment recorded",
        paymentId: result.lastInsertRowid
    });
});

// --------------------
// DISCOUNTS
// --------------------

app.get("/api/discounts", authenticateToken, allowRoles("admin", "staff"), (req, res) => {
    const discounts = db.prepare("SELECT * FROM discounts ORDER BY id DESC").all();
    res.json({ success: true, discounts });
});

app.post("/api/discounts", authenticateToken, allowRoles("admin"), (req, res) => {
    const {
        name, discount_type, discount_value,
        start_date, end_date, usage_limit, status
    } = req.body;

    if (!name || !["fixed", "percentage"].includes(discount_type) ||
        !Number.isFinite(discount_value) || discount_value <= 0 ||
        (discount_type === "percentage" && discount_value > 100)) {
        return res.status(400).json({ success: false, message: "Invalid discount details" });
    }

    const result = db.prepare(`
        INSERT INTO discounts
        (name, discount_type, discount_value, start_date, end_date, usage_limit, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
        name, discount_type, discount_value, start_date || null,
        end_date || null, usage_limit ?? null, status || "active"
    );

    res.status(201).json({
        success: true,
        message: "Discount created",
        discountId: result.lastInsertRowid
    });
});

app.put("/api/discounts/:id", authenticateToken, allowRoles("admin"), (req, res) => {
    const discount = db.prepare(
        "SELECT * FROM discounts WHERE id = ?"
    ).get(req.params.id);

    if (!discount) {
        return res.status(404).json({ success: false, message: "Discount not found" });
    }

    const fields = {
        name: req.body.name ?? discount.name,
        discount_type: req.body.discount_type ?? discount.discount_type,
        discount_value: req.body.discount_value ?? discount.discount_value,
        start_date: req.body.start_date ?? discount.start_date,
        end_date: req.body.end_date ?? discount.end_date,
        usage_limit: req.body.usage_limit ?? discount.usage_limit,
        status: req.body.status ?? discount.status
    };

    if (!fields.name || !["fixed", "percentage"].includes(fields.discount_type) ||
        !Number.isFinite(fields.discount_value) || fields.discount_value <= 0 ||
        (fields.discount_type === "percentage" && fields.discount_value > 100)) {
        return res.status(400).json({ success: false, message: "Invalid discount details" });
    }

    db.prepare(`
        UPDATE discounts SET name=?, discount_type=?, discount_value=?,
        start_date=?, end_date=?, usage_limit=?, status=? WHERE id=?
    `).run(
        fields.name, fields.discount_type, fields.discount_value,
        fields.start_date, fields.end_date, fields.usage_limit,
        fields.status, req.params.id
    );

    res.json({ success: true, message: "Discount updated" });
});

app.delete("/api/discounts/:id", authenticateToken, allowRoles("admin"), (req, res) => {
    const result = db.prepare(
        "DELETE FROM discounts WHERE id = ?"
    ).run(req.params.id);

    if (!result.changes) {
        return res.status(404).json({ success: false, message: "Discount not found" });
    }

    res.json({ success: true, message: "Discount deleted" });
});

// --------------------
// DASHBOARD
// --------------------

app.get("/api/dashboard", authenticateToken, (req, res) => {
    if (req.user.role === "customer") {
        const subscriptions = db.prepare(
            "SELECT COUNT(*) AS total FROM subscriptions WHERE customer_id = ?"
        ).get(req.user.id).total;

        const invoices = db.prepare(
            "SELECT COUNT(*) AS total FROM invoices WHERE customer_id = ?"
        ).get(req.user.id).total;

        const payments = db.prepare(
            "SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE customer_id = ?"
        ).get(req.user.id).total;

        return res.json({
            success: true,
            role: "customer",
            subscriptions,
            invoices,
            payments
        });
    }

    const totalProducts = db.prepare(
        "SELECT COUNT(*) AS total FROM products"
    ).get().total;

    const totalPlans = db.prepare(
        "SELECT COUNT(*) AS total FROM plans"
    ).get().total;

    const totalSubscriptions = db.prepare(
        "SELECT COUNT(*) AS total FROM subscriptions"
    ).get().total;

    const totalCustomers = db.prepare(
        "SELECT COUNT(*) AS total FROM users WHERE role = 'customer'"
    ).get().total;

    const revenueReceived = db.prepare(
        "SELECT COALESCE(SUM(amount), 0) AS total FROM payments"
    ).get().total;

    const outstanding = db.prepare(`
        SELECT COALESCE(SUM(i.total - COALESCE(p.paid, 0)), 0) AS total
        FROM invoices i
        LEFT JOIN (
            SELECT invoice_id, SUM(amount) AS paid
            FROM payments GROUP BY invoice_id
        ) p ON p.invoice_id = i.id
        WHERE i.status != 'cancelled'
    `).get().total;

    res.json({
        success: true,
        role: req.user.role,
        totalProducts,
        totalPlans,
        totalSubscriptions,
        totalCustomers,
        revenueReceived,
        outstanding
    });
});

// --------------------
// START SERVER
// --------------------

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
