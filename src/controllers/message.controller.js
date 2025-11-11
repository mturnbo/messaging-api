// Message Controller
import Message from '#models/message.model.js';

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