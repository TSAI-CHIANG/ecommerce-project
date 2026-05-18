import { DataTypes } from 'sequelize';
import { sequelize } from './index.js'; // 引入你在 index.js 建立好的「資料庫連線」

export const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true, // nullable：相容舊有資料
  },
  orderTimeMs: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  totalCostCents: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  products: {
    type: DataTypes.JSON,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE(3)
  },
  updatedAt: {
    type: DataTypes.DATE(3)
  },
}, {
  defaultScope: {
    order: [['createdAt', 'ASC']]
  }
});
