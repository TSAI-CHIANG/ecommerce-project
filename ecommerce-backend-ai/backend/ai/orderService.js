// backend/ai/orderService.js
import { Op } from 'sequelize';
import { Order } from '../../models/Order.js';
import { Product } from '../../models/Product.js';

/**
 * 從使用者訊息文字中抓出看起來像訂單編號的字串。
 * 目前 Order.id 是 UUID，所以這裡先用簡單規則抓「含英數 + dash，長度 >= 10」的片段。
 * 之後如果有明確的訂單編號格式，可以再調整 regex。
 */
export function extractOrderIdsFromMessage(message) {
  if (!message || typeof message !== 'string') return [];

  const matches = message.match(/[0-9a-fA-F-]{10,}/g);
  return matches || [];
}

/**
 * 依照訂單編號從 DB 查詢，並補上每個商品的名稱。
 * 使用批次查詢避免 N+1 問題。
 */
export async function findOrdersByIds(orderIds) {
  if (!orderIds || orderIds.length === 0) return [];

  const orders = await Order.unscoped().findAll({
    where: { id: orderIds },
    order: [['orderTimeMs', 'DESC']],
  });

  if (orders.length === 0) return [];

  // 收集所有 productId，批次查一次 Product 表
  const allProductIds = orders.flatMap((o) =>
    (o.products || []).map((p) => p.productId)
  );
  const uniqueProductIds = [...new Set(allProductIds)];

  const productRecords = await Product.findAll({
    where: { id: { [Op.in]: uniqueProductIds } },
    attributes: ['id', 'name'],
  });

  // 建立 id -> name 的查找表
  const productNameMap = Object.fromEntries(
    productRecords.map((p) => [p.id, p.name])
  );

  // 把 productName 補進每筆訂單的 products 陣列
  return orders.map((o) => {
    const order = o.toJSON();
    order.products = (order.products || []).map((p) => ({
      ...p,
      productName: productNameMap[p.productId] ?? '（找不到商品名稱）',
    }));
    return order;
  });
}
