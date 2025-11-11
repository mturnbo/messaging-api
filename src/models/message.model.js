// Message Model
/*
create table messaging.messages
(
    id                      int auto_increment
        primary key,
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


import { DataTypes } from 'sequelize';
import sequelize from '#config/database.js';

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
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'sent_at',
  },
  senderAddress: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'sender_address',
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
  },
  isDeletedBySender: {
    type: DataTypes.BOOLEAN,
    field: 'is_deleted_by_sender',
  },
  isDeletedByRecipient: {
    type: DataTypes.BOOLEAN,
    field: 'is_deleted_by_recipient',
  },
},
{
  timestamps: false,
  freezeTableName: false,
});

export default Message;
