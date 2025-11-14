// User Controller
import User from '#models/user.model.js';
import { Op } from "sequelize";

const defaultAttributes = ['id', 'username', 'email', 'firstName', 'lastName', 'deviceAddress', 'dateCreated', 'lastLogin'];

const UserController = {
  test: async (req, res) => {
    res.json({message: "test"})
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({ attributes: defaultAttributes });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },

  createUser: async (req, res) => {
    const { task, createdDate, percentCompleted, isCompleted } = req.body;
    try {
      const newUser = await User.create({
        task,
        createdDate,
        percentCompleted,
        isCompleted,
      });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getUserById: async (req, res) => {
    const id = req.params.id;
    try {
      const user = await User.findOne({
        where: {
          [Op.or]: [
            { id: id },
            { username: id }
          ]
        },
        attributes: defaultAttributes,
      });
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateUser: async (req, res) => {
    const id = req.params.id;
    const { task, createdDate, percentCompleted, isCompleted } = req.body;
    try {
      const user = await User.findByPk(id);
      if (user) {
        user.task = task;
        user.createdDate = createdDate;
        user.percentCompleted = percentCompleted;
        user.isCompleted = isCompleted;
        await user.save();
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deleteUser: async (req, res) => {
    const id = req.params.id;
    try {
      const user = await User.findByPk(id);
      if (user) {
        await user.destroy();
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export default UserController;
