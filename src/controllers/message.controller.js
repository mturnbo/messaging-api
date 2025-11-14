// Message Controller
import Message from '#models/message.model.js';
import { formatDateToMySQL } from "#utils/datetime.js";

const MessageController = {
  createMessage: async (req, res) => {
    const {task, createdDate, percentCompleted, isCompleted} = req.body;
    try {
      const newMessage = await Message.create(req.body);
      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({error: 'Internal Server Error'});
    }
  },

  getMessageById: async (req, res) => {
    const id = req.params.id;
    try {
      const message = await Message.findByPk(id);
      if (message) {
        res.status(200).json(message);
      } else {
        res.status(404).json({error: 'Message not found'});
      }
    } catch (error) {
      res.status(500).json({error: 'Internal Server Error'});
    }
  },

  readMessage: async (req, res) => {
    const id = req.body.id;
    try {
      const message = await Message.findByPk(id);
      if (message) {
        message.readAt = formatDateToMySQL(new Date());
        message.readerAddress = req.body.readerAddress;
        await message.save();
        res.status(200).json({ status: 'Message read successfully' });
      } else {
        res.status(404).json({error: 'Message not found'});
      }
    } catch (error) {
      res.status(500).json({error: 'Internal Server Error'});
    }
  },

  deleteMessage: async (req, res) => {
    const id = req.body.id;
    try {
      const message = await Message.findByPk(id);
      if (message) {
        const deleteDate = formatDateToMySQL(new Date());
        let statusMsg = '';
        if (req.body.deletedBy === message.senderId) {
          message.deletedBySender = deleteDate;
          await message.save();
          statusMsg = 'Message deleted successfully by sender';
        }
        if (req.body.deletedBy === message.recipientId) {
          message.deletedByRecipient = formatDateToMySQL(new Date());
          await message.save();
          statusMsg = 'Message deleted successfully by recipient';
        }
        res.status(200).json({ status: statusMsg });
      } else {
        res.status(404).json({error: 'Message not found'});
      }
    } catch (error) {
      res.status(500).json({error: 'Internal Server Error'});
    }
  }
}

export default MessageController;