import express from 'express';
import { CartItem } from '../models/CartItem.js';
import { Product } from '../models/Product.js';
import { DeliveryOption } from '../models/DeliveryOption.js';

const router = express.Router();

// GET /api/cart-items（只回傳當前使用者的購物車）
router.get('/', async (req, res) => {
  const expand = req.query.expand;
  let cartItems = await CartItem.findAll({ where: { userId: req.userId } });

  if (expand === 'product') {
    cartItems = await Promise.all(cartItems.map(async (item) => {
      const product = await Product.findByPk(item.productId);
      return {
        ...item.toJSON(),
        product
      };
    }));
  }

  res.json(cartItems);
});

// POST /api/cart-items（加入購物車，關聯當前使用者）
router.post('/', async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await Product.findByPk(productId);
  if (!product) {
    return res.status(400).json({ error: 'Product not found' });
  }

  if (typeof quantity !== 'number' || quantity < 1 || quantity > 10) {
    return res.status(400).json({ error: 'Quantity must be a number between 1 and 10' });
  }

  // 只在當前使用者的購物車裡尋找
  let cartItem = await CartItem.findOne({ where: { productId, userId: req.userId } });
  if (cartItem) {
    cartItem.quantity += quantity;
    await cartItem.save();
  } else {
    cartItem = await CartItem.create({ productId, quantity, deliveryOptionId: '1', userId: req.userId });
  }

  res.status(201).json(cartItem);
});

// PUT /api/cart-items/:productId（更新當前使用者的購物車項目）
router.put('/:productId', async (req, res) => {
  const { productId } = req.params;
  const { quantity, deliveryOptionId } = req.body;

  const cartItem = await CartItem.findOne({ where: { productId, userId: req.userId } });
  if (!cartItem) {
    return res.status(404).json({ error: 'Cart item not found' });
  }

  if (quantity !== undefined) {
    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be a number greater than 0' });
    }
    cartItem.quantity = quantity;
  }

  if (deliveryOptionId !== undefined) {
    const deliveryOption = await DeliveryOption.findByPk(deliveryOptionId);
    if (!deliveryOption) {
      return res.status(400).json({ error: 'Invalid delivery option' });
    }
    cartItem.deliveryOptionId = deliveryOptionId;
  }

  await cartItem.save();
  res.json(cartItem);
});

// DELETE /api/cart-items/:productId（刪除當前使用者的購物車項目）
router.delete('/:productId', async (req, res) => {
  const { productId } = req.params;

  const cartItem = await CartItem.findOne({ where: { productId, userId: req.userId } });
  if (!cartItem) {
    return res.status(404).json({ error: 'Cart item not found' });
  }

  await cartItem.destroy();
  res.status(204).send();
});

export default router;
