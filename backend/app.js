const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const prescriptionRoutes = require('./routes/prescription.routes');
const orderService = require('./services/order.service');

const app = express();

const allowedOrigins = process.env.CLIENT_ORIGIN
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
app.use(cors({
    origin: allowedOrigins?.length ? allowedOrigins : true
}));
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
    res.send('Medicine E-commerce Backend is running');
});

app.use('/api/users', userRoutes);

app.use('/api/products', productRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
    console.error('Request failed:', error.message);
    const statusCode = error.statusCode
        || error.status
        || (error.code === 11000 ? 409 : 0)
        || (error.name === 'ValidationError' || error.name === 'CastError' ? 400 : 500);
    res.status(statusCode).json({
        message: statusCode >= 500 ? 'Internal server error' : error.message
    });
});

const startServer = async () => {
    try {
        await connectDB();
        await orderService.recoverCancelledOrders();

        const port = process.env.PORT || 5000;

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

    } catch (err) {
        console.error('Failed to start server:', err.message);
        process.exit(1);
    }
};

startServer();

module.exports = app;