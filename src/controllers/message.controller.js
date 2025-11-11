// Message Controller
import Message from '#models/message.model.js';
import { formatDateToMySQL } from "#utils/datetime.js";

const MessageController = {
  test: async (req, res) => {
    res.json({message: "test"})
  },

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
        res.json(message);
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
    const id = req.params.id;
    try {
      const message = await Message.findByPk(id);
      if (message) {
        await message.destroy();
        res.json(message);
      } else {
        res.status(404).json({error: 'Message not found'});
      }
    } catch (error) {
      res.status(500).json({error: 'Internal Server Error'});
    }
  }
}

export default MessageController;