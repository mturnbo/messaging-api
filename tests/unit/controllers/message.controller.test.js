import MessageController from '../../../src/controllers/message.controller';
import Message from '../../../src/models/message.model';
import { formatDateToMySQL } from '../../../src/utils/datetime.js';
import sinon from 'sinon';
import {jest} from "@jest/globals";

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

  it('should create a new message successfully', async () => {
    const mockMessageData = {
      task: 'Test task',
      createdDate: '2024-01-01',
      percentCompleted: 50,
      isCompleted: false
    };
    const mockCreatedMessage = { id: 1, ...mockMessageData };

    req.body = mockMessageData;
    sandbox.stub(Message, 'create').resolves(mockCreatedMessage);

    await MessageController.createMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockCreatedMessage);
  });

});