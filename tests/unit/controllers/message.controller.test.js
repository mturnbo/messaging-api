import { beforeEach, jest } from "@jest/globals";
import sinon from 'sinon';
import MessageController from '#controllers/message.controller';
import Message from '#models/message.model';

describe('MessageController', () => {
  let req, res, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  afterEach(() => {
    sandbox.restore();
    jest.clearAllMocks();
  });

  describe('createMessage', () => {
    it('should create a new message successfully', async () => {
      const mockMessageData = {
        task: 'Test task',
        createdDate: '2024-01-01',
        percentCompleted: 50,
        isCompleted: false
      };
      const mockCreatedMessage = {id: 1, ...mockMessageData};

      req.body = mockMessageData;
      sandbox.stub(Message, 'create').resolves(mockCreatedMessage);

      await MessageController.createMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreatedMessage);
    });

    it('should handle errors when creating message fails', async () => {
      req.body = { task: 'Test' };
      sandbox.stub(Message, 'create').rejects(new Error('Database error'));

      await MessageController.createMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('getMessageById', () => {
    it('should return a message when found', async () => {
      const mockMessage = { id: 1, subject: 'Test', body: 'Test body' };
      req.params.id = '1';

      sandbox.stub(Message, 'findByPk').resolves(mockMessage);

      await MessageController.getMessageById(req, res);

      sandbox.assert.calledWith(Message.findByPk, '1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockMessage);
    });

    it('should return 404 when message not found', async () => {
      req.params.id = '999';
      sandbox.stub(Message, 'findByPk').resolves(null);

      await MessageController.getMessageById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Message not found' });
    });

    it('should handle errors when fetching message', async () => {
      req.params.id = '1';
      sandbox.stub(Message, 'findByPk').rejects(new Error('Database error'));

      await MessageController.getMessageById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('readMessage', () => {
    beforeEach(() => {
      jest.useFakeTimers(); // Enable fake timers
      jest.setSystemTime(new Date('2024-01-01T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers(); // Restore real timers after each test
    });

    it('should mark message as read successfully', async () => {
      const mockDate = '2024-01-01 12:00:00';
      const mockMessage = {
        id: 1,
        readAt: null,
        readerAddress: null,
        save: jest.fn().mockResolvedValue(true)
      };

      req.body = { id: 1, readerAddress: '192.168.1.1' };
      sandbox.stub(Message, 'findByPk').resolves(mockMessage);

      await MessageController.readMessage(req, res);

      expect(mockMessage.readAt).toBe(mockDate);
      expect(mockMessage.readerAddress).toBe('192.168.1.1');
      expect(mockMessage.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: 'Message read successfully' });
    });

    it('should return 404 when message not found', async () => {
      req.body = { id: 999, readerAddress: '192.168.1.1' };
      sandbox.stub(Message, 'findByPk').resolves(null);

      await MessageController.readMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Message not found' });
    });

    it('should handle errors when reading message', async () => {
      req.body = { id: 1, readerAddress: '192.168.1.1' };
      sandbox.stub(Message, 'findByPk').rejects(new Error('Database error'));

      await MessageController.readMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('deleteMessage', () => {
    beforeEach(() => {
      jest.useFakeTimers(); // Enable fake timers
      jest.setSystemTime(new Date('2024-01-01T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers(); // Restore real timers after each test
    });

    it('should delete message by sender successfully', async () => {
      const mockDate = '2024-01-01 12:00:00';
      const mockMessage = {
        id: 1,
        senderId: 100,
        recipientId: 200,
        deletedBySender: null,
        deletedByRecipient: null,
        save: jest.fn().mockResolvedValue(true)
      };

      req.body = {id: 1, deletedBy: 100};
      sandbox.stub(Message, 'findByPk').resolves(mockMessage);

      await MessageController.deleteMessage(req, res);

      expect(mockMessage.deletedBySender).toBe(mockDate);
      expect(mockMessage.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'Message deleted successfully by sender'
      });
    });

    it('should delete message by recipient successfully', async () => {
      const mockDate = '2024-01-01 12:00:00';
      const mockMessage = {
        id: 1,
        senderId: 100,
        recipientId: 200,
        deletedBySender: null,
        deletedByRecipient: null,
        save: jest.fn().mockResolvedValue(true)
      };

      req.body = {id: 1, deletedBy: 200};
      sandbox.stub(Message, 'findByPk').resolves(mockMessage);

      await MessageController.deleteMessage(req, res);

      expect(mockMessage.deletedByRecipient).toBe(mockDate);
      expect(mockMessage.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'Message deleted successfully by recipient'
      });
    });

    it('should return 404 when message not found', async () => {
      req.body = {id: 999, deletedBy: 100};
      sandbox.stub(Message, 'findByPk').resolves(null);

      await MessageController.deleteMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({error: 'Message not found'});
    });

    it('should handle errors when deleting message', async () => {
      req.body = {id: 1, deletedBy: 100};
      sandbox.stub(Message, 'findByPk').rejects(new Error('Database error'));

      await MessageController.deleteMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({error: 'Internal Server Error'});
    });
  });
});