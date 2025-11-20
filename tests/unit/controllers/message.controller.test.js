import { jest } from "@jest/globals";
import sinon from 'sinon';
import MessageController from '../../../src/controllers/message.controller';
import Message from '../../../src/models/message.model';
import { formatDateToMySQL } from '../../../src/utils/datetime.js';

jest.mock('../../../src/utils/datetime.js', () => ({
  formatDateToMySQL: jest.fn(() => '2024-01-01 00:00:00')
}));

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


});