import express from 'express';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { DeliveryOption } from '../models/DeliveryOption.js';
import { CartItem } from '../models/CartItem.js';

const router = express.Router();

// GET /api/orders（只回傳當前使用者的訂單）
router.get('/', async (req, res) => {
  const expand = req.query.expand;
  let orders = await Order.unscoped().findAll({
    where: { userId: req.userId },
    order: [['orderTimeMs', 'DESC']]
  });

  if (expand === 'products') {
    orders = await Promise.all(orders.map(async (order) => {
      const products = await Promise.all(order.products.map(async (product) => {
        const productDetails = await Product.findByPk(product.productId);
        return {
          ...product,
          product: productDetails
        };
      }));
      return {
        ...order.toJSON(),
        products
      };
    }));
  }

  res.json(orders);
});

// POST /api/orders（從當前使用者的購物車建立訂單）
router.post('/', async (req, res) => {
  // 只取當前使用者的購物車
  const cartItems = await CartItem.findAll({ where: { userId: req.userId } });

  if (cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  let totalCostCents = 0;
  const products = await Promise.all(cartItems.map(async (item) => {
    const product = await Product.findByPk(item.productId);
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }
    const deliveryOption = await DeliveryOption.findByPk(item.deliveryOptionId);
    if (!deliveryOption) {
      throw new Error(`Invalid delivery option: ${item.deliveryOptionId}`);
    }
    const productCost = product.priceCents * item.quantity;
    const shippingCost = deliveryOption.priceCents;
    totalCostCents += productCost + shippingCost;
    const estimatedDeliveryTimeMs = Date.now() + deliveryOption.deliveryDays * 24 * 60 * 60 * 1000;
    return {
      productId: item.productId,
      quantity: item.quantity,
      estimatedDeliveryTimeMs
    };
  }));

  totalCostCents = Math.round(totalCostCents * 1.1);

  // 建立訂單時關聯當前使用者
  const order = await Order.create({
    orderTimeMs: Date.now(),
    totalCostCents,
    products,
    userId: req.userId,
  });

  // 只清空當前使用者的購物車
  await CartItem.destroy({ where: { userId: req.userId } });

  res.status(201).json(order);
});

// GET /api/orders/:orderId（取得單筆訂單，並確認屬於當前使用者）
router.get('/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const expand = req.query.expand;

  let order = await Order.findByPk(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // 確認訂單屬於當前使用者
  if (order.userId !== req.userId) {
    return res.status(403).json({ error: 'Access denied.' });
  }

  if (expand === 'products') {
    const products = await Promise.all(order.products.map(async (product) => {
      const productDetails = await Product.findByPk(product.productId);
      return {
        ...product,
        product: productDetails
      };
    }));
    order = {
      ...order.toJSON(),
      products
    };
  }

  res.json(order);
});

export default router;
