// Thread Messages Model

import { DataTypes, Model } from "sequelize";
import sequelize from '#config/database.js';

class ThreadMessage extends Model {};

ThreadMessage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      field: 'id',
    },
    msgId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      field: 'msg_id',
    },
    replyTo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      field: 'reply_to',
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'ThreadMessage',
    tableName: 'thread-messages',
  }
);

ThreadMessage.associate = (models) => {
  this.belongsTo(models.Message, {
    as: 'message',
    foreignKey: { name: 'msgId', type: DataTypes.INTEGER },
  });
}

export default ThreadMessage;
