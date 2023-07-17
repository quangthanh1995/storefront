"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../models/order");
const verifyAuthToken_1 = __importDefault(require("./verifyAuthToken"));
const store = new order_1.OrderStore();
const create = async (req, res) => {
    try {
        const order = {
            user_id: req.body.user_id,
            product_id: req.body.product_id,
            quantity: req.body.quantity,
            status: req.body.status,
        };
        const newOrder = await store.create(order);
        res.json(newOrder);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const currentOrderByUser = async (req, res) => {
    try {
        const orders = await store.currentOrderByUser(req.params.user_id);
        res.json(orders);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const completedOrdersByUser = async (req, res) => {
    try {
        const orders = await store.completedOrdersByUser(req.params.user_id);
        res.json(orders);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const orderRoutes = (app) => {
    app.post('/orders', verifyAuthToken_1.default, create);
    app.get('/orders/:user_id', verifyAuthToken_1.default, currentOrderByUser);
    app.get('/orders/completedOrdersByUser/:user_id', verifyAuthToken_1.default, completedOrdersByUser);
};
exports.default = orderRoutes;
