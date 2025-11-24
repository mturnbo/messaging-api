// Message Model
/*
create table messaging.messages
(
    id                      int auto_increment primary key,
    sender_id               int                                  not null,
    recipient_id            int                                  not null,
    subject                 varchar(255)                         null,
    body                    text                                 not null,
    sent_at                 timestamp  default CURRENT_TIMESTAMP null,
    sender_address          varchar(20)                          null,
    read_at                 timestamp                            null,
    reader_address          varchar(20)                          null,
    is_deleted_by_sender    tinyint(1) default 0                 null,
    is_deleted_by_recipient tinyint(1) default 0                 null,
    constraint messages_ibfk_1
        foreign key (sender_id) references messaging.users (id)
            on delete cascade,
    constraint messages_ibfk_2
        foreign key (recipient_id) references messaging.users (id)
            on delete cascade
);
*/


import {DataTypes, Model} from 'sequelize';
import sequelize from '#config/database.js';

class Message extends Model {};

Message.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    field: 'id',
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'sender_id',
  },
  recipientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'recipient_id',
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'subject',
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  sentAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    field: 'sent_at',
  },
  senderAddress: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'sender_address',
    validate: {
      isIP: true,
    },
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'read_at',
  },
  readerAddress: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'reader_address',
    validate: {
      isIP: true,
    },
  },
  deletedBySender: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'deleted_by_sender',
  },
  deletedByRecipient: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'deleted_by_recipient',
  },
},
  {
    sequelize,
    timestamps: false,
    modelName: 'Message',
    tableName: 'messages',
  });

/*
const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    field: 'id',
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'sender_id',
  },
  recipientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'recipient_id',
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'subject',
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  sentAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    field: 'sent_at',
  },
  senderAddress: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'sender_address',
    validate: {
      isIP: true,
    },
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'read_at',
  },
  readerAddress: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'reader_address',
    validate: {
      isIP: true,
    },
  },
  deletedBySender: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'deleted_by_sender',
  },
  deletedByRecipient: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'deleted_by_recipient',
  },
},
{
  timestamps: false,
  freezeTableName: false,
  modelName: 'Message',
  tableName: 'messages',
});

 */

Message.associate = (models) => {
  this.belongsTo(models.User, {
    as: 'user',
    foreignKey: { name: 'senderId', type: DataTypes.INTEGER },
    foreignKey: { name: 'recipientId', type: DataTypes.INTEGER },
  });
}

export default Message;
