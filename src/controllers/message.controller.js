// Message Controller
import Message from '#models/message.model.js';

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
        message.readAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/g, '')
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
        const deleteDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/g, '')
        let statusMsg = '';
        if (req.body.deletedBy === message.senderId) {
          message.deletedBySender = deleteDate;
          await message.save();
          statusMsg = 'Message deleted successfully by sender';
        }
        if (req.body.deletedBy === message.recipientId) {
          message.deletedByRecipient = new Date().toISOString().replace(/T/, ' ').replace(/\..+/g, '')
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