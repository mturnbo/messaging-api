// Message Controller
import { Op } from 'sequelize';

import { QUERIES } from '#config/constants.js';
import sequelize from '#config/database.js';
import Message from '#models/message.model.js';
import Thread from '#models/thread.model.js';
import ThreadMessage from '#models/thread-messages.model.js';

const formatTimestamp = () => new Date().toISOString().replace(/T/, ' ').replace(/\..+/g, '');

const findThreadForMessage = async (messageId, transaction) => {
  const originThread = await Thread.findOne({
    where: { originMsg: messageId },
    transaction,
  });

  if (originThread) {
    return originThread;
  }

  const threadMessage = await ThreadMessage.findOne({
    where: { msgId: messageId },
    transaction,
  });

  if (!threadMessage) {
    return null;
  }

  return Thread.findByPk(threadMessage.threadId, { transaction });
};

const MessageController = {

  getSent: async (req, res) => {
    const senderId = parseInt(req.query.senderId);
    const limit = parseInt(req.query.limit) || QUERIES.DEFAULT_LIMIT;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const offset = (page - 1) * limit;

    if (!senderId || isNaN(senderId)) {
      return res.status(400).json({ error: 'senderId query param is required' });
    }

    try {
      const { count, rows } = await Message.findAndCountAll({
        where: {
          senderId,
          deletedBySender: { [Op.is]: null },
        },
        order: [['sentAt', 'DESC']],
        limit,
        offset,
      });
      return res.status(200).json({ messages: rows, total: count, page, limit });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getInbox: async (req, res) => {
    const recipientId = parseInt(req.query.recipientId);
    const limit = parseInt(req.query.limit) || QUERIES.DEFAULT_LIMIT;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const offset = (page - 1) * limit;

    if (!recipientId || isNaN(recipientId)) {
      return res.status(400).json({ error: 'recipientId query param is required' });
    }

    try {
      const { count, rows } = await Message.findAndCountAll({
        where: {
          recipientId,
          deletedByRecipient: { [Op.is]: null },
        },
        order: [['sentAt', 'DESC']],
        limit,
        offset,
      });
      return res.status(200).json({ messages: rows, total: count, page, limit });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  createMessage: async (req, res) => {
    try {
      const newMessage = await Message.create(req.body);
      return res.status(201).json(newMessage);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  replyToMessage: async (req, res) => {
    const replyToId = parseInt(req.body.replyToId);

    if (!replyToId || isNaN(replyToId)) {
      return res.status(400).json({ error: 'replyToId is required' });
    }

    try {
      const result = await sequelize.transaction(async (transaction) => {
        const parentMessage = await Message.findByPk(replyToId, { transaction });

        if (!parentMessage) {
          return { status: 404, payload: { error: 'Message not found' } };
        }

        let thread = await findThreadForMessage(replyToId, transaction);
        if (!thread) {
          thread = await Thread.create({ originMsg: replyToId }, { transaction });
        }

        const replyPayload = { ...req.body };
        delete replyPayload.replyToId;

        const replyMessage = await Message.create(replyPayload, { transaction });

        await ThreadMessage.create(
          {
            threadId: thread.id,
            msgId: replyMessage.id,
            replyTo: replyToId,
          },
          { transaction }
        );

        return {
          status: 201,
          payload: {
            ...replyMessage.toJSON(),
            threadId: thread.id,
            replyTo: replyToId,
          },
        };
      });

      return res.status(result.status).json(result.payload);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getMessageById: async (req, res) => {
    const id = req.params.id;
    try {
      const message = await Message.findByPk(id);
      if (message) {
        return res.status(200).json(message);
      }
      return res.status(404).json({ error: 'Message not found' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getThreadByMessageId: async (req, res) => {
    const messageId = parseInt(req.params.id);

    if (!messageId || isNaN(messageId)) {
      return res.status(400).json({ error: 'Valid message id is required' });
    }

    try {
      const message = await Message.findByPk(messageId);

      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }

      const thread = await findThreadForMessage(messageId);
      if (!thread) {
        return res.status(200).json({ thread: null, messages: [message] });
      }

      const threadMessages = await ThreadMessage.findAll({
        where: { threadId: thread.id },
        order: [['msgId', 'ASC']],
      });

      const relatedMessageIds = [
        thread.originMsg,
        ...threadMessages.map((entry) => entry.msgId),
      ];

      const messages = await Message.findAll({
        where: { id: relatedMessageIds },
        order: [['sentAt', 'ASC']],
      });

      const replyIndex = new Map(
        threadMessages.map((entry) => [entry.msgId, entry.replyTo])
      );

      return res.status(200).json({
        thread: {
          id: thread.id,
          originMsg: thread.originMsg,
          dateCreated: thread.dateCreated,
        },
        messages: messages.map((entry) => ({
          ...entry.toJSON(),
          replyTo: replyIndex.get(entry.id) ?? null,
        })),
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  readMessage: async (req, res) => {
    const id = req.body.id;
    try {
      const message = await Message.findByPk(id);
      if (message) {
        message.readAt = formatTimestamp();
        message.readerAddress = req.body.readerAddress;
        await message.save();
        return res.status(200).json({ status: 'Message read successfully' });
      }
      return res.status(404).json({ error: 'Message not found' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deleteMessage: async (req, res) => {
    const id = req.body.id;
    try {
      const message = await Message.findByPk(id);
      if (message) {
        const deleteDate = formatTimestamp();
        let statusMsg = '';
        if (req.body.deletedBy === message.senderId) {
          message.deletedBySender = deleteDate;
          await message.save();
          statusMsg = 'Message deleted successfully by sender';
        }
        if (req.body.deletedBy === message.recipientId) {
          message.deletedByRecipient = formatTimestamp();
          await message.save();
          statusMsg = 'Message deleted successfully by recipient';
        }
        return res.status(200).json({ status: statusMsg });
      }
      return res.status(404).json({ error: 'Message not found' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export default MessageController;
